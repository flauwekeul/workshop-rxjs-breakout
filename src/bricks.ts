import { Observable, of } from 'rxjs'
import { Brick } from './common/types'

export const createBricksStream = (canvas: HTMLCanvasElement): Observable<Brick[]> => of()

export const renderBricks = (canvasContext: CanvasRenderingContext2D, bricks: Brick[]): void => {}
