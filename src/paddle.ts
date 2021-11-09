import { fromEvent, map, Observable, startWith } from 'rxjs'
import { PADDLE_BOTTOM_MARGIN, PADDLE_COLOR, PADDLE_HEIGHT, PADDLE_WIDTH } from './settings'
import { Position } from './types'
import { clamp, drawRectangle } from './utils'

const HALF_PADDLE_WIDTH = PADDLE_WIDTH / 2

export const createPaddle = (canvas: HTMLCanvasElement): Observable<Position> => {
  // make sure the paddle doesn't go off screen
  const keepInCanvas = clamp(0, canvas.width - PADDLE_WIDTH)
  const y = canvas.height - PADDLE_HEIGHT - PADDLE_BOTTOM_MARGIN
  return fromEvent<MouseEvent>(canvas, 'mousemove').pipe(
    // center paddle to mouse x position
    map(({ clientX }) => ({ x: keepInCanvas(clientX - HALF_PADDLE_WIDTH), y })),
    // start the peddle in the middle of the screen (else it only appears when the mouse moves)
    startWith({ x: canvas.width / 2 - HALF_PADDLE_WIDTH, y })
  )
}

export const renderPaddle = (canvasContext: CanvasRenderingContext2D, { x, y }: Position) => {
  drawRectangle(canvasContext, {
    x,
    y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_COLOR,
  })
}
