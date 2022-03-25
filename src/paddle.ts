import { Observable, of } from 'rxjs'
import { Paddle } from '../shared/types'

export const createPaddleStream = (): Observable<Paddle> => of()

export const renderPaddle = (): void => {}
