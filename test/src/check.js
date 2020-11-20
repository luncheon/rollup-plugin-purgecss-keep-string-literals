const fs = require('fs')
const path = require('path')

const read = filename => fs.readFileSync(path.resolve(__dirname, filename), 'utf8').replace(/\s+/g, '')

const actual = read('../dist/utilities.css')
const expected = read('expected.css')
if (actual === expected) {
  console.log('test success')
} else {
  console.error('test failure')
  console.log('expected: ', expected)
  console.log('  actual: ', actual)
  process.exit(1)
}
