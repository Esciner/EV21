import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    exclude: [
      'tests/e2e/**',
      'node_modules/**'
    ],
    environment: 'happy-dom'
  }
})
