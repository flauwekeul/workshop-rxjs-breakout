import { fromEvent, map, Observable, startWith, take } from 'rxjs'
import { BALL_COLOR, BALL_INITIAL_SPEED } from '../shared/settings'
import { Ball } from '../shared/types'
import { drawCircle } from '../shared/utils'

export const createBallStream = (initialBall: Ball, canvas: HTMLCanvasElement): Observable<Ball> =>
  fromEvent<MouseEvent>(canvas, 'click').pipe(
    take(1),
    map(() => ({ ...initialBall, speed: BALL_INITIAL_SPEED })),
    startWith(initialBall)
  )

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y, radius }: Ball): void => {
  drawCircle(canvasContext, { x, y, radius, color: BALL_COLOR })
}
