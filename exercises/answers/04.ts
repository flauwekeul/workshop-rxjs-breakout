import { combineLatest, filter, interval, map, mergeMap, of, zip } from 'rxjs'
import { Article, getArticlesByUserId, getCommentsByArticleId, getUser } from '../shared'

/**
 * Instructions:
 *
 * This exercise needs the same files as the previous exercise:
 * import { getArticlesByUserId, getCommentsByArticleId, getUser } from './shared'
 *
 * `articleIdClicks$` is an observable that mimics a user clicking a button exactly two times.
 * It waits a second, emits an id, waits another second, emits another id and then completes.
 *
 * 1. Just as in exercise 03, use getUser() and getArticlesByUserId() to fetch the current user's articles.
 * 2. Combine this observable and articleIdClicks$ so that you can map the clicked ids to articles.
 * 3. Get the comments for each article (use getCommentsByArticleId()).
 * 4. The resulting observable should emit a value for each article.
 *    Each value is an object that contains the article's title and its comments, like so:
 *    {
 *      title: string
 *      comments: Comment[]
 *    }
 *
 * You may need to combine multiple observables and/or return observables from operators (nested observables).
 * Be creative!
 *
 * Replace null with your answer:
 */

// This mimics a user clicking a button twice, each time emitting a different article id
const articleIdClicks$ = zip(of(3, 6), interval(1000)).pipe(map(([id]) => id))

const articles$ = getUser().pipe(mergeMap((user) => getArticlesByUserId(user.id)))
const answer$ = combineLatest([articles$, articleIdClicks$]).pipe(
  map(([articles, articleId]) => articles.find(({ id }) => id === articleId)),
  // Use a type predicate to convince TypeScript it's not letting through falsy values (like `undefined`).
  // See: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
  filter((article): article is Article => !!article),
  mergeMap((article) =>
    getCommentsByArticleId(article.id).pipe(
      map((comments) => ({
        title: article.title,
        comments,
      }))
    )
  )
)

export default answer$
