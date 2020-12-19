import typescript from '@wessberg/rollup-plugin-ts'

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true
      })
    })
  ],
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: true
  }
}
