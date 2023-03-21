import { animationFrames, map, tap, withLatestFrom } from 'rxjs'
import { createBallSubject, renderBall } from './ball'
import { createBricksSubject, renderBricks } from './bricks'
import {
  BALL_INITIAL_DIRECTION,
  BALL_RADIUS,
  BALL_SPEED_INCREASE,
  FAR_LEFT_BOUNCE_DIRECTION,
  FAR_RIGHT_BOUNCE_DIRECTION,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from './common/settings'
import { Ball, GameState, Paddle } from './common/types'
import {
  centerTopOfPaddle,
  createCanvas,
  createNextBall,
  getBrickCollision,
  hasBallTouchedPaddle,
  hasBallTouchedSide,
  hasBallTouchedTop,
  lerp,
} from './common/utils'
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
const bricks$ = createBricksSubject(canvas)
const lives$ = createLivesSubject(3)
const score$ = createScoreSubject(0)

// returns a function that accepts a normalized value (between 0 and 1) that returns a direction between
// FAR_LEFT_BOUNCE_DIRECTION and FAR_RIGHT_BOUNCE_DIRECTION based on this normalized value
const paddleBounce = lerp(FAR_LEFT_BOUNCE_DIRECTION, FAR_RIGHT_BOUNCE_DIRECTION)

/**
 * This function is responsible for creating the next game state on every tick.
 */
const nextState = (state: GameState): GameState => {
  const { paddle, ball, bricks } = state

  if (ball.speed === 0) {
    canvas.classList.remove('hide-cursor')
    return { ...state, ball: createNextBall(ball, centerTopOfPaddle(paddle)) }
  }

  canvas.classList.add('hide-cursor')

  const brickCollision = getBrickCollision(ball, bricks)
  if (brickCollision) {
    const { brickIndex, hasCollidedVertically } = brickCollision
    const nextBall = createNextBall(ball, {
      direction: ball.direction * -1 + (hasCollidedVertically ? 0 : 180),
      speed: ball.speed * BALL_SPEED_INCREASE,
    })
    const remainingBricks = bricks.filter((_, i) => i !== brickIndex)
    return {
      ...state,
      ball: nextBall,
      bricks: remainingBricks,
    }
  }

  if (hasBallTouchedPaddle(ball, paddle)) {
    const normalizedPaddleImpactPosition = (ball.x - paddle.x) / PADDLE_WIDTH
    const nextBall = createNextBall(ball, { direction: paddleBounce(normalizedPaddleImpactPosition) })
    return { ...state, ball: nextBall }
  }

  if (hasBallTouchedSide(ball, canvas.width)) {
    const nextBall = createNextBall(ball, { direction: ball.direction * -1 })
    return { ...state, ball: nextBall }
  }

  if (hasBallTouchedTop(ball)) {
    const nextBall = createNextBall(ball, { direction: ball.direction * -1 + 180 })
    return { ...state, ball: nextBall }
  }

  return { ...state, ball: createNextBall(ball) }
}

/**
 * This function can be ignored until step 4.
 */
const updateState = ({ paddle, ball, bricks }: GameState): void => {
  paddle$.next(paddle)
  ball$.next(ball)
  bricks$.next(bricks)
}

/**
 * This function is responsible for rendering (using each entity's render
 * function).
 */
const renderState = ({ paddle, ball, bricks }: GameState): void => {
  // clear previous renders
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)

  renderPaddle(canvasContext, paddle)
  renderBall(canvasContext, ball)
  renderBricks(canvasContext, bricks)
}

/**
 * This is the entrypoint of the game. It combines all entity streams into a
 * single stream and pipes it through the three functions above.
 */
const main = (): void => {
  animationFrames()
    .pipe(
      withLatestFrom(paddle$, ball$, bricks$, (_, paddle, ball, bricks) => ({ paddle, ball, bricks } as GameState)),
      map(nextState),
      tap(updateState),
      tap(renderState)
    )
    .subscribe()
}

main()
