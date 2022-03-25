import { Observable, of } from 'rxjs'
import { Ball } from '../shared/types'

export const createBallStream = (): Observable<Ball> => of()

export const renderBall = (): void => {}
