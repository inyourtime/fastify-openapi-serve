# fastify-openapi-serve

`fastify-openapi-serve` is a `Fastify` plugin that merges OpenAPI specifications from multiple files and serves the merged output as JSON or YAML. This plugin simplifies managing modular OpenAPI specifications, enabling dynamic merging and serving of your API definitions.

## Installation

Install the plugin using npm
```bash
npm install fastify-openapi-serve
```

## Usage

Register the plugin in your Fastify application and specify the required options:
```javascript
const path = require('node:path')
const fastify = require('fastify')();
const fastifyOpenapiServe = require('fastify-openapi-serve');

fastify.register(fastifyOpenapiServe, {
  specDir: path.join(__dirname, 'specs'), // Directory or array of directories containing OpenAPI files
  routePrefix: '/openapi', // Base route for serving the OpenAPI specification
  specDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
  },
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server listening on http://localhost:3000');
});

```

## Options

- `specDir` (required): directory path or an array of directory paths containing OpenAPI specification files (`.yaml`, `.yml`, `.json`).
- `routePrefix` (optional): The base route prefix for serving the specification. Default: `/openapi`.
- `merge` (optional): A custom function to define how multiple specifications are merged. The function receives an array of parsed specifications.
- `specDefinition` (optional): The base OpenAPI definition that will be included in the merged result.

## Routes

The plugin exposes two routes for serving the OpenAPI specification:
- `GET <routePrefix>/json` Returns the specification in JSON format.
- `GET <routePrefix>/yaml` Returns the specification in YAML format.

## Example

If you set routePrefix: `'/docs'`, the plugin will expose the following routes:
- `GET /docs/json` Serves the specification in JSON format.
- `GET /docs/yaml` Serves the specification in YAML format.

## Features

- **Glob Support**: Automatically finds OpenAPI files (`.yaml`, `.yml`, `.json`) in the specified directories.
- **Custom Merging Logic**: Supports user-defined merging strategies.
- **Multiple Formats**: Serves the merged specification in both JSON and YAML formats.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/inyourtime/fastify-openapi-serve/blob/main/LICENSE) file for details.
