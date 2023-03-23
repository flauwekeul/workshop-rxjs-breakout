import { mergeMap } from 'rxjs'
import { getArticlesByUserId, getCommentsByArticleId, getUser } from '../shared'

/**
 * Instructions:
 *
 * For this exercise you need some files from './shared':
 * import { getArticlesByUserId, getCommentsByArticleId, getUser } from './shared'
 *
 * 1. Use getUser() to fetch the current user (it already returns an observable).
 * 2. Use the current user's id with getArticlesByUserId() to fetch the user's articles.
 * 3. Use the current user's article ids with getCommentsByArticleId() to fetch the comments for each article.
 * 4. The resulting observable should emit the comments of each article in order and then complete.
 *
 * Replace null with your answer:
 */

const answer$ = getUser().pipe(
  mergeMap((user) => getArticlesByUserId(user.id)),
  mergeMap((articles) => articles),
  mergeMap((article) => getCommentsByArticleId(article.id))
)

export default answer$
