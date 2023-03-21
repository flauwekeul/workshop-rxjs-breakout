import { animationFrames, map, tap, withLatestFrom } from 'rxjs'
import { createBallSubject, renderBall } from './ball'
import { createBricksStream } from './bricks'
import {
  BALL_INITIAL_DIRECTION,
  BALL_RADIUS,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from './common/settings'
import { Ball, GameState, Paddle } from './common/types'
import { centerTopOfPaddle, createCanvas, createNextBall } from './common/utils'
import { createLivesSubject } from './lives'
import { createPaddleSubject, renderPaddle } from './paddle'
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

/**
 * Observables for all entities are created here.
 * Combine these in `main()` to get a single observable of `GameState`.
 */
const paddle$ = createPaddleSubject(initialPaddle, canvas)
const ball$ = createBallSubject(initialBall, canvas)
const bricks$ = createBricksStream(canvas)
const lives$ = createLivesSubject(3)
const score$ = createScoreSubject(0)

/**
 * This function is responsible for creating the next game state on every tick.
 */
const nextState = (state: GameState): GameState => {
  const { paddle, ball } = state

  if (ball.speed === 0) {
    canvas.classList.remove('hide-cursor')
    return { ...state, ball: createNextBall(ball, centerTopOfPaddle(paddle)) }
  }

  canvas.classList.add('hide-cursor')

  return { ...state, ball: createNextBall(ball) }
}

/**
 * This function can be ignored until step 4.
 */
const updateState = ({ paddle, ball }: GameState): void => {
  paddle$.next(paddle)
  ball$.next(ball)
}

/**
 * This function is responsible for rendering (using each entity's render
 * function).
 */
const renderState = ({ paddle, ball }: GameState): void => {
  // clear previous renders
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)

  renderPaddle(canvasContext, paddle)
  renderBall(canvasContext, ball)
}

/**
 * This is the entrypoint of the game. It combines all entity streams into a
 * single stream and pipes it through the three functions above.
 */
const main = (): void => {
  animationFrames()
    .pipe(
      withLatestFrom(paddle$, ball$, (_, paddle, ball) => ({ paddle, ball } as GameState)),
      map(nextState),
      tap(updateState),
      tap(renderState)
    )
    .subscribe()
}

main()