import {
  combineLatest,
  filter,
  interval,
  map,
  merge,
  mergeMap,
  of,
  OperatorFunction,
  reduce,
  switchMap,
  take,
  timer,
  zip,
} from 'rxjs'
import {
  Article,
  article1,
  article2,
  assert,
  comments1,
  comments2,
  getArticlesByUserId,
  getCommentsByArticleId,
  getUser,
} from './shared'

// Answer 1

const answer01$ = of(1, 2, 3).pipe(
  map((v) => v * 3),
  filter((v) => v > 5),
  reduce((acc, v) => acc + v, 0)
)
assert(answer01$, '(a|)', { a: 15 })

// Answer 2

const answer02$ = merge(interval(10), timer(5, 10)).pipe(take(5))
assert(answer02$, '-----a----a----b----b----(c|)', { a: 0, b: 1, c: 2 })

// Answer 3

const answer03$ = getUser().pipe(
  switchMap((user) => getArticlesByUserId(user.id)),
  mergeMap((articles) => articles),
  switchMap((article) => getCommentsByArticleId(article.id))
)
assert(answer03$, '(ab|)', { a: comments1, b: comments2 })

// Answer 4

const articleIdClicks$ = zip(of(3, 6), interval(1000)).pipe(map(([id]) => id))

const articles$ = getUser().pipe(switchMap((user) => getArticlesByUserId(user.id)))
const answer04$ = combineLatest([articles$, articleIdClicks$]).pipe(
  map(([articles, articleId]) => articles.find(({ id }) => id === articleId)),
  // unfortunately this is needed to keep typescript happy
  filter((article) => !!article) as OperatorFunction<Article | undefined, Article>,
  switchMap((article) =>
    getCommentsByArticleId(article.id).pipe(map((comments) => ({ title: article.title, comments })))
  )
)

assert(answer04$, '1s a 999ms (b|)', {
  a: { title: article1.title, comments: comments1 },
  b: { title: article2.title, comments: comments2 },
})
