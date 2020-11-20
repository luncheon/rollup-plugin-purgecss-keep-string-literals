import typescript from '@rollup/plugin-typescript'
import purgecssKeepStringLiterals from '..'

export default {
  input: 'src/index.ts',
  output: { file: 'dist/index.js' },
  plugins: [
    typescript({ noEmit: true }),
    purgecssKeepStringLiterals({
      css: ['src/source.css'],
      output: 'dist/utilities.css',
      include: ['src/**/*.ts'],
      exclude: ['**/excluded/**'],
    }),
  ],
}
