import { fromEvent, Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { BALL_RADIUS, PADDLE_COLOR, PADDLE_HEIGHT, PADDLE_WIDTH } from './settings'
import { Paddle, Position } from './types'
import { clamp, drawRectangle } from './utils'

export const createPaddle = (paddle: Paddle, canvas: HTMLCanvasElement): Observable<Paddle> => {
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
    color: PADDLE_COLOR,
  })
}

export const centerTopOfPaddle = (paddle: Paddle): Position => ({
  x: paddle.x + PADDLE_WIDTH / 2,
  y: paddle.y - BALL_RADIUS,
})
