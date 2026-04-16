import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'path'
import crypto from 'node:crypto'

// Deterministic server-fn IDs — prevents client/server bundle desync in production.
// Any deploy with the same source produces the same IDs, so cached client bundles
// never reference stale IDs that no longer exist on the server.
function generateFunctionId({
  filename,
  functionName,
}: {
  filename: string
  functionName: string
}) {
  const normalized = filename.replace(/\\/g, '/')
  const relative = normalized.slice(normalized.lastIndexOf('/src/') + 1)
  return crypto
    .createHash('sha1')
    .update(`${relative}--${functionName}`)
    .digest('hex')
}

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      serverFns: { generateFunctionId },
    }),
    viteReact(),
    nitro({ preset: 'vercel' }),
  ],
})
