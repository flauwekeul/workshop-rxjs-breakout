# Create [Breakout!](https://abbekeultjes.nl/workshop-rxjs-breakout/finished/) with [RxJS](https://rxjs.dev)

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

## Slides

Show the slides with `npm run slides` or see them [online](https://abbekeultjes.nl/workshop-rxjs-breakout/slides).

## Exercises

The `exercises` folder contains 4 exercises to practice your RxJS skills. To see if you've supplied a correct answer, run `npm run exercise:<n>` (where `<n>` is the number of the exercise (without the leading 0)).

**Tip**: `tap()` is a convenient operator for logging values in your stream.

### Get help

The trainer is there to help out, but there are also these resources:

* 📜 [RxJS API docs](https://rxjs.dev/api)
* 🌳 [Operator decision tree](https://rxjs.dev/operator-decision-tree)
* 🧑‍🏫 [Learn RxJS](https://www.learnrxjs.io/) (⚠️ partially outdated)

## The workshop

You're going to create the game by following the steps below. It may be more fun to team up with one or two partners, but you can go solo as well. Also, you can choose to do the workshop together with the trainer.

If you can't keep up or fall in a rabbit hole deep in a plate of spaghetti code 🐇🕳️🍝, there are branches for each step. To go to *the end of* step 2 for example, run `git checkout step-2`.

### Development

Run `npm start` to start a dev server and visit `http://localhost:8080/` to see the fruits of your labour. You can import types, constants and utils from the `shared` folder.

### Step 1: Render a paddle that "follows" the mouse

1. Change `createPaddleStream()` in paddle.ts so that it returns an observable that emits the mouse's x position and the (static) paddle's y position.
2. Change `renderPaddle()` in paddle.ts to use the `drawRectangle()` util and `PADDLE_WIDTH`, `PADDLE_HEIGHT` and `PADDLE_COLOR` settings (from shared/settings.ts).
3. Subscribe to `paddle$` in `main()` and make sure `renderState()` is called every time `paddle$` emits a value. Use `renderPaddle()` in `renderState()` to render the paddle on screen. You need to *persuade* TypeScript you're passing an object of type `GameState`.
4. Use `canvasContext.clearRect(0, 0, canvas.width, canvas.height)` in `renderState()` to start with a "clean slate" on each frame (do this *before* rendering anything).
5. Use the `clamp()` util in `renderPaddle()` to prevent the paddle to go off screen. Pass it the lower and upper bound it should *clamp* the paddle between (hint: the minimum and maximum x positions the paddle may have). It then returns a function that accepts the paddle position (hint: use the paddle's center) and it will return the paddle position clamped between the lower and upper bound.
6. *Optional*: make the paddle start in the middle of the screen (before any mouse events have fired).

### Step 2: Place a ball on the paddle

1. Change `createBallStream()` in ball.ts so that it wraps the initial ball in an Observable and returns it.
2. Subscribe to both the `paddle$` *and* the `ball$` observables in `main()`; choose a suitable [creation operator](https://rxjs.dev/guide/operators#join-creation-operators).
3. Change `renderBall()` in ball.ts to use `drawCircle()` (from shared/utils.ts) and `BALL_COLOR` (from shared/settings.ts) to render the ball. Use `renderBall()` in `renderState()` to draw the ball on screen.
4. In `nextState()` use the utils `createNextBall()` and `centerTopOfPaddle()` to update the ball's x position based on the paddle's x position. Use the appropriate operator in your pipeline to call `nextState()`.

### Step 3: Detach the ball on click

1. Change `createBallStream()` so that it starts listening to mouse *click events*, that are *map*ped to a ball object with a speed set to `BALL_INITIAL_SPEED`.
2. Notice that nothing is rendered until a click event happens. How come? Fix it.
3. If the ball's speed === 0, it should just stay on the paddle. If its speed > 0 (after a click) it should leave the paddle and move up. Add this logic to `nextState()`.
4. When you now click, the ball stops moving some pixels above the paddle. Why is that? For now we'll fix it by mutating the ball in-place (with `Object.assign()` for example). We'll remove this side-effect and make all functions pure later!
5. Notice that the ball now only moves when the mouse moves. Why is this? Try to figure this out before moving on. Fix it by using an observable that emits every *animation frame* (find the RxJS function that does this).
6. Notice that the ball now moves faster when the mouse moves. How come? Fix it by making the observable that emits every animation frame the main source observable and *combine the latest emitted value* from `paddle$` and `ball$` into it.
7. *Optional*: add the CSS class `hide-cursor` to the canvas when the ball speed > 0, remove the class otherwise.
8. Notice that each time you click, the ball position is reset to that of the paddle. This shouldn't happen. Fix it by only *taking* a single click event.
9. There's still a bug left: when you click, the ball always starts its upward journey from its initial position (the center of the screen). Why does this happen? We could fix this by mutating `ball` some more, but let's start doing proper state management and learn about Subjects! (cue for the trainer to explain Subjects.)

### Step 4: Refactor to use Subjects

1. Rename `createPaddleStream()` to `createPaddleSubject()` and make it use a BehaviorSubject. Make it "listen to" `mousemove` events.
2. Do the same for `createBallStream()`: rename to `createBallSubject()`, make it use a BehaviorSubject and make it "listen to" `click` events.
3. Do you still need the `startWith()` operator?
4. The fix from step 3.8 doesn't work anymore, why? Replace the operator with a better one.
5. Remove the mutation in `nextState()` making it a pure function that always returns a new `GameState`.
6. Use `updateState()` to "send" the new `paddle` and `ball` states to `paddle$` and `ball$` respectively.

### Step 5: Make the ball bounce

1. When the ball's speed > 0 and it's touching or passed the "ceiling" (top of screen), the ball's upward motion should become a downward motion. Use the `hasBallTouchedTop()` util and when it returns `true`, this code flips the ball's vertical motion: `ball.direction * -1 + 180`.
2. Similarly, when the ball touches or passes the sides of the screen, its horizontal motion should be "flipped". Use the `hasBallTouchedSide()` util and simply invert the ball's direction to make it bounce off the walls (`ball.direction * -1`).
3. Then the ball needs to bounce off the paddle when it hits. Flip the ball's vertical motion when the `hasBallTouchedPaddle()` returns `true` (same logic as when the ball touches the top of the screen).
4. *Optional*: give the player more control over the ball by changing its direction depending on where the ball hits the paddle. If the ball hits the far left or right edge of the paddle, the ball should have almost no upward motion. If the ball hits the exact center of the paddle, it should have *only* upward motion. You need *linear interpolation* for this and there's a util called `lerp()` that helps gives you that. First pass it the boundaries (use `FAR_LEFT_BOUNCE_DIRECTION` and `FAR_RIGHT_BOUNCE_DIRECTION`) and it returns a function that needs a value between `0` and `1` which will return the new ball direction. Here's `lerp()`'s signature:
   ```ts
   function lerp(leftBoundary: number, rightBoundary: number): (value: number /* 0 - 1 */) => number /* ball direction */
   ```
   The value between `0` and `1` is the *normalized* x position where the ball hits the paddle (because that determines the new direction). To get this normalized value use `(ball.x - paddle.x) / PADDLE_WIDTH`.

### Step 6: Add bricks

1. Change `createBricksStream()` in bricks.ts so that it calls the `brickBuilder()` util. It returns a function that accepts a column and row which returns a brick.
2. Create a "wall of bricks" by looping from `0` to `BRICK_ROWS` (rows) and inside that loop from `0` to `BRICKS_PER_ROW` (cols). Bonus points if you can keep it declarative (without using `for`/`while` loops). The result should be a **flat** array of bricks wrapped in an observable.
3. Change `renderBricks()` in bricks.ts to use the `drawRectangle()` util and `BRICK_COLOR_MAP` and `BRICK_STROKE_COLOR` settings to render each brick. Note that `BRICK_COLOR_MAP` is an object; to set `fill` use `BRICK_COLOR_MAP[brick.color]`. Also, you may want to set `strokeWidth` to `3` so that each brick has some spacing around it.
4. Add the `bricks$` observable in `main()` and use `renderBricks()` in `renderState()` to render the bricks on screen.

### Step 7: Break bricks when the ball collides

1. Use the `getBrickCollision()` util to determine if the ball has collided with a brick. Do this where you also check for wall and paddle collisions. When a collision happened, `getBrickCollision()` returns an object with two props:
   * `brickIndex`: the index of the collided brick
   * `hasCollidedVertically`: whether the collision took place on the vertical sides of a brick. If this is `false`, the collision was on the top or bottom of a brick. The ball needs to change direction differently depending on this value.
2. When the ball hits a brick, create a new ball with its direction changed as when it hits the left or right side of the screen or when it hits the top of the screen (use `hasCollidedVertically`). Also make sure the new ball's speed is multiplied by `BALL_SPEED_INCREASE`.
3. When the ball hits a brick, the brick should be removed. Create a new array of bricks with this brick removed. Make `nextState()` return a new game state with the new ball from the previous step and bricks from this step.
4. Persist the updated bricks by renaming `createBricksStream()` to `createBricksSubject()` and make it return a BehaviorSubject. Persist the bricks state as you do for paddle and ball in `updateState()`.

### Step 8: Miss the paddle, reset the ball, lose a life

1. Change `createLivesSubject()` in lives.ts so that it simply returns a BehaviorSubject with a value of `lives`.
2. Change `renderLives()` in lives.ts, use the `drawText()` util.
3. Add `lives$` to `main()` and use `renderLives()` in `renderState()`.
4. Use the `hasBallMissedPaddle()` util in `nextState()` to determine if the ball moved below the paddle. When this happens, the ball needs to be reset. *Optional*: fix the glitch when you reset the ball to just `initialBall`.
5. Also subtract `1` from `lives` and return this from `nextState()`.
6. Persist the lives in `updateState()`.
7. See what happens when the final life is lost. Let's fix this by completing the main stream when you're out of lives (or put another way: keep the stream going *while* `lives > 0`). Also complete the stream when there are no more bricks left.

### Step 9: Keeping score and game over

1. Change `createScoreSubject()` in score.ts so that it simply returns a BehaviorSubject with the score that's passed to it.
2. Change `renderScore()` in score.ts to show the score on screen. Use the `drawText()` util (and optionally `formatNumber()` to format the score).
3. Add `score$` to `main()` and use `renderScore()` in `renderState()`.
4. Make sure to update the score by adding `BRICK_SCORE` when a brick is "popped" in `nextState()`. Persist the score in `updateState()`.
5. The completion of the main stream can be used to display a "Game over" message. Use the `drawGameOver()` util for this.

### Step 10: …?

This concludes the workshop, but there's plenty more to do of course! Some suggestions:
* Some buttons to pause/restart the game
* *Actually* keeping score (e.g. in localStorage)
* Power-ups (that randomly fall from popped bricks)
* Keyboard controls
* Fancy graphics with animations
* Sounds
* Multiplayer
