import { of } from 'rxjs'
import {
  BRICKS_MARGIN,
  BRICKS_PER_ROW,
  BRICK_COLOR_MAP,
  BRICK_COLOR_PER_ROW,
  BRICK_HEIGHT,
  BRICK_ROWS,
} from './settings'
import { Brick } from './types'
import { drawRectangle } from './utils'

// create bricks row for row, starting at the bottom
export const createBricks = (canvas: HTMLCanvasElement) => {
  // twice BRICK_MARGIN for left and right
  const brickWidth = Math.floor((canvas.width - 2 * BRICKS_MARGIN) / BRICKS_PER_ROW)

  return of<Brick[]>(
    Array.from({ length: BRICK_ROWS }).flatMap((_, row) =>
      Array.from({ length: BRICKS_PER_ROW }).map((_, col) => ({
        x: col * brickWidth + BRICKS_MARGIN,
        y: (BRICK_ROWS - 1 - row) * BRICK_HEIGHT + BRICKS_MARGIN,
        width: brickWidth,
        height: BRICK_HEIGHT,
        color: BRICK_COLOR_PER_ROW[row],
      }))
    )
  )
}

export const renderBricks = (canvasContext: CanvasRenderingContext2D, bricks: Brick[]) => {
  bricks.forEach(({ x, y, width, height, color }) => {
    drawRectangle(canvasContext, {
      x,
      y,
      width,
      height,
      fill: BRICK_COLOR_MAP[color],
      strokeWidth: 3,
      strokeColor: '#333',
    })
  })
}
