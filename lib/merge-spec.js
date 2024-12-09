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

async function mergeSpec (specPaths, specDefinition, customMerge) {
  if (!specPaths.length) {
    throw new Error('"specPaths" option array requires one or more paths')
  }

  const _merge = customMerge ?? defaultMerge
  if (typeof _merge !== 'function') {
    throw new Error('"customMerge" must be a function')
  }

  specDefinition = specDefinition || defaultSpecDefinition

  const specs = []

  for (const specPath of specPaths) {
    const content = fs.readFileSync(specPath, 'utf-8')
    const parse = YAML.parse(content) ?? {}

    if (!customMerge) {
      specs.push({ oas: parse })
    } else {
      specs.push(parse)
    }
  }

  const result = await _merge(specs)

  return {
    ...result,
    ...specDefinition,
  }
}

module.exports = { mergeSpec }
