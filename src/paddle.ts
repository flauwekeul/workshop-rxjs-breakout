import { fromEvent, map, Observable, startWith } from 'rxjs'
import { PADDLE_COLOR, PADDLE_HEIGHT, PADDLE_WIDTH } from '../shared/settings'
import { Paddle } from '../shared/types'
import { clamp, drawRectangle } from '../shared/utils'

export const createPaddleStream = (paddle: Paddle, canvas: HTMLCanvasElement): Observable<Paddle> => {
  const keepOnScreen = clamp(0, canvas.width - PADDLE_WIDTH)
  return fromEvent<MouseEvent>(canvas, 'mousemove').pipe(
    map(({ clientX }) => ({ x: keepOnScreen(clientX - PADDLE_WIDTH / 2), y: paddle.y })),
    startWith(paddle)
  )
}

export const renderPaddle = (canvasContext: CanvasRenderingContext2D, { x, y }: Paddle): void => {
  drawRectangle(canvasContext, { x, y, width: PADDLE_WIDTH, height: PADDLE_HEIGHT, fill: PADDLE_COLOR })
}
