import sucrase from '@rollup/plugin-sucrase'

export default {
  input: 'src/index.ts',
  plugins: [
    sucrase({
      transforms: ['typescript']
    })
  ],
  output: {
    dir: 'test/build',
    format: 'esm',
    sourcemap: true
  },
}