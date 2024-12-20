'use strict'

const fs = require('node:fs')

const YAML = require('yaml')
const { merge, isErrorResult } = require('openapi-merge')

const defaultSpecDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'OpenAPI Spec',
    version: '1.0.0'
  },
  servers: [],
}

async function defaultMerge (specs) {
  const result = merge(specs)

  if (isErrorResult(result)) {
    throw new Error(`Error merging OpenAPI specs: ${result.message}`)
  }

  return result.output
}

async function mergeSpec (specPaths, opts = {}) {
  if (!specPaths.length) {
    return
  }

  const _merge = opts.merge ?? defaultMerge
  if (typeof _merge !== 'function') {
    throw new Error('"merge" option must be a function')
  }

  opts.specDefinition = opts.specDefinition || defaultSpecDefinition

  const specs = []

  for (const specPath of specPaths) {
    const content = fs.readFileSync(specPath, 'utf-8')
    const parse = YAML.parse(content) ?? {}

    if (!opts.merge) {
      specs.push({ oas: parse })
    } else {
      specs.push(parse)
    }
  }

  const result = await _merge(specs)

  const merged = {
    ...result,
    ...opts.specDefinition,
  }

  if (opts.yaml === true) {
    return YAML.stringify(merged)
  }

  return merged
}

module.exports = { mergeSpec }
