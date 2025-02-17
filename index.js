'use strict'

const path = require('node:path')

const fp = require('fastify-plugin')
const { glob } = require('glob')

const { checkSpecDir } = require('./lib/spec-dir')

/**
 * @type {import('fastify').FastifyPluginAsync<import('./types').FastifyOpenapiServeOptions>}
 */
async function fastifyOpenapiServe (fastify, opts) {
  const specDir = opts.specDir

  checkSpecDir(fastify, specDir)

  if (opts.merge && typeof opts.merge !== 'function') {
    throw new Error('"merge" option must be a function')
  }

  const rootsSpec = Array.isArray(specDir) ? specDir : [specDir]
  const specFiles = []

  for (const specPath of rootsSpec) {
    const files = await glob('**/*.{yaml,yml,json}', {
      cwd: specPath, absolute: true, follow: true, nodir: true,
    })

    specFiles.push(...files.map((file) => {
      return file.split(path.win32.sep).join(path.posix.sep)
    }))
  }

  await fastify.register(require('./lib/routes'), {
    prefix: opts.routePrefix || '/docs',
    specFiles,
    ...opts
  })
}

module.exports = fp(fastifyOpenapiServe, {
  fastify: '5.x',
  name: 'fastify-openapi-serve',
})
module.exports.default = fastifyOpenapiServe
module.exports.fastifyOpenapiServe = fastifyOpenapiServe
