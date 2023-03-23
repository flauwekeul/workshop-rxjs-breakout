import answer$ from '../04'
import { article1, article2, assert, comments1, comments2 } from '../shared'

assert(answer$, '1s a 999ms (b|)', {
  a: { title: article1.title, comments: comments1 },
  b: { title: article2.title, comments: comments2 },
})
