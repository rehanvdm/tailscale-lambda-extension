import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface TailscaleLambdaExtensionProps {
  readonly options?: lambda.LayerVersionOptions;
}

/**
 * A Lambda Layer that contains the Tailscale extension. It starts the Tailscale daemon and connects to the Tailscale
 * network exposing a SOCKS5 proxy on port 1050 (`socks://localhost:1055`) to be accessed by the main Lambda runtime
 * process.
 *
 * The Lambda function using this layer supports the following environment variables:
 *
 * Required:
 * - `TS_SECRET_API_KEY` - The name of the AWS Secrets Manager secret that contains the Tailscale API Key.
 * - `TS_HOSTNAME` - The "Machine" name as shown in the Tailscale admin console.
 *
 * Optional:
 * - `TS_FUNCTION_DELAY` - The delay (in milliseconds) to apply prior to function invocation. (see [this issue](https://github.com/rehanvdm/tailscale-lambda-extension/issues/3) for more details)
 *   - **Default: 0**
 */
export class TailscaleLambdaExtension extends Construct {
  public readonly layer: lambda.LayerVersion;

  constructor(scope: Construct, id: string, props?: TailscaleLambdaExtensionProps) {
    super(scope, id);

    this.layer = new lambda.LayerVersion(scope, 'tailscale-extension', {
      ...props?.options,
      code: lambda.Code.fromAsset(path.join(__dirname, 'tailscale-extension.zip')), // See .projenrc.ts for precompile step
      compatibleArchitectures: [lambda.Architecture.X86_64],
    });

  }
}