'use strict'

const { test } = require('node:test')
const path = require('node:path')

const YAML = require('yaml')
const Fastify = require('fastify')
const fastifyOpenapiServe = require('../index')

test('require specDir', async (t) => {
  t.plan(2)
  const fastify = Fastify()

  try {
    await fastify.register(fastifyOpenapiServe, {})
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option is required')
  }
})

test('merge with specDir (json response)', async (t) => {
  t.plan(5)
  const fastify = Fastify()

  await fastify.register(fastifyOpenapiServe, {
    specDir: path.join(__dirname, 'specs'),
  })

  await fastify.ready()

  const res = await fastify.inject({
    method: 'GET',
    url: '/openapi/json',
  })

  const spec = res.json()

  t.assert.strictEqual(res.statusCode, 200)
  t.assert.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
  t.assert.strictEqual(spec.openapi, '3.0.0')
  t.assert.deepStrictEqual(spec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(spec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('merge with specDir (yaml response)', async (t) => {
  t.plan(5)
  const fastify = Fastify()

  await fastify.register(fastifyOpenapiServe, {
    specDir: path.join(__dirname, 'specs'),
  })

  await fastify.ready()

  const res = await fastify.inject({
    method: 'GET',
    url: '/openapi/yaml',
  })

  const spec = YAML.parse(res.payload)

  t.assert.strictEqual(res.statusCode, 200)
  t.assert.strictEqual(res.headers['content-type'], 'application/x-yaml')
  t.assert.strictEqual(spec.openapi, '3.0.0')
  t.assert.deepStrictEqual(spec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(spec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('merge with specDir array', async (t) => {
  t.plan(5)
  const fastify = Fastify()

  await fastify.register(fastifyOpenapiServe, {
    specDir: [path.join(__dirname, 'specs'), path.join(__dirname, 'specs2')],
  })

  await fastify.ready()

  const res = await fastify.inject({
    method: 'GET',
    url: '/openapi/json',
  })

  const spec = res.json()

  t.assert.strictEqual(res.statusCode, 200)
  t.assert.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
  t.assert.strictEqual(spec.openapi, '3.0.0')
  t.assert.deepStrictEqual(spec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(spec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
    '/info': { get: { summary: 'Info', responses: { 200: { description: 'OK' } } } },
  })
})

test('custom openapiPath', async (t) => {
  t.plan(5)
  const fastify = Fastify()

  await fastify.register(fastifyOpenapiServe, {
    specDir: path.join(__dirname, 'specs'),
    routePrefix: '/custom',
  })

  await fastify.ready()

  const res = await fastify.inject({
    method: 'GET',
    url: '/custom/json',
  })

  const spec = res.json()

  t.assert.strictEqual(res.statusCode, 200)
  t.assert.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
  t.assert.strictEqual(spec.openapi, '3.0.0')
  t.assert.deepStrictEqual(spec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(spec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('custom merge', async (t) => {
  t.plan(5)
  const fastify = Fastify()

  await fastify.register(fastifyOpenapiServe, {
    specDir: path.join(__dirname, 'specs'),
    merge: (spec) => {
      return {
        ...spec[0],
        paths: {
          ...spec[0].paths,
          ...spec[1].paths,
        },
      }
    },
  })

  await fastify.ready()

  const res = await fastify.inject({
    method: 'GET',
    url: '/openapi/json',
  })

  const spec = res.json()

  t.assert.strictEqual(res.statusCode, 200)
  t.assert.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
  t.assert.strictEqual(spec.openapi, '3.0.0')
  t.assert.deepStrictEqual(spec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(spec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('specDefinition custom', async (t) => {
  t.plan(6)
  const fastify = Fastify()

  await fastify.register(fastifyOpenapiServe, {
    specDir: path.join(__dirname, 'specs'),
    specDefinition: {
      openapi: '3.0.0',
      info: { title: 'Custom OpenAPI Spec', version: '1.0.0' },
      servers: [{ url: 'http://localhost:3000' }],
    },
  })

  await fastify.ready()

  const res = await fastify.inject({
    method: 'GET',
    url: '/openapi/json',
  })

  const spec = res.json()

  t.assert.strictEqual(res.statusCode, 200)
  t.assert.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
  t.assert.strictEqual(spec.openapi, '3.0.0')
  t.assert.deepStrictEqual(spec.info, { title: 'Custom OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(spec.servers, [{ url: 'http://localhost:3000' }])
  t.assert.deepStrictEqual(spec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})
