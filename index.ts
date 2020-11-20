import { createFilter, FilterPattern } from '@rollup/pluginutils'
import * as acorn from 'acorn'
import * as fs from 'fs'
import * as path from 'path'
import { PurgeCSS } from 'purgecss'

const flatSet = <T>(iterable: Iterable<Iterable<T>>) => {
  const set = new Set<T>()
  for (const items of iterable) {
    for (const item of items) {
      set.add(item)
    }
  }
  return set
}

const mapGetOrSet = <K, V>(map: Map<K, V>, key: K, generator: (key: K) => V) => {
  let value = map.get(key)
  if (!value) {
    value = generator(key)
    map.set(key, value)
  }
  return value
}

export default ({
  css,
  output,
  include,
  exclude,
}: {
  css: (Parameters<PurgeCSS['purge']>[0] & object)['css']
  output: string
  include?: FilterPattern
  exclude?: FilterPattern
}) => {
  const filter = createFilter(include, exclude)
  const purge = new PurgeCSS()
  const moduleTokensMap = new Map<string, Set<string>>()
  return {
    name: '@luncheon/rollup-plugin-purgecss-keep-string-literals' as const,
    transform(code: string, id: string) {
      if (!filter(id)) {
        return
      }
      const tokens = mapGetOrSet(moduleTokensMap, id, () => new Set())
      for (const token of acorn.tokenizer(code, { ecmaVersion: 'latest' })) {
        if (token.type.label === 'string' || token.type.label === 'template') {
          for (const s of token.value.split(/\s+/)) {
            tokens.add(s)
          }
        }
      }
    },
    async generateBundle() {
      const purged = await purge.purge({
        css,
        content: [],
        safelist: [...flatSet<string>(moduleTokensMap.values())],
        keyframes: true,
        variables: true,
      })
      await fs.promises.mkdir(path.dirname(output), { recursive: true })
      await fs.promises.writeFile(output, purged[0].css, 'utf8')
    },
  }
}
