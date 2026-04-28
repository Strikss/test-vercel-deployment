import type { IncomingMessage, ServerResponse } from 'node:http'

export type ApiRequest = IncomingMessage & {
  query: Record<string, string | string[] | undefined>
  body?: unknown
}

export type ApiResponse = ServerResponse & {
  status(code: number): ApiResponse
  json(body: unknown): void
}
