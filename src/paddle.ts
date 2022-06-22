import { Observable, fromEvent, map, startWith } from 'rxjs'
import { PADDLE_COLOR, PADDLE_HEIGHT, PADDLE_WIDTH } from './common/settings'
import { Paddle } from './common/types'
import { clamp, drawRectangle } from './common/utils'

export const createPaddleStream = (paddle: Paddle, canvas: HTMLCanvasElement): Observable<Paddle> => {
  const keepInCanvas = clamp(0, canvas.width - PADDLE_WIDTH)
  return fromEvent<MouseEvent>(canvas, 'mousemove').pipe(
    map((mouseMove) => ({
      ...paddle,
      // make sure the paddle doesn't go off screen
      x: keepInCanvas(mouseMove.clientX - PADDLE_WIDTH / 2),
    })),
    startWith(paddle)
  )
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
