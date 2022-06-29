import {
  of,
  map,
  zip,
  interval,
  combineLatest,
  merge,
  mergeMap,
  switchMap,
  forkJoin,
  tap,
} from "rxjs";
import {
  article1,
  article2,
  assert,
  comments1,
  comments2,
  getArticlesByUserId,
  getCommentsByArticleId,
  getUser,
  user,
} from "./shared";

const articleIdClicks$ = zip(of(3, 6), interval(1000)).pipe(map(([id]) => id));

// articleIdClicks$ is an observable that mimics a user clicking a button that emits article ids.
// It waits a second, emits an id, waits another second, emits another id and then completes.
// 1. Just as in exercise 03, use getUser() and getArticlesByUserId() to fetch the current user's articles.
// 2. Use articleIdClicks$ to map each article id it emits to an article title and its comments (use getCommentsByArticleId()).
//    Each emitted value is an object with this shape: { title: string, comments: Comment[] }

const articles$ = getUser().pipe(
  mergeMap((user) => getArticlesByUserId(user.id))
);

const clickedArticles$ = combineLatest([articleIdClicks$, articles$]).pipe(
  switchMap(([articleId, articles]) =>
    articles.filter((a) => a.id === articleId)
  )
);

const answer$ = clickedArticles$.pipe(
  switchMap((article) => zip(getCommentsByArticleId(article.id), of(article))),
  map(([comments, article]) => ({ title: article.title, comments }))
);

assert(answer$, "1s a 999ms (b|)", {
  a: { title: article1.title, comments: comments1 },
  b: { title: article2.title, comments: comments2 },
});
