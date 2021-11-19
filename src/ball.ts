import { of } from 'rxjs'
import { centerTopOfPaddle } from './paddle'
import { BALL_COLOR, BALL_RADIUS, PADDLE_HEIGHT, PADDLE_WIDTH } from './settings'
import { Ball, Paddle, Position } from './types'
import { createVector, drawCircle } from './utils'

export const createBall = (ball: Ball) => of(ball)

export const updateBall = (ball: Ball, paddle: Paddle, screenWidth: number) => {
  if (ball.speed === 0) {
    const { x, y } = centerTopOfPaddle(paddle)
    ball.x = x
    ball.y = y
    return
  }

  const hasBallTouchedSide = ball.x <= BALL_RADIUS || ball.x >= screenWidth - BALL_RADIUS
  if (hasBallTouchedSide) {
    ball.direction *= -1
  }

  const ballBottom = ball.y + BALL_RADIUS
  const hasBallTouchedTop = ball.y <= BALL_RADIUS
  const hasBallTouchedPaddle =
    ballBottom >= paddle.y &&
    // if the ball passed the paddle bottom, consider it lost
    ballBottom < paddle.y + PADDLE_HEIGHT &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + PADDLE_WIDTH

  if (hasBallTouchedTop || hasBallTouchedPaddle) {
    ball.direction = ball.direction * -1 + 180
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
