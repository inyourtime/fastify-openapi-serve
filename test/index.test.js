'use strict'

const { test } = require('node:test')
const path = require('node:path')

const fastify = require('fastify')
const fastifyOpenapiMerge = require('../index')

test('test', async (t) => {
  const app = fastify()
  app.register(fastifyOpenapiMerge, {
    specDir: [path.join(__dirname, 'openapi/'), path.join(__dirname, 'tmp/')],
  })
  t.after(() => app.close())

  await app.ready()

  t.assert.equal(1, 1)
})
