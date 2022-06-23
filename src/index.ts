import { animationFrameScheduler, combineLatest, interval, sampleTime, tap } from 'rxjs'
import {
  BALL_INITIAL_DIRECTION,
  BALL_RADIUS,
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
  hasBallTouchedPaddle,
  hasBallTouchedSide,
  hasBallTouchedTop,
  lerp,
  nextBallPosition,
} from '../shared/utils'
import { createBallStream, renderBall } from './ball'
import { createBricksStream } from './bricks'
import { createLivesSubject } from './lives'
import { createPaddleStream, renderPaddle } from './paddle'
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

const ticks$ = interval(TICK_INTERVAL, animationFrameScheduler)
const paddle$ = createPaddleStream(initialPaddle, canvas)
const ball$ = createBallStream(initialBall, canvas)
const bricks$ = createBricksStream(canvas)
const lives$ = createLivesSubject(3)
const score$ = createScoreSubject(0)

// returns a function that accepts a normalized value (between 0 and 1) that returns a direction between
// FAR_LEFT_BOUNCE_DIRECTION and FAR_RIGHT_BOUNCE_DIRECTION based on this normalized value
const paddleBounce = lerp(FAR_LEFT_BOUNCE_DIRECTION, FAR_RIGHT_BOUNCE_DIRECTION)

combineLatest({ paddle: paddle$, ball: ball$, ticks: ticks$ })
  .pipe(
    sampleTime(TICK_INTERVAL, animationFrameScheduler),
    tap(({ paddle, ball }) => {
      if (ball.speed === 0) {
        const { x, y } = centerTopOfPaddle(paddle)
        ball.x = x
        ball.y = y
        canvas.classList.remove('hide-cursor')
        return
      }

      canvas.classList.add('hide-cursor')

      if (hasBallTouchedPaddle(ball, paddle)) {
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
    tap(({ paddle, ball }) => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)

      renderPaddle(canvasContext, paddle)
      renderBall(canvasContext, ball)
    })
  )
  .subscribe()
