'use strict'

const path = require('node:path')
const { test } = require('node:test')
const assert = require('node:assert')

const { mergeSpec } = require('../lib/merge-spec')

test('merge one spec file', async () => {
  const mergedSpec = await mergeSpec([path.join(__dirname, 'openapi/spec.json')])

  assert.strictEqual(mergedSpec.openapi, '3.0.0')
  assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } }
  })
})

test('merge with duplicate paths', async () => {
  try {
    await mergeSpec([
      path.join(__dirname, 'openapi/spec.json'),
      path.join(__dirname, 'openapi/spec.json'),
    ])
  } catch (e) {
    assert.ok(e)
    assert.match(e.message, /Error merging OpenAPI specs:/)
  }
})

test('merge multiple spec files', async () => {
  const mergedSpec = await mergeSpec([
    path.join(__dirname, 'openapi/spec.json'),
    path.join(__dirname, 'openapi/spec2.json'),
  ])

  assert.strictEqual(mergedSpec.openapi, '3.0.0')
  assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('merge with custom merge', async () => {
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

  assert.strictEqual(mergedSpec.openapi, '3.0.0')
  assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('custom merge not a function', async () => {
  try {
    await mergeSpec([
      path.join(__dirname, 'openapi/spec.json'),
      path.join(__dirname, 'openapi/spec2.json'),
    ], undefined, 1)
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"customMerge" must be a function')
  }
})

test('merge with empty spec', async () => {
  try {
    await mergeSpec([])
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"specPaths" option array requires one or more paths')
  }
})

test('merge with YAML file', async () => {
  const mergedSpec = await mergeSpec([
    path.join(__dirname, 'openapi/spec.yaml'),
    path.join(__dirname, 'openapi/spec2.yaml'),
  ])

  assert.strictEqual(mergedSpec.openapi, '3.0.0')
  assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('merge with JSON and YAML file', async () => {
  const mergedSpec = await mergeSpec([
    path.join(__dirname, 'openapi/spec.json'),
    path.join(__dirname, 'openapi/spec2.yaml'),
  ])

  assert.strictEqual(mergedSpec.openapi, '3.0.0')
  assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  assert.deepStrictEqual(mergedSpec.paths, {
    '/foo': { get: { summary: 'Foo', responses: { 200: { description: 'OK' } } } },
    '/bar': { get: { summary: 'Bar', responses: { 200: { description: 'OK' } } } },
  })
})

test('merge with empty JSON file', async () => {
  const mergedSpec = await mergeSpec([path.join(__dirname, 'openapi/empty.json')])

  assert.strictEqual(mergedSpec.openapi, '3.0.0')
  assert.deepStrictEqual(mergedSpec.info, { title: 'OpenAPI Spec', version: '1.0.0' })
  assert.deepStrictEqual(mergedSpec.paths, {})
})
