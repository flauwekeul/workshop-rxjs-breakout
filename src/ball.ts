import {
  BehaviorSubject,
  filter,
  fromEvent,
  interval,
  map,
  merge,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from "rxjs";
import {
  BALL_COLOR,
  BALL_RADIUS,
  BALL_SPEED,
  BALL_SPEED_INCREASE,
  GAME_SPEED,
  PADDLE_WIDTH,
} from "../shared/settings";
import { Ball, Brick, Paddle, Position } from "../shared/types";
import {
  centerTopOfPaddle,
  drawCircle,
  hasBallPassedPaddle,
  hasBallTouchedPaddle,
  hasBallTouchedSide,
  hasBallTouchedTop,
  nextBallPosition,
  getPaddleBounceDirection,
  getBrickCollision,
} from "../shared/utils";

export const createBallStream = (
  initialBall: Ball,
  paddle$: Observable<Paddle>,
  bricks$: BehaviorSubject<Brick[]>,
  lives$: BehaviorSubject<number>,
  canvas: HTMLCanvasElement
): Observable<Ball> => {
  const startBall$ = new BehaviorSubject(initialBall);
  fromEvent(canvas, "click")
    .pipe(
      filter(() => lives$.getValue() > 0 && startBall$.getValue().speed === 0),
      withLatestFrom(paddle$),
      map(([_, paddle]) => ({
        radius: initialBall.radius,
        speed: BALL_SPEED,
        direction: initialBall.direction,
        ...centerTopOfPaddle(paddle),
      })),
      startWith(initialBall)
    )
    .subscribe(startBall$);

  return interval(GAME_SPEED).pipe(
    withLatestFrom(startBall$, paddle$, bricks$),
    map(([_, ball, paddle, bricks]) => {
      if (hasBallPassedPaddle(ball.y, paddle)) {
        ball.speed = 0;
        ball.direction = initialBall.direction;
      }

      let newPosition: Position;
      if (ball.speed !== 0) {
        const originalDireciton = ball.direction;
        newPosition = nextBallPosition(ball);

        // this boolean keeps track wether or not a critical collision has occurred
        let needsReposition = true;
        const brickCollision = getBrickCollision(
          { ...ball, ...newPosition },
          bricks
        );
        if (brickCollision) {
          const { brickIndex, hasCollidedVertically } = brickCollision;
          ball.direction =
            ball.direction * -1 + (hasCollidedVertically ? 0 : 180);
          ball.speed *= BALL_SPEED_INCREASE;
          const bricksWithoutCollidedBrick = bricks.filter(
            (_, i) => i !== brickIndex
          );
          bricks$.next(bricksWithoutCollidedBrick);
        } else if (hasBallTouchedPaddle(newPosition, paddle)) {
          const normalizedPaddleImpactPosition =
            (ball.x - paddle.x) / PADDLE_WIDTH;
          ball.direction = getPaddleBounceDirection(
            normalizedPaddleImpactPosition
          );
        } else if (hasBallTouchedSide(newPosition, canvas.width)) {
          ball.direction *= -1;
        } else if (hasBallTouchedTop(newPosition)) {
          ball.direction = ball.direction * -1 + 180;
        } else {
          needsReposition = false;
        }

        if (needsReposition) {
          newPosition = nextBallPosition({
            ...nextBallPosition({
              x: ball.x,
              y: ball.y,
              speed: ball.speed * 0.5,
              direction: originalDireciton,
              radius: ball.radius,
            }),
            direction: ball.direction,
            speed: ball.speed * 0.5,
            radius: ball.radius,
          });
        }

        ball.x = newPosition.x;
        ball.y = newPosition.y;
      } else {
        newPosition = centerTopOfPaddle(paddle);
      }

      return {
        radius: ball.radius,
        speed: ball.speed,
        direction: ball.direction,
        ...newPosition,
      };
    })
  );
};

export const renderBall = (
  canvasContext: CanvasRenderingContext2D,
  ball: Ball
): void => {
  drawCircle(canvasContext, {
    x: ball.x,
    y: ball.y,
    radius: BALL_RADIUS,
    color: BALL_COLOR,
  });
};
