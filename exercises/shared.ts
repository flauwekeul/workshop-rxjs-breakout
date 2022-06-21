import { EMPTY, isObservable, of, Subscription } from 'rxjs'
import { TestScheduler } from 'rxjs/testing'

export const assert = (actual: unknown, marble: string, values?: Record<string, any>) => {
  if (!isObservable(actual)) {
    if (actual && typeof (actual as Subscription).unsubscribe === 'function') {
      console.error('You passed a subscription instead of an observable, please remove the `.subscribe()`.')
    } else {
      console.error(`You passed an unexpected value: ${JSON.stringify(actual)}`)
    }
    return
  }

  new TestScheduler((actual, expected) => {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      console.log(`Correct!`)
    } else {
      console.error(`Nope, that's incorrect. Try again.`)
      console.log(`Received:`, actual)
      console.log(`Expected:`, expected)
    }
  }).run(({ expectObservable }) => {
    expectObservable(actual).toBe(marble, values)
  })
}

export interface User {
  id: number
}

export interface Article {
  id: number
  title: string
}

export interface Comment {
  id: number
  text: string
}

export const user: User = { id: 1 }
export const article1: Article = {
  id: 3,
  title: 'A Developer Created A Game With RxJS, You Never Guess What Happens Next!',
}
export const article2: Article = { id: 6, title: '5 Things Every RxJS Dev Should Know' }
export const comments1: Comment[] = [
  { id: 1, text: 'Nice' },
  { id: 2, text: 'Meh' },
  { id: 4, text: 'Yo momma' },
]
export const comments2: Comment[] = [
  { id: 5, text: 'Great' },
  { id: 8, text: 'Spam' },
  { id: 11, text: 'Yay' },
]

export const getUser = () => of(user)
export const getArticlesByUserId = (userId: number) => {
  if (userId === 1) {
    return of([article1, article2])
  }
  return EMPTY
}
export const getCommentsByArticleId = (articleId: number) => {
  if (articleId === 3) {
    return of(comments1)
  } else if (articleId === 6) {
    return of(comments2)
  }
  return EMPTY
}
