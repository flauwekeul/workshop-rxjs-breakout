import { filter, map, of, reduce } from 'rxjs'

/**
 * Instructions:
 *
 * 1. Create an observable that emits the values 1, 2 and 3 (and then completes)
 * 2. Use the correct operators to
 *    1. multiply each value by 3, then
 *    2. only let values > 5 pass and finally
 *    3. sum those values
 *
 * Replace null with your answer:
 */

const answer$ = of(1, 2, 3).pipe(
  map((v) => v * 3),
  filter((v) => v > 5),
  reduce((acc, v) => acc + v, 0)
)

export default answer$
