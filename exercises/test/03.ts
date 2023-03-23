import answer$ from '../03'
import { assert, comments1, comments2 } from '../shared'

assert(answer$, '(ab|)', { a: comments1, b: comments2 })
