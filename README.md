# @luncheon/rollup-plugin-purgecss-keep-string-literals

An experimental rollup plugin that removes the rest of the CSS, leaving only the selectors used in the string literals in the JavaScript source code.


## Installation

```bash
$ npm i -D rollup @luncheon/rollup-plugin-purgecss-keep-string-literals
```


## Usage

```js
// rollup.config.js
import purgecssKeepStringLiterals from '@luncheon/rollup-plugin-purgecss-keep-string-literals'

export default {
  plugins: [
    purgecssKeepStringLiterals({
      css: ["node_modules/tailwindcss/dist/utilities.min.css"],
      output: "dist/utilities.css",
      include: ["src/**/*.ts"],
    })
  ]
}
```


## Options

### `css`

Type: `(string | { raw: string })[]`

Array of the CSS file name or the CSS content.

### `output`

Type: `string`

Output file name.

### `include`

Type: `string | string[]`
Default: `null`

Minimatch pattern(s) for which the plugin should collect the string literals. By default all bundled files are targeted.

### `exclude`

Type: `string | string[]`
Default: `null`

Minimatch pattern(s) for which the plugin should ignore. By default no files are ignored.


## License

[WTFPL](http://www.wtfpl.net)
