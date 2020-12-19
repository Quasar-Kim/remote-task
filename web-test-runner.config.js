import { chromeLauncher } from '@web/test-runner'

export default {
  files: 'test/integration/*.test.js',
  nodeResolve: true,
  port: 9719,
  browsers: [
    chromeLauncher({
      launchOptions: {
        headless: false
      }
    })
  ]
}