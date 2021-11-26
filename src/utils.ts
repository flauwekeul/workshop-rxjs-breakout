import { BALL_RADIUS, PADDLE_HEIGHT, PADDLE_WIDTH } from './settings'
import { Ball, Brick, BrickCollision, Circle, Position, RenderedCircle, RenderedRectangle, Vector } from './types'

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

export const clamp =
  (min = 0, max = Infinity) =>
  (value: number) =>
    Math.max(min, Math.min(max, value))

export const lerp =
  (min = 0, max = 1) =>
  (value: number) =>
    min * (1 - value) + max * value

export const createVector = ({ direction, speed }: Pick<Ball, 'direction' | 'speed'>): Vector => {
  const angle = ((direction - 90) / 180) * Math.PI
  return {
    deltaX: speed * Math.cos(angle),
    deltaY: speed * Math.sin(angle),
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
    ballBottom < paddle.y + PADDLE_HEIGHT &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + PADDLE_WIDTH
  )
}

export const getBrickCollision = (ball: Circle, bricks: Brick[]): BrickCollision => {
  for (let index = 0; index < bricks.length; index++) {
    const brick = bricks[index]
    const halfBrickWidth = brick.width / 2
    const halfBrickHeight = brick.height / 2
    const distX = Math.abs(ball.x - brick.x - halfBrickWidth)
    const distY = Math.abs(ball.y - brick.y - halfBrickHeight)

    if (distX > halfBrickWidth + ball.radius || distY > halfBrickHeight + ball.radius) {
      continue
    }

    if (distX <= halfBrickWidth || distY <= halfBrickHeight) {
      return { index, hasCollidedVertically: distY < halfBrickHeight }
    }

    // calculate if the ball hits a brick on a corner
    const dx = distX - brick.width / 2
    const dy = distY - brick.height / 2
    if (dx * dx + dy * dy <= ball.radius * ball.radius) {
      // fixme: `dx > dy` doesn't really work
      return { index, hasCollidedVertically: dx > dy }
    }
  }
}
