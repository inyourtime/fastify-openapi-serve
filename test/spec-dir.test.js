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
  t.plan(1)

  t.assert.throws(() =>
    checkSpecDir(fastify, undefined), {
    message: '"specDir" option is required',
  })
})

test('specDir is not a string', (t) => {
  t.plan(1)

  t.assert.throws(() =>
    checkSpecDir(fastify, 1), {
    message: '"specDir" option must be a string or an array of strings',
  })
})

test('specDir is not an absolute path', (t) => {
  t.plan(1)

  t.assert.throws(() =>
    checkSpecDir(fastify, 'foo'), {
    message: '"specDir" option must be an absolute path',
  })
})

test('specDir does not exist', (t) => {
  t.plan(1)

  t.assert.doesNotThrow(() => checkSpecDir(fastify, '/foo'))
})

test('specDir is not a directory', (t) => {
  t.plan(1)

  t.assert.throws(() =>
    checkSpecDir(fastify, path.join(__dirname, 'tmp', 'test-file.txt')), {
    message: '"specDir" option must point to a directory',
  })
})

test('specDir is a array', (t) => {
  t.plan(1)

  t.assert.doesNotThrow(() => checkSpecDir(fastify, [path.join(__dirname, 'openapi'), path.join(__dirname, 'tmp')]))
})

test('specDir is a empty array', (t) => {
  t.plan(1)

  t.assert.throws(() =>
    checkSpecDir(fastify, []), {
    message: '"specDir" option array requires one or more paths',
  })
})

test('specDir contains duplicate paths', (t) => {
  t.plan(1)

  t.assert.throws(() =>
    checkSpecDir(fastify, [path.join(__dirname, 'openapi'), path.join(__dirname, 'openapi')]), {
    message: '"specDir" option array contains one or more duplicate paths',
  })
})

test('specDir array is containing non strings path', (t) => {
  t.plan(1)

  t.assert.throws(() =>
    checkSpecDir(fastify, [1]), {
    message: '"specDir" option must be a string',
  })
})
