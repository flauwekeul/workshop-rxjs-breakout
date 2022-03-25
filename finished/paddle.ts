import { fromEvent, map, Observable, startWith } from 'rxjs'
import { PADDLE_COLOR, PADDLE_HEIGHT, PADDLE_WIDTH } from '../shared/settings'
import { Paddle, Position } from '../shared/types'
import { clamp, drawRectangle } from '../shared/utils'

export const createPaddleStream = (paddle: Paddle, canvas: HTMLCanvasElement): Observable<Paddle> => {
  // make sure the paddle doesn't go off screen
  const keepInCanvas = clamp(0, canvas.width - PADDLE_WIDTH)
  // todo: move to updateEntities()?
  return fromEvent<MouseEvent>(canvas, 'mousemove').pipe(
    // center paddle to mouse x position
    map(({ clientX }) => ({ x: keepInCanvas(clientX - PADDLE_WIDTH / 2), y: paddle.y })),
    // start the peddle in the middle of the screen (else it only appears once the mouse moves)
    startWith(paddle)
  )
}

export const renderPaddle = (canvasContext: CanvasRenderingContext2D, { x, y }: Position): void => {
  drawRectangle(canvasContext, {
    x,
    y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    fill: PADDLE_COLOR,
  })
}
