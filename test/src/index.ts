import { _parent } from '../parent'
import { _included } from './included'
import { _excluded } from './excluded'

console.log(_parent, _included, _excluded)

const x = 'a'

const y = function (s: string) {
  if (arguments.length === 0) {
    return "b"
  } else {
    return `c ${s}`
  }
}

const z = 'hover:hoverable'
