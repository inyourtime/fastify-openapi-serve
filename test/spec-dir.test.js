'use strict'

const path = require('node:path')
const { test } = require('node:test')

const Fastify = require('fastify')
const { checkSpecDir } = require('../lib/spec-dir')

let fastify

test.before(() => {
  fastify = Fastify()
})

test.after(() => fastify.close())

test('no specDir', (t) => {
  t.plan(2)
  try {
    checkSpecDir(fastify, undefined)
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option is required')
  }
})

test('specDir is not a string', (t) => {
  t.plan(2)
  try {
    checkSpecDir(fastify, 1)
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option must be a string or an array of strings')
  }
})

test('specDir is not an absolute path', (t) => {
  t.plan(2)
  try {
    checkSpecDir(fastify, 'foo')
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option must be an absolute path')
  }
})

test('specDir does not exist', (t) => {
  try {
    checkSpecDir(fastify, '/foo')
  } catch (e) {
    t.assert.ifError(e)
  }
})

test('specDir is not a directory', (t) => {
  t.plan(2)
  try {
    checkSpecDir(fastify, path.join(__dirname, 'tmp', 'test-file.txt'))
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option must point to a directory')
  }
})

test('specDir is a array', (t) => {
  try {
    checkSpecDir(fastify, [path.join(__dirname, 'openapi'), path.join(__dirname, 'tmp')])
  } catch (e) {
    t.assert.ifError(e)
  }
})

test('specDir is a empty array', (t) => {
  t.plan(2)
  try {
    checkSpecDir(fastify, [])
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option array requires one or more paths')
  }
})

test('specDir contains duplicate paths', (t) => {
  t.plan(2)
  try {
    checkSpecDir(fastify, [path.join(__dirname, 'openapi'), path.join(__dirname, 'openapi')])
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option array contains one or more duplicate paths')
  }
})

test('specDir array is containing non strings path', (t) => {
  t.plan(2)
  try {
    checkSpecDir(fastify, [1])
  } catch (e) {
    t.assert.ok(e)
    t.assert.strictEqual(e.message, '"specDir" option must be a string')
  }
})
