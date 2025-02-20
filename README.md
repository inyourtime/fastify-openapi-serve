# fastify-openapi-serve

[![CI](https://github.com/inyourtime/fastify-openapi-serve/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/inyourtime/fastify-openapi-serve/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/fastify-openapi-serve.svg?style=flat)](https://www.npmjs.com/package/fastify-openapi-serve)

Fastify plugin that merges OpenAPI specifications from multiple files and serves the merged output as JSON or YAML. This plugin simplifies managing modular OpenAPI specifications, enabling dynamic merging and serving of your API definitions. It also includes a built-in API reference UI.

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
  routePrefix: '/docs', // Base route for serving the OpenAPI specification
  specDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
  },
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('API Reference on http://localhost:3000/docs');
  console.log('OpenAPI (JSON) on http://localhost:3000/docs/openapi.json');
  console.log('OpenAPI (YAML) on http://localhost:3000/docs/openapi.yaml');
});

```

## Options

- `specDir` (required): directory path or an array of directory paths containing OpenAPI specification files (`.yaml`, `.yml`, `.json`).
- `routePrefix` (optional): The base route prefix for serving the specification. Default: `/docs`.
- `merge` (optional): A custom function to define how multiple specifications are merged. The function receives an array of parsed specifications.
- `specDefinition` (optional): The base OpenAPI definition that will be included in the merged result.
- `ui` (optional): Serve OpenAPI with UI. Default: `true`.
- `scalarConfig` (optional): Scalar configuration, refers to [Scalar config](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)
- `scalarCdn` (optional): Scalar CDN. Default: `https://cdn.jsdelivr.net/npm/@scalar/api-reference`

## Routes

The plugin exposes the following routes:
- `GET /<routePrefix>` Serves the API Reference UI.
- `GET /<routePrefix>/openapi.json` Returns the specification in JSON format.
- `GET /<routePrefix>/openapi.yaml` Returns the specification in YAML format.

## Example

If you set routePrefix: `'/docs'`, the plugin will expose the following routes:
- `GET /docs` Serves the API Reference UI.
- `GET /docs/openapi.json` Serves the specification in JSON format.
- `GET /docs/openapi.yaml` Serves the specification in YAML format.

## Features

- **Glob Support**: Automatically finds OpenAPI files (`.yaml`, `.yml`, `.json`) in the specified directories.
- **Custom Merging Logic**: Supports user-defined merging strategies.
- **Multiple Formats**: Serves the merged specification in both JSON and YAML formats.
- **Integrated API Reference UI**: Provides a user-friendly interface for exploring and interacting with your API documentation.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/inyourtime/fastify-openapi-serve/blob/main/LICENSE) file for details.
