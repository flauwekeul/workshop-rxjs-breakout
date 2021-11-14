import { Observable, of } from 'rxjs'
import { BALL_COLOR, BALL_RADIUS } from './settings'
import { Ball, Position } from './types'
import { drawCircle } from './utils'

export const createBall = (ball: Ball): Observable<Ball> => of(ball)

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y }: Position): void => {
  drawCircle(canvasContext, {
    x,
    y,
    radius: BALL_RADIUS,
    color: BALL_COLOR,
  })
}
