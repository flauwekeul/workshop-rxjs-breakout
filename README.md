# Create a game ([Breakout!](https://en.wikipedia.org/wiki/Breakout_(video_game))) with RxJS

A workshop in vanilla TypeScript.

## Getting started

```bash
git clone git@github.com:flauwekeul/workshop-rxjs-breakout.git
cd workshop-rxjs-breakout
npm install
```

1. Clone the project from GitHub: https://github.com/flauwekeul/workshop-rxjs-breakout
2. `cd` into the folder
3. Install dependencies
4. Open your favorite editor

## Development

This project uses [Snowpack](https://www.snowpack.dev/). Run `npm start` to start a dev server and `http://localhost:8080/` will be opened automatically. You can use types, settings and utils from the `shared` folder. Take care not to import from the `finished` folder as that would make this workshop too easy 😉.

## Theory and exercises

Slides with theory are made using [slidev](https://sli.dev). Show the slides with `npm run slides`.

After the slides, some exercises can be done by writing code in the `exercises` folder.
To execute an exercise, run `npx ts-node exercises/01.ts` (replace `01.ts` with whatever file you want executed).

## Finished game

With the dev server running, go to [http://localhost:8080/finished/](http://localhost:8080/finished/) (**including the trailing slash** unfortunately) to see what you'll be making.

## Resources

* 📜 RTFM: [RxJS API docs](https://rxjs.dev/api)
* 🌳 Find operators: [Operator decision tree](https://rxjs.dev/operator-decision-tree)

## Creating the game

9 steps in (more or less) increasing difficulty:

### Step 1: Render a paddle that "follows" the mouse

1. Change `createPaddleStream()` in paddle.ts so that it returns an observable that emits the mouse's x position and the (static) paddle's y position.
2. Change `renderPaddle()` in paddle.ts to use the `drawRectangle()` util and `PADDLE_WIDTH`, `PADDLE_HEIGHT` and `PADDLE_COLOR` settings (from shared/settings.ts).
3. Subscribe to the observable returned from `createPaddleStream()` in index.ts. Also import `renderPaddle()` and use it to draw the paddle on screen.
4. Use `canvasContext.clearRect(0, 0, canvas.width, canvas.height)` *before* rendering start with a "clean slate" on each frame.
5. Use the `clamp()` util to prevent the paddle to go off screen (note that it returns a function).
6. *Optional*: make the paddle start in the middle of the screen (before any mouse events have fired).

### Step 2: Place a ball on the paddle

1. Change `createBallStream()` in ball.ts so that it wraps the initial ball in an Observable and returns it.
2. Subscribe to both the `paddle$` *and* the `ball$` observables in index.ts; choose a suitable [creation operator](https://rxjs.dev/guide/operators#join-creation-operators).
3. Before any rendering happens, update the ball's `x` position to the paddle's center top position on each emit. Do this by mutating `ball` in-place (I know this isn't *pure*, but it's very performant and simple). Use the `centerTopOfPaddle()` util.
4. Change `renderBall()` in ball.ts to use `drawCircle()` (from shared/utils.ts) and `BALL_COLOR` (from shared/settings.ts) to render the ball. Import `renderBall()` in index.ts to draw the ball on screen.

### Step 3: Detach the ball on click

1. Change `createBallStream()` so that it starts listening to *a single* mouse *click event*, that's *map*ped to a ball object with a speed set to `BALL_INITIAL_SPEED`.
2. Notice that nothing is rendered until a click event happens. How come? Fix it.
3. If the ball's speed > 0 (after a click), it should leave the paddle and move up. Check the ball's speed in index.ts before its position is updated. If speed > 0 use the `nextBallPosition()` util to update the ball's position, else: use the `centerTopOfPaddle()` util as you already did.
4. Notice that the ball now only moves when the mouse moves. Why is this? Try to figure this out before moving on.
5. Fix it by making `ticks$` an observable that emits every `TICK_INTERVAL` (use the correct operator). Combine this observable into your "paddle and ball" stream. Also pass a scheduler to the operator that internally uses `requestAnimationFrame()`. Do you know why?
6. Notice that the ball now moves faster when the mouse moves. How come? Fix it by limiting the stream's "throughput" (the amount of events per unit of time). Start by looking for the correct operator, then where to use it. Use the same scheduler as you did to create `ticks$`.
7. Notice that each time you click, the ball position is reset to that of the paddle. This shouldn't happen. Fix it by only *taking* a single click event.
8. *Optional*: add the CSS class `hide-cursor` to the canvas when the ball speed > 0, remove the class otherwise.

### Step 4: Make the ball bounce

1. When the ball's speed > 0 and it's touching or passed the "ceiling" (top of screen), the ball's upward motion should become a downward motion. Use the `hasBallTouchedTop()` util and when it returns `true`, this code flips the ball's vertical motion: `ball.direction = ball.direction * -1 + 180`. Would it better to do this before or after the ball's position is updated?
2. Similarly, when the ball touches or passes the sides of the screen, its horizontal motion should be "flipped". Use the `hasBallTouchedSide()` util and simply invert the ball's direction to make it bounce off the walls (`ball.direction *= -1`).
3. Then the ball needs to bounce off the paddle when it hits. Flip the ball's vertical motion when the `hasBallTouchedPaddle()` returns `true`.
4. If may want to refactor your code in index.ts now. E.g.: move the rendering of entities to a separate function and rearrange your conditionals to reduce nesting.
5. *Optional*: give the player more control over the ball by changing its direction depending on where the ball hits the paddle. If the ball hits near the left of right edge of the paddle, it should go West or East. If the ball hits the center of the paddle, it should go North. For this *linear interpolation* is needed and there's a util called `lerp()` for that. First pass it the boundaries (use `FAR_LEFT_BOUNCE_DIRECTION` and `FAR_RIGHT_BOUNCE_DIRECTION`), that returns a function that needs a value between `0` and `1` and will return the new ball direction. The value between `0` and `1` is the *normalized* x position where the ball hits the paddle (because that determines the new direction). To get this normalized value use `(ball.x - paddle.x) / PADDLE_WIDTH`.

### Step 5: Add blocks

1. Change `createBricksStream()` in bricks.ts so that it calls the `brickBuilder()` util. It returns a function that accepts a column and row which returns a brick.
2. Create a "wall of bricks" by looping from `0` to `BRICK_ROWS` (rows) and inside that loop from `0` to `BRICKS_PER_ROW` (cols). Bonus points if you can keep it declarative (without using `for` loops, but using Array methods instead). The result should be a **flat** array of bricks wrapped in an observable.
3. Change `renderBricks()` in bricks.ts to use the `drawRectangle()` util and `BRICK_COLOR_MAP` and `BRICK_STROKE_COLOR` settings to render each brick. Note that `BRICK_COLOR_MAP` is an object; to set `fill` use `BRICK_COLOR_MAP[brick.color]`. Also, you may want to set `strokeWidth` to `3` so that each brick has some spacing around it.
4. Import `renderBricks()` in index.ts to draw the bricks on screen.

Now may be a good time to learn about Subjects!

### Step 6: Break bricks when the ball collides

1. Use the `getBrickCollision()` util to determine if the ball has collided with a brick. Do this where you also check for wall and paddle collisions. When there's a collision `getBrickCollision()` returns an object with two props:
   * `brickIndex`: the index of the collided brick
   * `hasCollidedVertically`: whether the collision took place on the vertical sides of a brick. If this is `false`, the collision was on the top or bottom of a brick. The ball needs to change direction differently depending on this value.
2. When the ball hits a brick, change the ball's direction similar to when the ball hits the left or right screen sides or when the ball hits the top of the screen. Also increase the ball's speed by multiplying it with `BALL_SPEED_INCREASE`.
3. When the ball hits a brick, the brick should be removed. First rename `createBricksStream()` to `createBricksSubject()` and make it return a Subject (what kind?) instead of an observable. A new array of bricks (with the collided brick removed) can now be send to `bricks$`.

### Step 7: Miss the paddle, reset the ball

1. Use the `hasBallPassedPaddle()` util in index.ts to determine if the ball moved below the paddle. When this happens, return from the function because the ball needs to be reset and all the collision detection can be skipped.
2. To reset the ball, start by renaming `createBallStream()` to `createBallSubject()`, comment-out the existing code and make it create and return a BehaviorSubject with `initialBall` as initial value instead.
3. Obviously, clicking now won't make the ball leave the paddle anymore. To fix this again, a `ball` with a speed > 0 should be emitted to the BehaviorSubject when the user clicks, but only if the ball's speed is currently 0. Emitting a value to a Subject is as simple as using the Subject as an *observer* to an observable. We already have the Subject, our commented-out code is (nearly) the observable we need. So, "un-comment" the commented-out code and subscribe the BehaviorSubject to it.
4. To reset the ball, the BehaviorSubject needs to be send the initial ball (which has a speed of 0). Do this in index.ts where `hasBallPassedPaddle()` returns `true`. See what happens when the ball now passes the paddle. Why isn't the ball being reset? It has to do with the `take()` operator, if that's removed, the ball is reset, but now the ball is reset on *every* click. Fix this problem with an operator that doesn't complete the stream (like `take()` does).
5. Do you still need the `startWith()` operator?

### Step 8: Keeping score

1. Change `createScoreSubject()` in score.ts so that it simply returns a Subject (what kind?) with the score that's passed to it.
2. Change `renderScore()` in score.ts to show the score on screen. Use the `drawText()` util (and optionally `formatNumber()` to format the score). Call `renderScore()` in index.ts.
3. Make sure to update the score by adding `BRICK_SCORE` when a brick is "popped".

### Step 9: Add lives and game over

1. Change `createLivesSubject()` in lives.ts so that it simply returns a Subject (what kind?) with the amount of lives that's passed to it.
2. Change `renderLives()` in lives.ts to show the amount of lives on screen. Use the `drawText()` util. Call `renderLives()` in index.ts.
3. In index.ts, when the ball passes the paddle, use the `lives$` Subject to update the amount of lives.
4. The ball is now always reset, even if there aren't any lives left. Fix this.
5. See what happens when the final life is lost. Let's fix this by completing the main stream when `lives === 0`. (or put another way: keep the stream going *while* `lives > 0`).
6. The completion of the main stream can be used to display a "Game over" message. Use the `drawGameOver()` util for this.

### Step 10: …?

This concludes the workshop, but there's plenty more to do of course! Some suggestions:
* Some buttons to pause/restart the game.
* *Actually* keeping score (e.g. in localStorage)
* Power-ups (that randomly fall from popped bricks)
* Keyboard controls
* Fancy graphics with animations
* Sounds
* Multiplayer
