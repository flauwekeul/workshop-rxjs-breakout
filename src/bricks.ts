import { Observable, of } from 'rxjs'
import { BRICKS_PER_ROW, BRICK_COLOR_MAP, BRICK_ROWS, BRICK_STROKE_COLOR } from './common/settings'
import { Brick } from './common/types'
import { brickBuilder, drawRectangle } from './common/utils'

// create bricks row for row, starting at the bottom
export const createBricksStream = (canvas: HTMLCanvasElement): Observable<Brick[]> => {
  const createBrick = brickBuilder(canvas)
  const rows = Array.from({ length: BRICK_ROWS })
  const cols = Array.from({ length: BRICKS_PER_ROW })
  const bricks = rows.flatMap((_, row) => cols.map((_, col) => createBrick(col, row)))

  return of(bricks)
}

export const renderBricks = (canvasContext: CanvasRenderingContext2D, bricks: Brick[]): void => {
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
