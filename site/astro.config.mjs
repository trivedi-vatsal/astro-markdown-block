import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  site: 'https://vatsal.xyz',
  base: '/astro-markdown-block',
  integrations: [react()],
})
