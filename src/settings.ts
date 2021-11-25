// Colors borrowed from https://tailwindcss.com/docs/customizing-colors#color-palette-reference

import { color } from './types'

export const TICK_INTERVAL = 1000 / 60 // 60 FPS

export const PADDLE_BOTTOM_MARGIN = 80
export const PADDLE_COLOR = '#737373'
export const PADDLE_HEIGHT = 20
export const PADDLE_WIDTH = 200

export const BALL_RADIUS = 15
export const BALL_COLOR = '#FAFAFA'
export const BALL_INITIAL_SPEED = 8

export const FAR_LEFT_BOUNCE_DIRECTION = -85
export const FAR_RIGHT_BOUNCE_DIRECTION = 85

export const BRICK_ROWS = 6
export const BRICKS_PER_ROW = 15
export const BRICK_HEIGHT = 40
export const BRICKS_MARGIN = 80
export const BRICK_COLOR_PER_ROW: color[] = ['blue', 'green', 'yellow', 'orange', 'red', 'pink'] // bottom to top
export const BRICK_COLOR_MAP: Record<color, string> = {
  blue: '#06B6D4',
  green: '#22C55E',
  yellow: '#EAB308',
  orange: '#F97316',
  red: '#EF4444',
  pink: '#EC4899',
}
