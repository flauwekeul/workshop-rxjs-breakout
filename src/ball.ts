import { Observable, of } from 'rxjs'
import { BALL_COLOR } from './common/settings'
import { Ball } from './common/types'
import { drawCircle } from './common/utils'

export const createBallStream = (initialBall: Ball, canvas: HTMLCanvasElement): Observable<Ball> => of(initialBall)

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y, radius }: Ball): void => {
  drawCircle(canvasContext, { x, y, radius, color: BALL_COLOR })
}
