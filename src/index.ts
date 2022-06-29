import {
  animationFrames,
  BehaviorSubject,
  map,
  of,
  pairwise,
  skip,
  startWith,
  takeWhile,
  tap,
  withLatestFrom,
} from "rxjs";
import {
  BALL_INITIAL_DIRECTION,
  BALL_INITIAL_SPEED,
  BALL_RADIUS,
  BRICK_SCORE,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from "../shared/settings";
import { Ball, Paddle } from "../shared/types";
import { centerTopOfPaddle, createCanvas } from "../shared/utils";
import { createBallStream, renderBall } from "./ball";
import { createBricksStream, renderBricks } from "./bricks";
import { renderGameOver } from "./gameOver";
import { createLivesSubject, renderLives } from "./lives";
import { createPaddleStream, renderPaddle } from "./paddle";
import { createScoreSubject, renderScore } from "./score";

const { canvas, canvasContext } = createCanvas();

const initialPaddle: Paddle = {
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_HEIGHT - PADDLE_BOTTOM_MARGIN,
};

const initialBall: Ball = {
  ...centerTopOfPaddle(initialPaddle),
  direction: BALL_INITIAL_DIRECTION,
  speed: BALL_INITIAL_SPEED,
  radius: BALL_RADIUS,
};

const score$ = createScoreSubject(0);
const lives$ = createLivesSubject(3);
const bricks$ = createBricksStream(canvas);
const paddle$ = createPaddleStream(initialPaddle, canvas);
const ball$ = createBallStream(initialBall, paddle$, bricks$, lives$, canvas);

/**
 * Meta behaviour
 * -----------------------------------------------*/
ball$
  .pipe(
    map((ball) => ball.speed),
    startWith(0),
    pairwise(),
    tap(([previous, current]) => {
      if (previous > 0 && current === 0) {
        lives$.next(lives$.getValue() - 1);
      }
    })
  )
  .subscribe();

bricks$
  .pipe(
    skip(1),
    tap(() => {
      score$.next(score$.getValue() + BRICK_SCORE);
    })
  )
  .subscribe();

/**
 * Render function
 * -----------------------------------------------*/
animationFrames()
  .pipe(
    withLatestFrom(paddle$, ball$, lives$, bricks$, score$),
    tap(([_, paddle, ball, lives, bricks, score]) => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      renderPaddle(canvasContext, paddle);
      renderBall(canvasContext, ball);
      renderLives(canvasContext, lives);
      renderBricks(canvasContext, bricks);
      renderScore(canvasContext, score);
      renderGameOver(canvasContext, lives);
    }),
    takeWhile(([_, __, ___, lives]) => lives > 0)
  )
  .subscribe();
