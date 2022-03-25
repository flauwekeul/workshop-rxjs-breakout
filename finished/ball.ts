import { BehaviorSubject, filter, fromEvent, map } from 'rxjs'
import { BALL_COLOR, BALL_INITIAL_SPEED } from '../shared/settings'
import { Ball, Circle } from '../shared/types'
import { drawCircle } from '../shared/utils'

export const createBallSubject = (initialBall: Ball, canvas: HTMLCanvasElement) => {
  const subject = new BehaviorSubject(initialBall)
  const startMovingEvents$ = fromEvent(canvas, 'click').pipe(
    // only "pass through" clicks if the current ball has no speed (i.e. sits on the paddle)
    filter(() => subject.getValue().speed === 0),
    // map the click event to a ball object with a speed > 0
    map(() => ({ ...initialBall, speed: BALL_INITIAL_SPEED }))
  )

  // make the subject observe the "click events that make the ball move"
  startMovingEvents$.subscribe(subject)
  return subject
}

export const renderBall = (canvasContext: CanvasRenderingContext2D, { x, y, radius }: Circle) => {
  drawCircle(canvasContext, {
    x,
    y,
    radius,
    color: BALL_COLOR,
  })
}
