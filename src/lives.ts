import { Observable, of } from 'rxjs'

export const createLivesSubject = (lives: number): Observable<number> => of()

export const renderLives = (canvasContext: CanvasRenderingContext2D, lives: number): void => {}
