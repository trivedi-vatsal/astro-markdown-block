import { copyFileSync } from 'node:fs'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'es2022',
  external: [
    'react',
    'react/jsx-runtime',
    'react-markdown',
    'remark-gfm',
    'rehype-external-links',
  ],
  onSuccess: async () => {
    copyFileSync('src/styles.css', 'dist/styles.css')
  },
})
