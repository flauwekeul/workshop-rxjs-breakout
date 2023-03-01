import { animationFrames, map, takeWhile, tap, withLatestFrom } from 'rxjs'
import {
  BALL_INITIAL_DIRECTION,
  BALL_RADIUS,
  BALL_SPEED_INCREASE,
  BRICK_SCORE,
  FAR_LEFT_BOUNCE_DIRECTION,
  FAR_RIGHT_BOUNCE_DIRECTION,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from '../shared/settings'
import { Ball, GameState, Paddle } from '../shared/types'
import {
  centerTopOfPaddle,
  createCanvas,
  createNextBall,
  drawGameOver,
  getBrickCollision,
  hasBallMissedPaddle,
  hasBallTouchedPaddle,
  hasBallTouchedSide,
  hasBallTouchedTop,
  lerp,
} from '../shared/utils'
import { createBallSubject, renderBall } from './ball'
import { createBricksSubject, renderBricks } from './bricks'
import { createLivesSubject, renderLives } from './lives'
import { createPaddleSubject, renderPaddle } from './paddle'
import { createScoreSubject, renderScore } from './score'

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

const paddle$ = createPaddleSubject(initialPaddle, canvas)
const ball$ = createBallSubject(initialBall, canvas)
const bricks$ = createBricksSubject(canvas)
const lives$ = createLivesSubject(3)
const score$ = createScoreSubject(0)

// returns a function that accepts a normalized value (between 0 and 1) that returns a direction between
// FAR_LEFT_BOUNCE_DIRECTION and FAR_RIGHT_BOUNCE_DIRECTION based on this normalized value
const paddleBounce = lerp(FAR_LEFT_BOUNCE_DIRECTION, FAR_RIGHT_BOUNCE_DIRECTION)

const nextState = (state: GameState): GameState => {
  const { paddle, ball, bricks, lives, score } = state

  if (ball.speed === 0) {
    canvas.classList.remove('hide-cursor')
    return { ...state, ball: createNextBall(ball, centerTopOfPaddle(paddle)) }
  }

  canvas.classList.add('hide-cursor')

  if (hasBallMissedPaddle(ball.y, paddle)) {
    const nextLives = lives - 1
    if (nextLives === 0) {
      return { ...state, lives: nextLives }
    }
    return { ...state, ball: createNextBall(initialBall, centerTopOfPaddle(paddle)), lives: nextLives }
  }

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
      score: score + BRICK_SCORE,
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

const updateState = ({ paddle, ball, bricks, lives, score }: GameState): void => {
  paddle$.next(paddle)
  ball$.next(ball)
  bricks$.next(bricks)
  lives$.next(lives)
  score$.next(score)
}

const renderState = ({ paddle, ball, bricks, lives, score }: GameState): void => {
  // clear previous renders
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)

  renderPaddle(canvasContext, paddle)
  renderBall(canvasContext, ball)
  renderBricks(canvasContext, bricks)
  renderLives(canvasContext, lives)
  renderScore(canvasContext, score)
}

const main = (): void => {
  animationFrames()
    .pipe(
      withLatestFrom(paddle$, ball$, bricks$, lives$, score$, (_, paddle, ball, bricks, lives, score) => ({
        paddle,
        ball,
        bricks,
        lives,
        score,
      })),
      map(nextState),
      tap(updateState),
      tap(renderState),
      takeWhile(({ lives }) => lives > 0)
    )
    .subscribe({
      complete: () => {
        drawGameOver(canvasContext, score$.value)
      },
    })
}

main()
