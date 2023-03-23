import { merge, take, timer } from 'rxjs'

/**
 * Instructions:
 *
 * 1. Create two observables that both emit a value every 10 ms, but one stream is shifted 5 ms, like so:
 *
 *    A: *---------*---------*---------*...
 *    B: ----*---------*---------*------...
 *
 *    Stream A starts immediately and stream B after 5 ms.
 *    Both emit a value every 10 ms.
 *    It doesn't matter what value they emit.
 *
 * 2. Combine both observables into one and make it emit 5 values before completing.
 *    This single stream is what you need to assign to `answer$`.
 *
 * Replace null with your answer:
 */

const answer$ = merge(timer(0, 10), timer(5, 10)).pipe(take(5))

export default answer$
