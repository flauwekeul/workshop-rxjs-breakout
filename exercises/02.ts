import { timer, take, merge } from "rxjs";
import { assert } from "./shared";

// 1. Create 2 observables that both emit a value 10 ms,
// but there are 5 ms between each, like so:
//    A: ----------*----------*----------*
//    B: -----*----------*----------*-----
// 2. Combine both observables into 1 and make it emit 5 values before completing.

const firstObservable$ = timer(5, 10);
const secondObservable$ = timer(10, 10);

const answer$ = merge(firstObservable$, secondObservable$).pipe(take(5));

assert(answer$, "-----a----a----b----b----(c|)", { a: 0, b: 1, c: 2 });
