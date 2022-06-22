import { Observable, of } from 'rxjs'
import { Ball } from '../shared/types'

export const createBallStream = (initialBall: Ball, canvas: HTMLCanvasElement): Observable<Ball> => of()

export const renderBall = (canvasContext: CanvasRenderingContext2D, ball: Ball): void => {}
