export interface Position {
  x: number
  y: number
}

export interface Rectangle extends Position {
  width: number
  height: number
  color: string
}

export interface Circle extends Position {
  radius: number
  color: string
}

export type Paddle = Position

export interface Ball extends Position {
  direction: number // degrees
  speed: number // px per tick
}

export interface Vector {
  deltaX: number
  deltaY: number
}
