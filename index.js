import {of} from "./snowpack/pkg/rxjs.js";
import {
  BALL_INITIAL_DIRECTION,
  BALL_RADIUS,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH
} from "./shared/settings.js";
import {centerTopOfPaddle, createCanvas} from "./shared/utils.js";
import {createBallStream} from "./ball.js";
import {createBricksStream} from "./bricks.js";
import {createLivesSubject} from "./lives.js";
import {createPaddleStream} from "./paddle.js";
import {createScoreSubject} from "./score.js";
const {canvas, canvasContext} = createCanvas();
const initialPaddle = {
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_HEIGHT - PADDLE_BOTTOM_MARGIN
};
const initialBall = {
  ...centerTopOfPaddle(initialPaddle),
  direction: BALL_INITIAL_DIRECTION,
  speed: 0,
  radius: BALL_RADIUS
};
const ticks$ = of();
const paddle$ = createPaddleStream(initialPaddle, canvas);
const ball$ = createBallStream(initialBall, canvas);
const bricks$ = createBricksStream(canvas);
const lives$ = createLivesSubject(3);
const score$ = createScoreSubject(0);
