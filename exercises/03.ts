import { assert, comments1, comments2, getArticlesByUserId, getCommentsByArticleId, getUser } from './shared'

// 1. Use getUser() to fetch the current user (it already returns an observable).
// 2. Use getArticlesByUserId() to fetch the user's articles.
// 3. Use getCommentsByArticleId() to fetch the comments for each article.
// 4. The resulting observable should emit each list of comments as separate events and then complete.

const answer$ = null // replace null with your answer

assert(answer$, '(ab|)', { a: comments1, b: comments2 })
