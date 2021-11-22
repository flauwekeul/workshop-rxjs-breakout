import { fromEvent, map, startWith, take } from 'rxjs'
import { centerTopOfPaddle } from './paddle'
import {
  BALL_COLOR,
  BALL_INITIAL_SPEED,
  BALL_RADIUS,
  FAR_LEFT_BOUNCE_DIRECTION,
  FAR_RIGHT_BOUNCE_DIRECTION,
  PADDLE_WIDTH,
} from './settings'
import { Ball, Paddle, Position } from './types'
import { createVector, drawCircle, hasBallTouchedPaddle, hasBallTouchedSide, hasBallTouchedTop, lerp } from './utils'

// returns a function that accepts a normalized value (between 0 and 1) that returns a direction between
// FAR_LEFT_BOUNCE_DIRECTION and FAR_RIGHT_BOUNCE_DIRECTION based on this normalized value
const paddleBounce = lerp(FAR_LEFT_BOUNCE_DIRECTION, FAR_RIGHT_BOUNCE_DIRECTION)

export const createBall = (ball: Ball, canvas: HTMLCanvasElement) =>
  fromEvent<MouseEvent>(canvas, 'click').pipe(
    take(1),
    map(({ clientX }) => ({ ...ball, x: clientX, speed: BALL_INITIAL_SPEED })),
    startWith(ball)
  )

export const updateBall = (ball: Ball, paddle: Paddle, screenWidth: number) => {
  if (ball.speed === 0) {
    const { x, y } = centerTopOfPaddle(paddle)
    ball.x = x
    ball.y = y
    return
  }

  if (hasBallTouchedPaddle(ball, paddle)) {
    const normalizedPaddleImpactPosition = (ball.x - paddle.x) / PADDLE_WIDTH
    ball.direction = paddleBounce(normalizedPaddleImpactPosition)
  } else {
    if (hasBallTouchedSide(ball, screenWidth)) {
      ball.direction *= -1
    }
    if (hasBallTouchedTop(ball)) {
      ball.direction = ball.direction * -1 + 180
    }
  }

  const { deltaX, deltaY } = createVector(ball)
  ball.x += deltaX
  ball.y += deltaY
}

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y }: Position) => {
  drawCircle(canvasContext, {
    x,
    y,
    radius: BALL_RADIUS,
    color: BALL_COLOR,
  })
}
