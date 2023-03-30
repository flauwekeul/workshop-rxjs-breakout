import { Observable, of } from 'rxjs'
import { Paddle } from './common/types'

export const createPaddleStream = (paddle: Paddle, canvas: HTMLCanvasElement): Observable<Paddle> => of()

export const renderPaddle = (canvasContext: CanvasRenderingContext2D, { x, y }: Paddle): void => {}
