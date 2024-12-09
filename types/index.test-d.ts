import Fastify from 'fastify'
import fastifyOpenapiMerge, { OpenAPIDocument } from '..'
import { expectType } from 'tsd'

const app = Fastify()

app.register(fastifyOpenapiMerge, {
  specDir: ''
})

app.register(fastifyOpenapiMerge, {
  specDir: '',
  routePrefix: '/openapi'
})

app.register(fastifyOpenapiMerge, {
  specDir: '',
  routePrefix: '/openapi',
  merge: (specs) => {
    expectType<Array<OpenAPIDocument>>(specs)
    return {
      paths: {},
      components: {}
    }
  }
})

app.register(fastifyOpenapiMerge, {
  specDir: '',
  routePrefix: '/openapi',
  specDefinition: {
    openapi: '3.0.0',
    info: { title: 'Custom OpenAPI Spec', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000', description: 'Localhost' }],
    security: [{ bearerAuth: [] }],
  }
})
