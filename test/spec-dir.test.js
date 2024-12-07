'use strict'

const path = require('node:path')
const { test } = require('node:test')

const Fastify = require('fastify')
const { checkSpecDir } = require('../lib/spec-dir')

test('no specDir', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, undefined)
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option is required')
  }
})

test('specDir is not a string', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, 1)
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option must be a string or an array of strings')
  }
})

test('specDir is not an absolute path', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, 'foo')
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option must be an absolute path')
  }
})

test('specDir does not exist', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, '/foo')
  } catch (e) {
    t.assert.ifError(e)
  }
})

test('specDir is not a directory', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, path.join(__dirname, 'tmp', 'test-file.txt'))
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option must point to a directory')
  }
})

test('specDir is a array', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, [path.join(__dirname, 'openapi'), path.join(__dirname, 'tmp')])
  } catch (e) {
    t.assert.ifError(e)
  }
})

test('specDir is a empty array', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, [])
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option array requires one or more paths')
  }
})

test('specDir contains duplicate paths', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, [path.join(__dirname, 'openapi'), path.join(__dirname, 'openapi')])
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option array contains one or more duplicate paths')
  }
})

test('specDir array is containing non strings path', async (t) => {
  const fastify = Fastify()
  t.after(() => fastify.close())

  try {
    checkSpecDir(fastify, [1])
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option must be a string')
  }
})
