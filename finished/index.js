import {animationFrameScheduler, combineLatest, interval, sampleTime, takeWhile, tap} from "../snowpack/pkg/rxjs.js";
import {
  BALL_INITIAL_DIRECTION,
  BALL_RADIUS,
  BALL_SPEED_INCREASE,
  BRICK_SCORE,
  FAR_LEFT_BOUNCE_DIRECTION,
  FAR_RIGHT_BOUNCE_DIRECTION,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  TICK_INTERVAL
} from "../shared/settings.js";
import {
  centerTopOfPaddle,
  createCanvas,
  drawGameOver,
  getBrickCollision,
  hasBallPassedPaddle,
  hasBallTouchedPaddle,
  hasBallTouchedSide,
  hasBallTouchedTop,
  lerp,
  nextBallPosition
} from "../shared/utils.js";
import {createBallSubject, renderBall} from "./ball.js";
import {createBricksSubject, renderBricks} from "./bricks.js";
import {createLivesSubject, renderLives} from "./lives.js";
import {createPaddleStream, renderPaddle} from "./paddle.js";
import {createScoreSubject, renderScore} from "./score.js";
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
const ticks$ = interval(TICK_INTERVAL, animationFrameScheduler);
const paddle$ = createPaddleStream(initialPaddle, canvas);
const ball$ = createBallSubject(initialBall, canvas);
const bricks$ = createBricksSubject(canvas);
const lives$ = createLivesSubject(3);
const score$ = createScoreSubject(0);
const paddleBounce = lerp(FAR_LEFT_BOUNCE_DIRECTION, FAR_RIGHT_BOUNCE_DIRECTION);
const updateEntities = ({paddle, ball, bricks, lives, score}) => {
  if (ball.speed === 0) {
    canvas.classList.remove("hide-cursor");
    const {x: x2, y: y2} = centerTopOfPaddle(paddle);
    ball.x = x2;
    ball.y = y2;
    return;
  }
  canvas.classList.add("hide-cursor");
  if (hasBallPassedPaddle(ball.y, paddle)) {
    lives$.next(--lives);
    if (lives > 0) {
      ball$.next(initialBall);
    }
    return;
  }
  const brickCollision = getBrickCollision(ball, bricks);
  if (brickCollision) {
    const {brickIndex, hasCollidedVertically} = brickCollision;
    ball.direction = ball.direction * -1 + (hasCollidedVertically ? 0 : 180);
    ball.speed *= BALL_SPEED_INCREASE;
    const bricksWithoutCollidedBrick = bricks.filter((_, i) => i !== brickIndex);
    bricks$.next(bricksWithoutCollidedBrick);
    score$.next(score + BRICK_SCORE);
  } else if (hasBallTouchedPaddle(ball, paddle)) {
    const normalizedPaddleImpactPosition = (ball.x - paddle.x) / PADDLE_WIDTH;
    ball.direction = paddleBounce(normalizedPaddleImpactPosition);
  } else if (hasBallTouchedSide(ball, canvas.width)) {
    ball.direction *= -1;
  } else if (hasBallTouchedTop(ball)) {
    ball.direction = ball.direction * -1 + 180;
  }
  const {x, y} = nextBallPosition(ball);
  ball.x = x;
  ball.y = y;
};
const render = ({paddle, ball, bricks, lives, score}) => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  renderPaddle(canvasContext, paddle);
  renderBall(canvasContext, ball);
  renderBricks(canvasContext, bricks);
  renderLives(canvasContext, lives);
  renderScore(canvasContext, score);
};
combineLatest({tick: ticks$, paddle: paddle$, ball: ball$, bricks: bricks$, lives: lives$, score: score$}).pipe(sampleTime(TICK_INTERVAL, animationFrameScheduler), tap(updateEntities), tap(render), takeWhile(({lives}) => lives > 0)).subscribe({
  complete: () => {
    drawGameOver(canvasContext, score$.getValue());
  }
});
