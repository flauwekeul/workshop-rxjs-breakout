import { animationFrameScheduler, combineLatest, interval, sampleTime, tap } from 'rxjs'
import {
  BALL_INITIAL_DIRECTION,
  BALL_RADIUS,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  TICK_INTERVAL,
} from '../shared/settings'
import { Ball, Paddle } from '../shared/types'
import { centerTopOfPaddle, createCanvas, nextBallPosition } from '../shared/utils'
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

combineLatest({ paddle: paddle$, ball: ball$, ticks: ticks$ })
  .pipe(
    sampleTime(TICK_INTERVAL, animationFrameScheduler),
    tap(({ paddle, ball }) => {
      if (ball.speed > 0) {
        const { x, y } = nextBallPosition(ball)
        ball.x = x
        ball.y = y
        canvas.classList.add('hide-cursor')
      } else {
        const { x, y } = centerTopOfPaddle(paddle)
        ball.x = x
        ball.y = y
        canvas.classList.remove('hide-cursor')
      }

      canvasContext.clearRect(0, 0, canvas.width, canvas.height)

      renderPaddle(canvasContext, paddle)
      renderBall(canvasContext, ball)
    })
  )
  .subscribe()
