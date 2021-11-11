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
