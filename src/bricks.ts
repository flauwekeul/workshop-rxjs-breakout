import { BehaviorSubject, Observable, of } from "rxjs";
import {
  BRICKS_PER_ROW,
  BRICK_COLOR_MAP,
  BRICK_ROWS,
  BRICK_STROKE_COLOR,
} from "../shared/settings";
import { Brick } from "../shared/types";
import { brickBuilder, drawRectangle } from "../shared/utils";

export const createBricksStream = (
  canvas: HTMLCanvasElement
): BehaviorSubject<Brick[]> => {
  const buildBrick = brickBuilder(canvas);
  return new BehaviorSubject(
    Array.from({ length: BRICKS_PER_ROW * BRICK_ROWS }).map((_, index) =>
      buildBrick(index % BRICKS_PER_ROW, Math.floor(index / BRICKS_PER_ROW))
    )
  );
};

export const renderBricks = (
  canvasContext: CanvasRenderingContext2D,
  bricks: Brick[]
): void => {
  bricks.forEach(({ x, y, width, height, color }) => {
    drawRectangle(canvasContext, {
      x,
      y,
      width,
      height,
      fill: BRICK_COLOR_MAP[color],
      strokeWidth: 3,
      strokeColor: BRICK_STROKE_COLOR,
    });
  });
};
