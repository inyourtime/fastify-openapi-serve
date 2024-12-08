'use strict'

const path = require('node:path')
const { test } = require('node:test')
const assert = require('node:assert')

const Fastify = require('fastify')
const { checkSpecDir } = require('../lib/spec-dir')

let fastify

test.before(() => {
  fastify = Fastify()
})

test.after(() => fastify.close())

test('no specDir', () => {
  try {
    checkSpecDir(fastify, undefined)
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"specDir" option is required')
  }
})

test('specDir is not a string', () => {
  try {
    checkSpecDir(fastify, 1)
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"specDir" option must be a string or an array of strings')
  }
})

test('specDir is not an absolute path', () => {
  try {
    checkSpecDir(fastify, 'foo')
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"specDir" option must be an absolute path')
  }
})

test('specDir does not exist', () => {
  try {
    checkSpecDir(fastify, '/foo')
  } catch (e) {
    assert.ifError(e)
  }
})

test('specDir is not a directory', () => {
  try {
    checkSpecDir(fastify, path.join(__dirname, 'tmp', 'test-file.txt'))
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"specDir" option must point to a directory')
  }
})

test('specDir is a array', () => {
  try {
    checkSpecDir(fastify, [path.join(__dirname, 'openapi'), path.join(__dirname, 'tmp')])
  } catch (e) {
    assert.ifError(e)
  }
})

test('specDir is a empty array', () => {
  try {
    checkSpecDir(fastify, [])
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"specDir" option array requires one or more paths')
  }
})

test('specDir contains duplicate paths', () => {
  try {
    checkSpecDir(fastify, [path.join(__dirname, 'openapi'), path.join(__dirname, 'openapi')])
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"specDir" option array contains one or more duplicate paths')
  }
})

test('specDir array is containing non strings path', () => {
  try {
    checkSpecDir(fastify, [1])
  } catch (e) {
    assert.ok(e)
    assert.strictEqual(e.message, '"specDir" option must be a string')
  }
})
