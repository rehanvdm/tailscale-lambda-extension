# Tailscale Lambda Extension

[![npm version](https://badge.fury.io/js/tailscale-lambda-extension.svg)](https://badge.fury.io/js/tailscale-lambda-extension)
[![PyPI version](https://badge.fury.io/py/tailscale-lambda-extension.svg)](https://badge.fury.io/py/tailscale-lambda-extension)

A CDK construct that creates an AWS Lambda Layer containing Tailscale binaries, enabling Lambda functions 
to connect to your Tailscale network.

Available in CDK as a TypeScript NPM Package and Python PyPi Package.

Can be used with **ALL AWS Lambda runtimes**(Node, Python, Go, etc.) running on Amazon Linux 2023.

## Installation

```bash
npm install tailscale-lambda-extension
```

## Usage

The Lambda function using this layer requires the following Environment Variables:
- `TS_SECRET_API_KEY` - The name of the AWS Secrets Manager secret that contains the pure text Tailscale API Key.
- `TS_HOSTNAME` - The "Machine" name as shown in the Tailscale admin console that identifies the Lambda function.

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { TailscaleLambdaExtension } from 'tailscale-lambda-extension';

export class MyStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the layer
    const tailscaleExtension = new TailscaleLambdaExtension(this, 'TailscaleExtension');

    // Add the layer to your Lambda function
    const myLambda = new NodejsFunction(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: "/path/to/my/file.ts",
      handler: 'index.handler',
      layers: [tailscaleExtension.layer],
      environment: {
        TS_SECRET_API_KEY: "tailscale-api-key",
        TS_HOSTNAME: "my-lambda",
      }
    });

    // Give the Lambda and thus the Extension permission to read the Tailscale API Key Secret from Secrets Manager 
    const tsApiKeySecret = secretsmanager.Secret.fromSecretNameV2(this, "tailscale-api-key", "tailscale-api-key");
    tsApiKeySecret.grantRead(myLambda);
  }
  
}
```

## Accessing your Tailscale Network within the Lambda

The Tailscale process exposes a local SOCKS5 proxy on port 1055. You can use this proxy in your AWS runtime to route 
traffic through your Tailscale network. Here is an example of how it can be done with the `socks-proxy-agent` package 
and native `http` package in a TS Node.js function:

```bash 
npm install socks-proxy-agent aws-lambda
```

```typescript
import http from 'http';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

// Helper Function wrapping the http request and returning the response in known APIGatewayProxyResultV2
async function proxyHttpRequest(
  target: Pick<http.RequestOptions, "hostname" | "port" | "agent">,
  request: {
    path:  string,
    method: string,
    headers: Record<string, string>,
    body: string | undefined,
  }
): Promise<APIGatewayProxyResultV2> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const apiRequest = http.request({
      ...target,
      path: request.path,
      method: request.method,
      headers: request.headers,
    }, (res: http.IncomingMessage) => {
      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        const responseBody = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode || 500,
          headers: res.headers as Record<string, string>,
          body: responseBody.toString('base64'),
          isBase64Encoded: true,
        });
      });
      res.on('error', (error: Error): void => {
        console.error('Error receiving response:', error);
        reject(error);
      });
    });

    apiRequest.on('error', (error: Error): void => {
      console.error('Error sending request:', error);
      reject(error);
    });

    if (request.body != null) {
      apiRequest.write(request.body);
    }
    apiRequest.end();
  });
}

export async function handler() {
  
  const socksProxyAgent = new SocksProxyAgent('socks://localhost:1055');

  const response = await proxyHttpRequest({
      hostname: "Target IP Address that is connected to the TailScale network",
      port: "Target IP Address that is connected to the TailScale network",
      agent: socksProxyAgent,
    }, {
      path: "/test",
      headers: {
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: {
        "test": "data"
      },
    }
  );
  
}
```

## Tailscale Configuration

> [!IMPORTANT]  
> The Tailscale setup below shows the minimum configuration required.

### Tags

Tags are created for access control and to enable certain features on Auth Key, we are specifically interested in the
fact that if you tag an Auth Key, then that Auth Key will not expire. Create a tag for our Lambdas.

1. Go to your Tailscale network Access Control: https://login.tailscale.com/admin/acls/file
2. Add the tag to the top of the file in the correct property:
```json
{
    ...
	"tagOwners": {
		"tag:awslambda": [],
	},
    ...
}
```
3. Save the file.

### Auth Keys

Create a new Key on Tailscale:
1. Go to your Tailscale network, Settings, Keys https://login.tailscale.com/admin/settings/keys
2. Click "Generate auth key...".
3. Select `Reusable`
4. Select `Ephemeral`
5. Select `Tags` then Add the `tag:awslambda` tag.
6. Click on "Generate key" and copy the Auth Key to your Tailscale AWS Secrets Manager Secret (create it manually if it
   does not exist, then place the Secret name in the `TS_SECRET_API_KEY` environment variable).

## Compatibility
- Compatible with ALL AWS Lambda runtimes running on Amazon Linux 2023
- Only Supports x86_64 architecture

## Limitations
- The IP address of the Tailscale target must be used, Domain Name resolution is not set up. This is not too much of a 
  limitation/risk as the IP address of the target server can be changed from the Tailscale Admin Console if need be.
- The Layer adds about 50MB to the Lambda package size, most of which is the Tailscale binaries.
- Expect a 5-10 second addition to your cold start time due to the Tailscale process starting up.

## Implementation Details
The extension is build using the following steps:
1. Uses Docker to build the binaries in an Amazon Linux 2023 environment
2. Installs Tailscale from the official repository
3. Packages the binaries into a Lambda Layer
4. Starts the Tailscale process as an External Extension, allowing the main Runtime process to communicate with the
   Tailscale process over a local SOCKS5 proxy on port 1055.

## Resources used
Credit to the following resources for providing the necessary information to build this extension:
- https://tailscale.com/kb/1113/aws-lambda - Only shows how to use with a docker image Lambda, not extensio
- https://github.com/QuinnyPig/tailscale-layer - Most of the Layer code is based from this repository 
- https://github.com/aws-samples/aws-lambda-extensions/blob/main/custom-runtime-extension-demo/extensionssrc/extensions/extension1.sh - 
  AWS official repo showing how to start an external extension with base code for the extension (the source Corey also used) 
- https://aws.amazon.com/blogs/compute/building-a-secure-webhook-forwarder-using-an-aws-lambda-extension-and-tailscale/ - 
  Blog post showing how to build and use a Tailscale Lambda Extension. But it is overly complicated with outdated CDK code.
- https://github.com/rails-lambda/tailscale-extension/tree/main - A similar project for Lambda Container runtime language, 
  but it is not a CDK construct and it exposes the TailScale API Key as an environment variable, which is not best practice.

## License

Apache-2.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
