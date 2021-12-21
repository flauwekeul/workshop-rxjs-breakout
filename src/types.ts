export interface Position {
  x: number
  y: number
}

export interface Rectangle extends Position {
  width: number
  height: number
}

export interface RenderedRectangle extends Rectangle {
  fill: string
  strokeWidth?: number
  strokeColor?: string
}

export interface Circle extends Position {
  radius: number
}

export interface RenderedCircle extends Circle {
  color: string
}

export type Paddle = Position

export interface Ball extends Circle {
  direction: number // degrees
  speed: number // px per tick
}

export interface Brick extends Rectangle {
  color: color
}

export type color = 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'blue'

export interface BrickCollision {
  brickIndex: number
  hasCollidedVertically: boolean
}
