import { Observable, of } from 'rxjs'
import { Brick } from '../shared/types'

export const createBricksStream = (canvas: HTMLCanvasElement): Observable<Brick[]> => of()

export const renderBricks = (canvasContext: CanvasRenderingContext2D, bricks: Brick[]): void => {}
