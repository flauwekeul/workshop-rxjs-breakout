import { filter, map, of, reduce } from "rxjs";
import { assert } from "./shared";

// 1. Create an observable that emits the values 1, 2 and 3 (and then completes)
// 2. Use the right operators to
//    2a. multiply each value by 3, then
//    2b. only let values > 5 pass and finally
//    2c. sum those values

const answer$ = of(1, 2, 3).pipe(
  map((n) => n * 3),
  filter((n) => n > 5),
  reduce((acc, n) => acc + n, 0)
);

assert(answer$, "(a|)", { a: 15 });
