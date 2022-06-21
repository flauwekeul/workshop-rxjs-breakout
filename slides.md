---
highlighter: shiki
lineNumbers: true
layout: cover
---

<div class="text-center">
  <img src="/assets/logo-rx.svg" alt="RxJS logo" class="h-48 mx-auto mb-5" />
  <h1>RxJS fundamentals</h1>
</div>

---

<h1 class="!mb-13">Promises vs Observables</h1>

<div class="grid grid-cols-2">
  <div>
    <h2 v-click class="mb-5">Promises…</h2>
    <ul>
      <li v-click>only resolve once</li>
      <li v-click>cannot be canceled</li>
      <li v-click>are always asynchronous</li>
      <li v-click>execute on creation (eager).</li>
    </ul>
  </div>

  <div>
    <h2 v-click class="mb-5">Observables…</h2>
    <ul>
      <li v-click>handle any number of events</li>
      <li v-click>can be canceled</li>
      <li v-click>can be synchronous or asynchronous</li>
      <li v-click>execute when subscribed (lazy).</li>
    </ul>
  </div>
</div>

---

<h1 class="!mb-8">Observables compared</h1>

<div class="grid grid-cols-2 gap-2">
  <div v-click>

  ```js


  Promise
    .resolve(1)
    .then((value) => {
      console.log(value)
    })


  ```

  </div>

  <div v-click>

  ```js
  import { of, tap } from 'rxjs'

  of(1)
    .pipe(
      tap((value) => {
        console.log(value)
      })
    )
    .subscribe()
  ```

  </div>

  <div v-click>

  ```js


  [1, 2, 3]
    .map((n) => n * 2)
    .filter((n) => n < 5)
    .reduce((acc, n) => acc + n, 0)



  ```

  </div>

  <div v-click>

  ```js
  import { of, map, filter, reduce } from 'rxjs'

  of(1, 2, 3)
    .pipe(
      map((n) => n * 2),
      filter((n) => n < 5),
      reduce((acc, n) => acc + n, 0)
    )
    .subscribe()
  ```

  </div>
</div>

---

<h1 class="!mb-13">Observable anatomy</h1>

```js {1-3|4-8|9|11-12|all}
import { of, map, filter } from 'rxjs'

const subscription = of()   // a "creation" function
  .pipe(
    map(),                  // operators
    filter(),
    // …
  )
  .subscribe()              // nothing happens until this is called

// later:
subscription.unsubscribe()  // clean up to prevent memory leaks
```

---

<h1 class="!mb-13">Observable notifications</h1>

```js {1-3,13|3-6,13,15|3-6,13,15-16|3-6,13,15-17|7-9,18|all}
import { of } from 'rxjs'

of(1, 2, 3).subscribe({     // you can pass an "observer" to subscribe()
  next: (n) => {            // next() is called for each value
    console.log('Next:', n)
  },
  complete: () => {         // complete() is called without arguments
    console.log('Done!')
  },
  error: (err) => {         // in case of an error
    console.error(err)
  }
})

// Next: 1
// Next: 2
// Next: 3
// Done!
```

---

<h1>Combining observables</h1>

```js {1-4|6-8|10-12|14-16|18-22|all}
import { fromEvent, interval, merge, combineLatest, zip, withLatestFrom } from 'rxjs'

const clicks$ = fromEvent(document, 'click')
const seconds$ = interval(1000)

merge(clicks$, seconds$).subscribe((clickOrSecond) => {
  console.log(clickOrSecond) // either a click or an interval
})

combineLatest([clicks$, seconds$]).subscribe(([lastClick, lastSecond]) => {
  console.log(lastClick, lastSecond) // latest click and second when either emits
})

zip(clicks$, seconds$).subscribe(([lastClick, lastSecond]) => {
  console.log(lastClick, lastSecond) // latest click and second when both have emitted
})

clicks$
  .pipe(withLatestFrom(seconds$))
  .subscribe(([lastClick, lastSecond]) => {
    console.log(lastClick, lastSecond) // latest click and second for each click
  })
```
