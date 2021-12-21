import { fromEvent, map, startWith, take } from 'rxjs'
import { BALL_COLOR, BALL_INITIAL_SPEED } from './settings'
import { Ball, Circle } from './types'
import { drawCircle } from './utils'

export const createBallStream = (ball: Ball, canvas: HTMLCanvasElement) =>
  fromEvent(canvas, 'click').pipe(
    take(1),
    // mapTo won't work, because the latest ball state is needed
    map(() => ({ ...ball, speed: BALL_INITIAL_SPEED })),
    startWith(ball)
  )

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y, radius }: Circle) => {
  drawCircle(canvasContext, {
    x,
    y,
    radius,
    color: BALL_COLOR,
  })
}
