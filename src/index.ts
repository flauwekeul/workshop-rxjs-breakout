import {
  BALL_INITIAL_DIRECTION,
  BALL_RADIUS,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from '../shared/settings'
import { Ball, GameState, Paddle } from '../shared/types'
import { centerTopOfPaddle, createCanvas } from '../shared/utils'
import { createBallStream } from './ball'
import { createBricksStream } from './bricks'
import { createLivesSubject } from './lives'
import { createPaddleStream } from './paddle'
import { createScoreSubject } from './score'

const { canvas, canvasContext } = createCanvas()

const initialPaddle: Paddle = {
  // position it in the bottom center of the canvas
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_HEIGHT - PADDLE_BOTTOM_MARGIN,
}
const initialBall: Ball = {
  ...centerTopOfPaddle(initialPaddle),
  direction: BALL_INITIAL_DIRECTION,
  speed: 0,
  radius: BALL_RADIUS,
}

const paddle$ = createPaddleStream(initialPaddle, canvas)
const ball$ = createBallStream(initialBall, canvas)
const bricks$ = createBricksStream(canvas)
const lives$ = createLivesSubject(3)
const score$ = createScoreSubject(0)

const nextState = (state: GameState): GameState => state

const updateState = (state: GameState): void => {}

const renderState = (state: GameState): void => {}

const main = (): void => {}

main()
