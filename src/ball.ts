import { BALL_COLOR, BALL_RADIUS } from './settings'
import { Position } from './types'
import { drawCircle } from './utils'

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y }: Position) => {
  drawCircle(canvasContext, {
    x,
    y,
    radius: BALL_RADIUS,
    color: BALL_COLOR,
  })
}
