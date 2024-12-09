'use strict'

const path = require('node:path')
const { test } = require('node:test')

const { mergeSpec } = require('../lib/merge-spec')

test('merge one spec file', async (t) => {
  t.plan(3)
  const mergedSpec = await mergeSpec([path.join(__dirname, 'openapi/spec.json')])

  t.assert.strictEqual(mergedSpec.openapi, '3.0.0')
  t.assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } }
  })
})

test('merge with duplicate paths', async (t) => {
  t.plan(2)
  try {
    await mergeSpec([
      path.join(__dirname, 'openapi/spec.json'),
      path.join(__dirname, 'openapi/spec.json'),
    ])
  } catch (e) {
    t.assert.ok(e)
    t.assert.match(e.message, /Error merging OpenAPI specs:/)
  }
})

test('merge multiple spec files', async (t) => {
  t.plan(3)
  const mergedSpec = await mergeSpec([
    path.join(__dirname, 'openapi/spec.json'),
    path.join(__dirname, 'openapi/spec2.json'),
  ])

  t.assert.strictEqual(mergedSpec.openapi, '3.0.0')
  t.assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('merge with custom merge', async (t) => {
  t.plan(3)
  const mergedSpec = await mergeSpec([
    path.join(__dirname, 'openapi/spec.json'),
    path.join(__dirname, 'openapi/spec2.json'),
  ], undefined, (spec) => {
    return {
      ...spec[0],
      paths: {
        ...spec[0].paths,
        ...spec[1].paths,
      },
    }
  })

  t.assert.strictEqual(mergedSpec.openapi, '3.0.0')
  t.assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('custom merge not a function', async (t) => {
  t.plan(2)
  try {
    await mergeSpec([
      path.join(__dirname, 'openapi/spec.json'),
      path.join(__dirname, 'openapi/spec2.json'),
    ], undefined, 1)
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"customMerge" must be a function')
  }
})

test('merge with empty spec', async (t) => {
  t.plan(2)
  try {
    await mergeSpec([])
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specPaths" option array requires one or more paths')
  }
})

test('merge with YAML file', async (t) => {
  t.plan(3)
  const mergedSpec = await mergeSpec([
    path.join(__dirname, 'openapi/spec.yaml'),
    path.join(__dirname, 'openapi/spec2.yaml'),
  ])

  t.assert.strictEqual(mergedSpec.openapi, '3.0.0')
  t.assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('merge with JSON and YAML file', async (t) => {
  t.plan(3)
  const mergedSpec = await mergeSpec([
    path.join(__dirname, 'openapi/spec.json'),
    path.join(__dirname, 'openapi/spec2.yaml'),
  ])

  t.assert.strictEqual(mergedSpec.openapi, '3.0.0')
  t.assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('merge with empty JSON file', async (t) => {
  t.plan(3)
  const mergedSpec = await mergeSpec([path.join(__dirname, 'openapi/empty.json')])

  t.assert.strictEqual(mergedSpec.openapi, '3.0.0')
  t.assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  t.assert.deepStrictEqual(mergedSpec.paths, {})
})
