// Colors borrowed from https://tailwindcss.com/docs/customizing-colors#color-palette-reference

import { color } from "./types";

export const TICK_INTERVAL = 1000 / 60; // 60 FPS

// amount of updates for animated objects (max fps for animations)
export const GAME_SPEED = 1000 / 60;

export const PADDLE_BOTTOM_MARGIN = 80;
export const PADDLE_COLOR = "#737373";
export const PADDLE_HEIGHT = 20;
export const PADDLE_WIDTH = 200;

export const BALL_RADIUS = 15;
export const BALL_COLOR = "#FAFAFA";
export const BALL_INITIAL_SPEED = 0;
export const BALL_INITIAL_DIRECTION = 30;
export const BALL_SPEED_INCREASE = 1.015;
export const BALL_SPEED = 6;

export const FAR_LEFT_BOUNCE_DIRECTION = -80;
export const FAR_RIGHT_BOUNCE_DIRECTION = 80;

export const BRICK_ROWS = 6;
export const BRICKS_PER_ROW = 15;
export const BRICK_HEIGHT = 40;
export const BRICKS_MARGIN = 80;
export const BRICK_COLOR_PER_ROW: color[] = [
  "blue",
  "green",
  "yellow",
  "orange",
  "red",
  "pink",
]; // bottom to top
export const BRICK_COLOR_MAP: Record<color, string> = {
  blue: "#06B6D4",
  green: "#22C55E",
  yellow: "#EAB308",
  orange: "#F97316",
  red: "#EF4444",
  pink: "#EC4899",
};
export const BRICK_STROKE_COLOR = "#333";
export const BRICK_SCORE = 10;
