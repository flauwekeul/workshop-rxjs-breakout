import {BehaviorSubject} from "../snowpack/pkg/rxjs.js";
import {BRICKS_PER_ROW, BRICK_COLOR_MAP, BRICK_ROWS, BRICK_STROKE_COLOR} from "../shared/settings.js";
import {brickBuilder, drawRectangle} from "../shared/utils.js";
export const createBricksSubject = (canvas) => {
  const createBrick = brickBuilder(canvas);
  const rows = Array.from({length: BRICK_ROWS});
  const cols = Array.from({length: BRICKS_PER_ROW});
  const bricks = rows.flatMap((_, row) => cols.map((_2, col) => createBrick(col, row)));
  return new BehaviorSubject(bricks);
};
export const renderBricks = (canvasContext, bricks) => {
  bricks.forEach(({x, y, width, height, color}) => {
    drawRectangle(canvasContext, {
      x,
      y,
      width,
      height,
      fill: BRICK_COLOR_MAP[color],
      strokeWidth: 3,
      strokeColor: BRICK_STROKE_COLOR
    });
  });
};
