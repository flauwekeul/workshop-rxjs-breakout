import { BehaviorSubject, Subject } from 'rxjs'
import { BRICKS_MARGIN, BRICKS_PER_ROW, BRICK_COLOR_MAP, BRICK_ROWS, BRICK_STROKE_COLOR } from './settings'
import { Brick } from './types'
import { brickBuilder, drawRectangle } from './utils'

// create bricks row for row, starting at the bottom
export const createBricksSubject = (canvas: HTMLCanvasElement): Subject<Brick[]> => {
  // twice BRICK_MARGIN for left and right
  const brickWidth = Math.floor((canvas.width - 2 * BRICKS_MARGIN) / BRICKS_PER_ROW)
  const createBrick = brickBuilder(brickWidth)

  const rows = Array.from({ length: BRICK_ROWS })
  const cols = Array.from({ length: BRICKS_PER_ROW })
  const bricks = rows.flatMap((_, row) => cols.map((_, col) => createBrick(col, row)))

  return new BehaviorSubject(bricks)
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
      strokeColor: BRICK_STROKE_COLOR,
    })
  })
}
