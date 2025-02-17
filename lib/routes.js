const { mergeSpec } = require('./merge-spec')

/**
 * @type {import('fastify').FastifyPluginCallback}
 */
function openapiServe (fastify, opts, done) {
  const cdn = opts.cdn || 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
  const scalarConfig = {
    ...opts.scalarConfig,
    spec: {
      url: `${opts.prefix}/openapi.json`,
    }
  }

  fastify.route({
    method: 'GET',
    url: '/openapi.json',
    handler: async () => {
      const mergedSpec = await mergeSpec(opts.specFiles, {
        merge: opts.merge,
        specDefinition: opts.specDefinition,
      })

      return mergedSpec
    },
  })

  fastify.route({
    method: 'GET',
    url: '/openapi.yaml',
    handler: async (_, reply) => {
      const mergedSpec = await mergeSpec(opts.specFiles, {
        merge: opts.merge,
        specDefinition: opts.specDefinition,
        yaml: true
      })

      return reply
        .type('application/x-yaml')
        .send(mergedSpec)
    },
  })

  if (opts.ui !== false) {
    fastify.route({
      method: 'GET',
      url: '/',
      handler: (_, reply) => {
        reply
          .type('text/html')
          .send(scalarHtml({
            cdn,
            serializedOptions: JSON.stringify(scalarConfig).split('"').join('&quot;'),
          }))
      }
    })
  }

  done()
}

function scalarHtml (opts) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Scalar API Reference</title>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <script
        id="api-reference"
        type="application/json"
        data-configuration="${opts.serializedOptions}"></script>
      <script src="${opts.cdn}"></script>
    </body>
    </html>
  `
}

module.exports = openapiServe
