import { BehaviorSubject, fromEvent, map } from 'rxjs'
import { PADDLE_COLOR, PADDLE_HEIGHT, PADDLE_WIDTH } from './common/settings'
import { Paddle } from './common/types'
import { clamp, drawRectangle } from './common/utils'

export const createPaddleSubject = (paddle: Paddle, canvas: HTMLCanvasElement): BehaviorSubject<Paddle> => {
  const keepInCanvas = clamp(0, canvas.width - PADDLE_WIDTH)
  const subject = new BehaviorSubject(paddle)
  const paddleMoves$ = fromEvent<MouseEvent>(canvas, 'mousemove').pipe(
    map((mouseMove) => ({
      ...subject.value,
      // make sure the paddle doesn't go off screen
      x: keepInCanvas(mouseMove.clientX - PADDLE_WIDTH / 2),
    }))
  )

  // make the subject observe the moving paddle events
  paddleMoves$.subscribe(subject)
  return subject
}

export const renderPaddle = (canvasContext: CanvasRenderingContext2D, { x, y }: Paddle): void => {
  drawRectangle(canvasContext, {
    x,
    y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    fill: PADDLE_COLOR,
  })
}
