import {
  BALL_RADIUS,
  BRICKS_MARGIN,
  BRICK_COLOR_PER_ROW,
  BRICK_HEIGHT,
  BRICK_ROWS,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from '../shared/settings'
import {
  Ball,
  Brick,
  BrickCollision,
  Circle,
  Optional,
  Paddle,
  Position,
  RenderedCircle,
  RenderedRectangle,
  Text,
} from './types'

export const createCanvas = (container = document.body) => {
  const canvas = document.createElement('canvas')
  const canvasContext = canvas.getContext('2d')

  container.appendChild(canvas)
  // set the canvas size in JS instead of CSS to prevent blurry renderings
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  return { canvas, canvasContext }
}

// assumes x and y are both 0 at the top left corner
export const drawRectangle = (
  canvasContext: CanvasRenderingContext2D,
  { x, y, width, height, fill, strokeWidth = 0, strokeColor = '#000' }: RenderedRectangle
): void => {
  // beginPath() is needed to clear any previously drawn paths
  canvasContext.beginPath()
  canvasContext.rect(x, y, width, height)
  canvasContext.fillStyle = fill
  canvasContext.fill()
  if (strokeWidth) {
    canvasContext.lineWidth = strokeWidth
    canvasContext.strokeStyle = strokeColor
    canvasContext.stroke()
  }
}

export const drawCircle = (canvasContext: CanvasRenderingContext2D, { x, y, radius, color }: RenderedCircle): void => {
  // beginPath() is needed to clear any previously drawn paths
  canvasContext.beginPath()
  canvasContext.arc(x, y, radius, 0, 2 * Math.PI)
  canvasContext.fillStyle = color
  canvasContext.fill()
}

export const drawText = (
  canvasContext: CanvasRenderingContext2D,
  { x, y, content, color = '#fff', size = 20, textAlign = 'left' }: Optional<Text, 'color' | 'size' | 'textAlign'>
): void => {
  canvasContext.font = `${size}px Menlo, Monaco, "Lucida Console", monospace`
  canvasContext.textAlign = textAlign
  canvasContext.textBaseline = 'middle'
  canvasContext.fillStyle = color
  canvasContext.fillText(content, x, y)
}

export const drawGameOver = (canvasContext: CanvasRenderingContext2D, score: number) => {
  const canvasMiddleX = canvasContext.canvas.width / 2
  const canvasMiddleY = canvasContext.canvas.height / 2
  drawText(canvasContext, {
    x: canvasMiddleX,
    y: canvasMiddleY,
    content: 'Game over!',
    size: 100,
    textAlign: 'center',
  })
  drawText(canvasContext, {
    x: canvasMiddleX,
    y: canvasMiddleY + 100,
    content: `Score: ${formatNumber(score)}`,
    size: 60,
    textAlign: 'center',
  })
}

export const clamp =
  (min = 0, max = Infinity) =>
  (value: number) =>
    Math.max(min, Math.min(max, value))

export const lerp =
  (min = 0, max = 1) =>
  (value: number) =>
    min * (1 - value) + max * value

export const nextBallPosition = ({ x, y, direction, speed }: Ball): Position => {
  const angle = ((direction - 90) / 180) * Math.PI
  return {
    x: x + speed * Math.cos(angle),
    y: y + speed * Math.sin(angle),
  }
}

export const hasBallTouchedSide = ({ x }: Position, screenWidth: number) =>
  x <= BALL_RADIUS || x >= screenWidth - BALL_RADIUS

export const hasBallTouchedTop = ({ y }: Position) => y <= BALL_RADIUS

export const hasBallTouchedPaddle = (ball: Position, paddle: Position) => {
  const ballBottom = ball.y + BALL_RADIUS
  return (
    // don't use >= because that makes this function return true when the ball first launches resulting in a "wiggle"
    ballBottom > paddle.y &&
    // if the ball passed the paddle bottom, consider it lost
    !hasBallPassedPaddle(ballBottom, paddle) &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + PADDLE_WIDTH
  )
}

export const hasBallPassedPaddle = (ballY: number, paddle: Position) => ballY > paddle.y + PADDLE_HEIGHT

export const getBrickCollision = (ball: Circle, bricks: Brick[]): BrickCollision => {
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i]
    const halfBrickWidth = brick.width / 2
    const halfBrickHeight = brick.height / 2
    const distX = Math.abs(ball.x - brick.x - halfBrickWidth)
    const distY = Math.abs(ball.y - brick.y - halfBrickHeight)

    if (distX > halfBrickWidth + ball.radius || distY > halfBrickHeight + ball.radius) {
      continue
    }

    if (distX <= halfBrickWidth || distY <= halfBrickHeight) {
      return { brickIndex: i, hasCollidedVertically: distY < halfBrickHeight }
    }

    // calculate if the ball hits a brick on a corner
    const dx = distX - brick.width / 2
    const dy = distY - brick.height / 2
    if (dx * dx + dy * dy <= ball.radius * ball.radius) {
      // fixme: `dx > dy` doesn't really work
      return { brickIndex: i, hasCollidedVertically: dx > dy }
    }
  }
}

export const brickBuilder =
  (brickWidth: number) =>
  (col: number, row: number): Brick => ({
    x: col * brickWidth + BRICKS_MARGIN,
    y: (BRICK_ROWS - 1 - row) * BRICK_HEIGHT + BRICKS_MARGIN,
    width: brickWidth,
    height: BRICK_HEIGHT,
    color: BRICK_COLOR_PER_ROW[row],
  })

export const formatNumber = (score) => new Intl.NumberFormat('en-GB').format(score)

export const centerTopOfPaddle = (paddle: Paddle): Position => ({
  x: paddle.x + PADDLE_WIDTH / 2,
  y: paddle.y - BALL_RADIUS,
})
