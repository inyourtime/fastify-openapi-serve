import type { FastifyPluginAsync } from 'fastify'
// eslint-disable-next-line camelcase
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'

type FastifyOpenapiMerge = FastifyPluginAsync<fastifyOpenapiMerge.FastifyOpenapiMergeOptions>

declare namespace fastifyOpenapiMerge {
  // eslint-disable-next-line camelcase
  export type OpenAPIDocument = Partial<OpenAPIV3.Document | OpenAPIV3_1.Document>

  export interface FastifyOpenapiMergeOptions {
    /**
     * OpenAPI spec directory
     */
    specDir: string | string[]
    /**
     * OpenAPI spec path prefix
     * @default '/openapi'
     */
    routePrefix?: string
    /**
     * Merge function
     * @default openapi-merge
     * @see https://github.com/robertmassaioli/openapi-merge
     */
    merge?: (specs: Array<OpenAPIDocument>) => OpenAPIDocument
    /**
     * OpenAPI spec definition
     */
    specDefinition?: OpenAPIDocument
  }

  export const fastifyOpenapiMerge: FastifyOpenapiMerge
  export { fastifyOpenapiMerge as default }
}

declare function fastifyOpenapiMerge (...params: Parameters<FastifyOpenapiMerge>): ReturnType<FastifyOpenapiMerge>
export = fastifyOpenapiMerge
