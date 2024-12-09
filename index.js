'use strict'

const path = require('node:path')

const fp = require('fastify-plugin')
const { glob } = require('glob')
const YAML = require('yaml')

const { checkSpecDir } = require('./lib/spec-dir')
const { mergeSpec } = require('./lib/merge-spec')

async function fastifyOpenapiMerge (fastify, opts) {
  const openapiPath = opts.routePrefix || '/openapi'
  const specDir = opts.specDir

  checkSpecDir(fastify, specDir)

  const rootsSpec = Array.isArray(specDir) ? specDir : [specDir]
  const specFiles = []

  for (const specPath of rootsSpec) {
    const files = await glob('**/*.{yaml,yml,json}', {
      cwd: specPath, absolute: false, follow: true, nodir: true,
    })

    specFiles.push(...files.map((file) => {
      return path.join(specPath, file).split(path.win32.sep).join(path.posix.sep)
    }))
  }

  fastify.route({
    method: 'GET',
    url: `${openapiPath}/json`,
    handler: async () => {
      const mergedSpec = await mergeSpec(specFiles, {
        customMerge: opts.merge,
        specDefinition: opts.specDefinition,
      })

      return mergedSpec
    },
  })

  fastify.route({
    method: 'GET',
    url: `${openapiPath}/yaml`,
    handler: async (_, reply) => {
      const mergedSpec = await mergeSpec(specFiles, {
        customMerge: opts.merge,
        specDefinition: opts.specDefinition,
      })

      const yaml = YAML.stringify(mergedSpec)

      return reply
        .type('application/x-yaml')
        .send(yaml)
    },
  })
}

module.exports = fp(fastifyOpenapiMerge, {
  fastify: '5.x',
  name: 'fastify-openapi-merge'
})
module.exports.default = fastifyOpenapiMerge
module.exports.fastifyOpenapiMerge = fastifyOpenapiMerge
