import { Observable, of } from 'rxjs'
import { Paddle } from '../shared/types'

export const createPaddleStream = (paddle: Paddle, canvas: HTMLCanvasElement): Observable<Paddle> => of()

export const renderPaddle = (canvasContext: CanvasRenderingContext2D, paddle: Paddle): void => {}
