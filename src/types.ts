export interface Position {
  x: number
  y: number
}

export interface Rectangle extends Position {
  width: number
  height: number
  color: string
}
