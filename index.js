'use strict'

const path = require('node:path')
const fp = require('fastify-plugin')
const { glob } = require('glob')

const { checkSpecDir } = require('./lib/spec-dir')

async function fastifyOpenapiMerge (fastify, opts) {
  // const openapiPath = opts.openapiPath || 'openapi'
  const specDir = opts.specDir

  // const specFiles = getAllSpecFiles(specDir)
  checkSpecDir(fastify, specDir)

  const rootsSpec = Array.isArray(specDir) ? specDir : [specDir]
  const specFiles = []

  for (const specPath of rootsSpec) {
    const files = await glob('**/*.{yaml,yml,json}', {
      cwd: specPath, absolute: false, follow: true, nodir: true,
    })

    specFiles.push(...files.map((file) => path.join(specPath, file)))
  }

  console.log(specFiles)
}

// function getAllSpecFiles (specDir) {
//   let results = []
//   const list = fs.readdirSync(specDir)

//   for (const file of list) {
//     const filePath = path.join(specDir, file)
//     const stat = fs.statSync(filePath)

//     if (stat && stat.isDirectory()) {
//       // Recurse into subdirectory
//       results = results.concat(getAllSpecFiles(filePath))
//     } else if (file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json')) {
//       // Add file
//       results.push(filePath)
//     }
//   }

//   return results
// }

module.exports = fp(fastifyOpenapiMerge, {
  fastify: '5.x',
  name: 'fastify-openapi-merge'
})
module.exports.default = fastifyOpenapiMerge
module.exports.fastifyOpenapiMerge = fastifyOpenapiMerge
