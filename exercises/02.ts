import { assert } from './shared'

// 1. Create 2 observables that both emit a value every 10 ms, but there are 5 ms between each, like so:
//    A: ----------*----------*----------*
//    B: -----*----------*----------*-----
// 2. Combine both observables into 1 and make it emit 5 values before completing.

const answer$ = null // replace null with your answer

assert(answer$, '-----a----a----b----b----(c|)', { a: 0, b: 1, c: 2 })
