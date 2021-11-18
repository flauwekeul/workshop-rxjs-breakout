import { of } from 'rxjs'
import { centerTopOfPaddle } from './paddle'
import { BALL_COLOR, BALL_RADIUS } from './settings'
import { Ball, Paddle, Position } from './types'
import { createVector, drawCircle } from './utils'

export const createBall = (ball: Ball) => of(ball)

export const updateBall = (ball: Ball, paddle: Paddle) => {
  if (ball.speed === 0) {
    const { x, y } = centerTopOfPaddle(paddle)
    ball.x = x
    ball.y = y
  } else {
    const { deltaX, deltaY } = createVector(ball)
    ball.x += deltaX
    ball.y += deltaY
  }
}

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y }: Position) => {
  drawCircle(canvasContext, {
    x,
    y,
    radius: BALL_RADIUS,
    color: BALL_COLOR,
  })
}
