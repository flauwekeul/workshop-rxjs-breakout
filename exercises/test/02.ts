import answer$ from '../02'
import { assert } from '../shared'

assert(answer$, 'a----a----b----b----(c|)', { a: 0, b: 1, c: 2 })
