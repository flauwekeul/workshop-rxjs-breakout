import { Observable, of } from 'rxjs'
import { Brick } from '../shared/types'

export const createBricksStream = (): Observable<Brick[]> => of()

export const renderBricks = (): void => {}
