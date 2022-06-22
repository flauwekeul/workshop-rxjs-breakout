import { Observable, of } from 'rxjs'

export const createScoreSubject = (score: number): Observable<number> => of()

export const renderScore = (canvasContext: CanvasRenderingContext2D, score: number): void => {}
