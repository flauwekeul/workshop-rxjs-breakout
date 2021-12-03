import { fromEvent, map, startWith, take } from 'rxjs'
import { centerTopOfPaddle } from './paddle'
import {
  BALL_COLOR,
  BALL_INITIAL_SPEED,
  BALL_SPEED_INCREASE,
  FAR_LEFT_BOUNCE_DIRECTION,
  FAR_RIGHT_BOUNCE_DIRECTION,
  PADDLE_WIDTH,
} from './settings'
import { Ball, Brick, Circle, Paddle } from './types'
import {
  createVector,
  drawCircle,
  getBrickCollision,
  hasBallTouchedPaddle,
  hasBallTouchedSide,
  hasBallTouchedTop,
  lerp,
} from './utils'

// returns a function that accepts a normalized value (between 0 and 1) that returns a direction between
// FAR_LEFT_BOUNCE_DIRECTION and FAR_RIGHT_BOUNCE_DIRECTION based on this normalized value
const paddleBounce = lerp(FAR_LEFT_BOUNCE_DIRECTION, FAR_RIGHT_BOUNCE_DIRECTION)

export const createBall = (ball: Ball, canvas: HTMLCanvasElement) =>
  fromEvent(canvas, 'click').pipe(
    take(1),
    // mapTo won't work, because the latest ball state is needed
    map(() => ({ ...ball, speed: BALL_INITIAL_SPEED })),
    startWith(ball)
  )

// todo: maybe better to keep functions pure?
export const updateBall = (ball: Ball, paddle: Paddle, screenWidth: number, bricks: Brick[]) => {
  if (ball.speed === 0) {
    const { x, y } = centerTopOfPaddle(paddle)
    ball.x = x
    ball.y = y
    return
  }

  // fixme: improve performance!
  // todo: think of something else for if/else horror
  const brickCollision = getBrickCollision(ball, bricks)
  if (brickCollision) {
    const { index, hasCollidedVertically } = brickCollision
    ball.direction = ball.direction * -1 + (hasCollidedVertically ? 0 : 180)
    // todo: show ball speed on screen?
    ball.speed *= BALL_SPEED_INCREASE
    // todo: use Subject instead of mutating bricks?
    bricks.splice(index, 1)
  } else if (hasBallTouchedPaddle(ball, paddle)) {
    const normalizedPaddleImpactPosition = (ball.x - paddle.x) / PADDLE_WIDTH
    ball.direction = paddleBounce(normalizedPaddleImpactPosition)
  } else if (hasBallTouchedSide(ball, screenWidth)) {
    ball.direction *= -1
  } else if (hasBallTouchedTop(ball)) {
    ball.direction = ball.direction * -1 + 180
  }

  const { deltaX, deltaY } = createVector(ball)
  ball.x += deltaX
  ball.y += deltaY
}

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y, radius }: Circle) => {
  drawCircle(canvasContext, {
    x,
    y,
    radius,
    color: BALL_COLOR,
  })
}
