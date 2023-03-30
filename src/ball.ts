import { Observable, of } from 'rxjs'
import { Ball } from './common/types'

export const createBallStream = (initialBall: Ball, canvas: HTMLCanvasElement): Observable<Ball> => of()

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y, radius }: Ball): void => {}
