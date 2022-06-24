import {
  BALL_RADIUS,
  BRICKS_MARGIN,
  BRICKS_PER_ROW,
  BRICK_COLOR_PER_ROW,
  BRICK_HEIGHT,
  BRICK_ROWS,
  PADDLE_HEIGHT,
  PADDLE_WIDTH
} from "./settings.js";
export const createCanvas = (container = document.body) => {
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");
  container.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return {canvas, canvasContext};
};
export const drawRectangle = (canvasContext, {x, y, width, height, fill, strokeWidth = 0, strokeColor = "#000"}) => {
  canvasContext.beginPath();
  canvasContext.rect(x, y, width, height);
  canvasContext.fillStyle = fill;
  canvasContext.fill();
  if (strokeWidth) {
    canvasContext.lineWidth = strokeWidth;
    canvasContext.strokeStyle = strokeColor;
    canvasContext.stroke();
  }
};
export const drawCircle = (canvasContext, {x, y, radius, color}) => {
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
  canvasContext.fillStyle = color;
  canvasContext.fill();
};
export const drawText = (canvasContext, {x, y, content, color = "#fff", size = 20, textAlign = "left"}) => {
  canvasContext.font = `${size}px Menlo, Monaco, "Lucida Console", monospace`;
  canvasContext.textAlign = textAlign;
  canvasContext.textBaseline = "middle";
  canvasContext.fillStyle = color;
  canvasContext.fillText(content, x, y);
};
export const drawGameOver = (canvasContext, score) => {
  const canvasMiddleX = canvasContext.canvas.width / 2;
  const canvasMiddleY = canvasContext.canvas.height / 2;
  drawText(canvasContext, {
    x: canvasMiddleX,
    y: canvasMiddleY,
    content: "Game over!",
    size: 100,
    textAlign: "center"
  });
  drawText(canvasContext, {
    x: canvasMiddleX,
    y: canvasMiddleY + 100,
    content: `Score: ${formatNumber(score)}`,
    size: 60,
    textAlign: "center"
  });
};
export const clamp = (min = 0, max = Infinity) => (value) => Math.max(min, Math.min(max, value));
export const lerp = (min = 0, max = 1) => (value) => min * (1 - value) + max * value;
export const nextBallPosition = ({x, y, direction, speed}) => {
  const angle = (direction - 90) / 180 * Math.PI;
  return {
    x: x + speed * Math.cos(angle),
    y: y + speed * Math.sin(angle)
  };
};
export const hasBallTouchedSide = ({x}, screenWidth) => x <= BALL_RADIUS || x >= screenWidth - BALL_RADIUS;
export const hasBallTouchedTop = ({y}) => y <= BALL_RADIUS;
export const hasBallTouchedPaddle = (ball, paddle) => {
  const ballBottom = ball.y + BALL_RADIUS;
  return ballBottom > paddle.y && !hasBallPassedPaddle(ballBottom, paddle) && ball.x >= paddle.x && ball.x <= paddle.x + PADDLE_WIDTH;
};
export const hasBallPassedPaddle = (ballY, paddle) => ballY > paddle.y + PADDLE_HEIGHT;
export const getBrickCollision = (ball, bricks) => {
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    const halfBrickWidth = brick.width / 2;
    const halfBrickHeight = brick.height / 2;
    const distX = Math.abs(ball.x - brick.x - halfBrickWidth);
    const distY = Math.abs(ball.y - brick.y - halfBrickHeight);
    if (distX > halfBrickWidth + ball.radius || distY > halfBrickHeight + ball.radius) {
      continue;
    }
    if (distX <= halfBrickWidth || distY <= halfBrickHeight) {
      return {brickIndex: i, hasCollidedVertically: distY < halfBrickHeight};
    }
    const dx = distX - brick.width / 2;
    const dy = distY - brick.height / 2;
    if (dx * dx + dy * dy <= ball.radius * ball.radius) {
      return {brickIndex: i, hasCollidedVertically: dx > dy};
    }
  }
};
export const brickBuilder = (canvas) => {
  const brickWidth = Math.floor((canvas.width - 2 * BRICKS_MARGIN) / BRICKS_PER_ROW);
  return (col, row) => ({
    x: col * brickWidth + BRICKS_MARGIN,
    y: (BRICK_ROWS - 1 - row) * BRICK_HEIGHT + BRICKS_MARGIN,
    width: brickWidth,
    height: BRICK_HEIGHT,
    color: BRICK_COLOR_PER_ROW[row]
  });
};
export const formatNumber = (score) => new Intl.NumberFormat("en-GB").format(score);
export const centerTopOfPaddle = (paddle) => ({
  x: paddle.x + PADDLE_WIDTH / 2,
  y: paddle.y - BALL_RADIUS
});
