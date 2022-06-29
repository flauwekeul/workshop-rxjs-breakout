import { fromEvent, map, Observable, startWith, tap } from "rxjs";
import { PADDLE_COLOR, PADDLE_HEIGHT, PADDLE_WIDTH } from "../shared/settings";
import { Paddle } from "../shared/types";
import { clamp, drawRectangle } from "../shared/utils";

const HALF_PADDLE_WIDTH = PADDLE_WIDTH * 0.5;

export const createPaddleStream = (
  { x, y }: Paddle,
  canvas: HTMLCanvasElement
): Observable<Paddle> => {
  const clampedInCanvas = clamp(0, canvas.width - PADDLE_WIDTH);

  return fromEvent<MouseEvent>(canvas, "mousemove")
    .pipe(
      map((event) => ({
        x: clampedInCanvas(event.clientX - HALF_PADDLE_WIDTH),
        y,
      }))
    )
    .pipe(startWith({ x, y }));
};

export const renderPaddle = (
  canvasContext: CanvasRenderingContext2D,
  paddle: Paddle
): void => {
  drawRectangle(canvasContext, {
    x: paddle.x,
    y: paddle.y,
    fill: PADDLE_COLOR,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  });
};
