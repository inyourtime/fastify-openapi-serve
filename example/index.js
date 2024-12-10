const path = require('node:path')

const Fastify = require('fastify')
const fastifyApiReference = require('@scalar/fastify-api-reference')

const fastifyOpenapiServe = require('..')

const fastify = Fastify()

fastify.register(fastifyOpenapiServe, {
  specDir: path.join(__dirname, 'specs'),
  specDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD API Example',
      version: '1.0.0',
      description: 'A sample CRUD API for managing items.'
    },
  }
})

fastify.register(fastifyApiReference, {
  routePrefix: '/docs',
  configuration: {
    spec: {
      url: '/openapi/json'
    }
  }
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
  console.log('Documentation available on http://localhost:3000/docs')
})
