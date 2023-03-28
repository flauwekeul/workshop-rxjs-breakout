import answer$ from '../02.js'
import { assert } from '../shared.js'

assert(answer$, 'a----a----b----b----(c|)', { a: 0, b: 1, c: 2 })
