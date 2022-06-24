import {fromEvent, map, startWith} from "../snowpack/pkg/rxjs.js";
import {PADDLE_COLOR, PADDLE_HEIGHT, PADDLE_WIDTH} from "../shared/settings.js";
import {clamp, drawRectangle} from "../shared/utils.js";
export const createPaddleStream = (paddle, canvas) => {
  const keepInCanvas = clamp(0, canvas.width - PADDLE_WIDTH);
  return fromEvent(canvas, "mousemove").pipe(map(({clientX}) => ({x: keepInCanvas(clientX - PADDLE_WIDTH / 2), y: paddle.y})), startWith(paddle));
};
export const renderPaddle = (canvasContext, {x, y}) => {
  drawRectangle(canvasContext, {
    x,
    y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    fill: PADDLE_COLOR
  });
};
