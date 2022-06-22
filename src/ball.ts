import { Observable, of } from 'rxjs'
import { BALL_COLOR } from '../shared/settings'
import { Ball } from '../shared/types'
import { drawCircle } from '../shared/utils'

export const createBallStream = (initialBall: Ball, canvas: HTMLCanvasElement): Observable<Ball> => of(initialBall)

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y, radius }: Ball): void => {
  drawCircle(canvasContext, { x, y, radius, color: BALL_COLOR })
}
