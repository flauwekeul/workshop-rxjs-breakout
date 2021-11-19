import { of } from 'rxjs'
import { centerTopOfPaddle } from './paddle'
import { BALL_COLOR, BALL_RADIUS } from './settings'
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

  const hasBallCrossedSide = ball.x <= BALL_RADIUS || ball.x >= screenWidth - BALL_RADIUS
  const hasBallCrossedTop = ball.y <= BALL_RADIUS
  if (hasBallCrossedSide || hasBallCrossedTop) {
    ball.direction *= -1
    if (hasBallCrossedTop) {
      ball.direction += 180
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
