import { Ball, Circle, Rectangle, Vector } from './types'

// assumes x and y are both 0 at the top left corner
export const drawRectangle = (
  canvasContext: CanvasRenderingContext2D,
  { x, y, width, height, color }: Rectangle
): void => {
  canvasContext.fillStyle = color
  canvasContext.fillRect(x, y, width, height)
}

export const drawCircle = (canvasContext: CanvasRenderingContext2D, { x, y, radius, color }: Circle): void => {
  canvasContext.arc(x, y, radius, 0, 2 * Math.PI)
  canvasContext.fillStyle = color
  canvasContext.fill()
}

export const clamp =
  (min = 0, max = Infinity) =>
  (value: number) =>
    Math.max(min, Math.min(max, value))

export const createVector = ({ direction, speed }: Pick<Ball, 'direction' | 'speed'>): Vector => {
  const angle = ((direction - 90) / 180) * Math.PI
  return {
    deltaX: speed * Math.cos(angle),
    deltaY: speed * Math.sin(angle),
  }
}
