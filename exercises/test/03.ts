import answer$ from '../03.js'
import { assert, comments1, comments2 } from '../shared.js'

assert(answer$, '(ab|)', { a: comments1, b: comments2 })
