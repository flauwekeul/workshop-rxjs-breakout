# Create a game ([Breakout!](https://en.wikipedia.org/wiki/Breakout_(video_game))) with RxJS

A workshop in vanilla TypeScript.

## Agenda

* 9.00 - 9.30	Coffee ☕️ & 🤝 introduction
* 9.30 - 10.20 🧑‍🏫 Theory: RxJS
* 10.20 - 10.30	☕️ Break
* 10.30 - 12.00	🧑‍💻 Assignments
* 12.00 - 12.45	🥪 Lunch
* 12.45 - 17.00	🧑‍💻 Assignments (with breaks)

## Getting started

```
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

## Finished result

With the dev server running, go to [http://localhost:8080/finished/](http://localhost:8080/finished/) (**including the trailing slash** unfortunately) to see what you'll be making.

## Exercises

* 📜 RTFM: [RxJS API docs](https://rxjs.dev/api)
* 🌳 [Operator decision tree](https://rxjs.dev/operator-decision-tree)

### 1. Render a paddle that "follows" the mouse

1. Change `createPaddleStream()` in paddle.ts so that it returns an observable that emits the mouse's x position.
2. Change `renderPaddle()` in paddle.ts to render the paddle to screen. Use the `drawRectangle()` util and `PADDLE_WIDTH`, `PADDLE_HEIGHT` and `PADDLE_COLOR` settings (from shared/settings.ts).
3. Use the `clamp()` util to prevent the paddle to go off screen.
4. *Optional*: make the paddle start in the middle of the screen (before any mouse events have fired).

### 2. Place a ball on the paddle

1. Change `createBallStream()` in ball.ts so that it accepts an initial ball object, wraps it in an Observable and returns it.
2. Change `updateEntities()` in index.ts so that the ball's position is continuously updated to the paddle's center top position. Use the `centerTopOfPaddle()` util and **mutate** the ball's position in-place.
3. Change `renderBall()` in ball.ts to use `drawCircle()` (from shared/utils.ts) and `BALL_COLOR` (from shared/settings.ts) to render the ball.

### 3. Detach the ball on click

1. Change `createBallStream()` so that it starts listening to *a single* mouse *click event*, that's *map*ped to a ball object with a speed set to `BALL_INITIAL_SPEED`.
2. Make sure `createBallStream()` doesn't need to "wait" for a click event to show the ball; make it *start with* the initial ball object.
3. Change `updateEntities()` to update the ball's position *if it's speed > 0* (else it "sticks" to the paddle as in step 2). Use the `nextBallPosition()` util.
4. Notice that the ball now only moves when the mouse moves. Why is this? Fix it by making `ticks$` an observable that emits every `TICK_INTERVAL`. Be sure the right scheduler is used.
5. Notice that the ball now moves faster when the mouse moves. How come? Fix it by limiting the stream's "throughput" (the amount of events per unit of time). Start by looking for the right operator, then where to place it. Again, be sure the right scheduler is used.
6. *Optional*: add the CSS class `hide-cursor` to the canvas when the ball speed > 0, remove the class otherwise.

### 4. Make the ball bounce off the walls and paddle

1.
