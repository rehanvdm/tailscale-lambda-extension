# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### TailscaleLambdaExtension <a name="TailscaleLambdaExtension" id="tailscale-lambda-extension.TailscaleLambdaExtension"></a>

A Lambda Layer that contains the Tailscale extension.

It starts the Tailscale daemon and connects to the Tailscale
network exposing a SOCKS5 proxy on port 1050 (`socks://localhost:1055`) to be accessed by the main Lambda runtime
process.

The Lambda function using this layer requires the following Environment Variables:
- `TS_SECRET_API_KEY` - The name of the AWS Secrets Manager secret that contains the Tailscale API Key.
- `TS_HOSTNAME` - The "Machine" name as shown in the Tailscale admin console.

#### Initializers <a name="Initializers" id="tailscale-lambda-extension.TailscaleLambdaExtension.Initializer"></a>

```typescript
import { TailscaleLambdaExtension } from 'tailscale-lambda-extension'

new TailscaleLambdaExtension(scope: Construct, id: string, props: TailscaleLambdaExtensionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtension.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtension.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtension.Initializer.parameter.props">props</a></code> | <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtensionProps">TailscaleLambdaExtensionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="tailscale-lambda-extension.TailscaleLambdaExtension.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="tailscale-lambda-extension.TailscaleLambdaExtension.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="tailscale-lambda-extension.TailscaleLambdaExtension.Initializer.parameter.props"></a>

- *Type:* <a href="#tailscale-lambda-extension.TailscaleLambdaExtensionProps">TailscaleLambdaExtensionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtension.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="tailscale-lambda-extension.TailscaleLambdaExtension.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtension.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="tailscale-lambda-extension.TailscaleLambdaExtension.isConstruct"></a>

```typescript
import { TailscaleLambdaExtension } from 'tailscale-lambda-extension'

TailscaleLambdaExtension.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="tailscale-lambda-extension.TailscaleLambdaExtension.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtension.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtension.property.layer">layer</a></code> | <code>aws-cdk-lib.aws_lambda.LayerVersion</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="tailscale-lambda-extension.TailscaleLambdaExtension.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `layer`<sup>Required</sup> <a name="layer" id="tailscale-lambda-extension.TailscaleLambdaExtension.property.layer"></a>

```typescript
public readonly layer: LayerVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.LayerVersion

---


## Structs <a name="Structs" id="Structs"></a>

### TailscaleLambdaExtensionProps <a name="TailscaleLambdaExtensionProps" id="tailscale-lambda-extension.TailscaleLambdaExtensionProps"></a>

#### Initializer <a name="Initializer" id="tailscale-lambda-extension.TailscaleLambdaExtensionProps.Initializer"></a>

```typescript
import { TailscaleLambdaExtensionProps } from 'tailscale-lambda-extension'

const tailscaleLambdaExtensionProps: TailscaleLambdaExtensionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#tailscale-lambda-extension.TailscaleLambdaExtensionProps.property.options">options</a></code> | <code>aws-cdk-lib.aws_lambda.LayerVersionOptions</code> | *No description.* |

---

##### `options`<sup>Optional</sup> <a name="options" id="tailscale-lambda-extension.TailscaleLambdaExtensionProps.property.options"></a>

```typescript
public readonly options: LayerVersionOptions;
```

- *Type:* aws-cdk-lib.aws_lambda.LayerVersionOptions

---



