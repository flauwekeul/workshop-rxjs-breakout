import { animationFrameScheduler, combineLatest, interval, sampleTime, takeWhile, tap } from 'rxjs'
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
  TICK_INTERVAL,
} from '../shared/settings'
import { Ball, Paddle } from '../shared/types'
import {
  centerTopOfPaddle,
  createCanvas,
  drawGameOver,
  getBrickCollision,
  hasBallPassedPaddle,
  hasBallTouchedPaddle,
  hasBallTouchedSide,
  hasBallTouchedTop,
  lerp,
  nextBallPosition,
} from '../shared/utils'
import { createBallSubject, renderBall } from './ball'
import { createBricksSubject, renderBricks } from './bricks'
import { createLivesSubject, renderLives } from './lives'
import { createPaddleStream, renderPaddle } from './paddle'
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

const ticks$ = interval(TICK_INTERVAL, animationFrameScheduler)
const paddle$ = createPaddleStream(initialPaddle, canvas)
const ball$ = createBallSubject(initialBall, canvas)
const bricks$ = createBricksSubject(canvas)
const lives$ = createLivesSubject(3)
const score$ = createScoreSubject(0)

// returns a function that accepts a normalized value (between 0 and 1) that returns a direction between
// FAR_LEFT_BOUNCE_DIRECTION and FAR_RIGHT_BOUNCE_DIRECTION based on this normalized value
const paddleBounce = lerp(FAR_LEFT_BOUNCE_DIRECTION, FAR_RIGHT_BOUNCE_DIRECTION)

combineLatest({ paddle: paddle$, ball: ball$, ticks: ticks$, bricks: bricks$, score: score$, lives: lives$ })
  .pipe(
    sampleTime(TICK_INTERVAL, animationFrameScheduler),
    tap(({ paddle, ball, bricks, score, lives }) => {
      if (ball.speed === 0) {
        const { x, y } = centerTopOfPaddle(paddle)
        ball.x = x
        ball.y = y
        canvas.classList.remove('hide-cursor')
        return
      }

      canvas.classList.add('hide-cursor')

      if (hasBallPassedPaddle(ball.y, paddle)) {
        lives$.next(lives - 1)
        if (lives > 0) {
          ball$.next(initialBall)
        }
        return
      }

      const brickCollision = getBrickCollision(ball, bricks)
      if (brickCollision) {
        const { brickIndex, hasCollidedVertically } = brickCollision
        ball.direction = ball.direction * -1 + (hasCollidedVertically ? 0 : 180)
        ball.speed *= BALL_SPEED_INCREASE
        const bricksWithoutCollidedBrick = bricks.filter((_, i) => i !== brickIndex)
        bricks$.next(bricksWithoutCollidedBrick)
        score$.next(score + BRICK_SCORE)
      } else if (hasBallTouchedPaddle(ball, paddle)) {
        const normalizedPaddleImpactPosition = (ball.x - paddle.x) / PADDLE_WIDTH
        ball.direction = paddleBounce(normalizedPaddleImpactPosition)
      } else if (hasBallTouchedSide(ball, canvas.width)) {
        ball.direction *= -1
      } else if (hasBallTouchedTop(ball)) {
        ball.direction = ball.direction * -1 + 180
      }

      const { x, y } = nextBallPosition(ball)
      ball.x = x
      ball.y = y
    }),
    tap(({ paddle, ball, bricks, score, lives }) => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)

      renderPaddle(canvasContext, paddle)
      renderBall(canvasContext, ball)
      renderBricks(canvasContext, bricks)
      renderScore(canvasContext, score)
      renderLives(canvasContext, lives)
    }),
    takeWhile(({ lives }) => lives > 0)
  )
  .subscribe({
    complete: () => {
      drawGameOver(canvasContext, score$.getValue())
    },
  })
