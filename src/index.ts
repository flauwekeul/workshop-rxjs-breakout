import { animationFrameScheduler, combineLatest, interval, sampleTime, tap } from 'rxjs'
import { createBallStream, renderBall } from './ball'
import { createBricksSubject, renderBricks } from './brick'
import { centerTopOfPaddle, createPaddleStream, renderPaddle } from './paddle'
import {
  BALL_RADIUS,
  BALL_SPEED_INCREASE,
  FAR_LEFT_BOUNCE_DIRECTION,
  FAR_RIGHT_BOUNCE_DIRECTION,
  PADDLE_BOTTOM_MARGIN,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  TICK_INTERVAL,
} from './settings'
import { Ball, Brick, Paddle } from './types'
import {
  getBrickCollision,
  hasBallTouchedPaddle,
  hasBallTouchedSide,
  hasBallTouchedTop,
  lerp,
  nextBallPosition,
} from './utils'

const canvas = document.createElement('canvas')
const canvasContext = canvas.getContext('2d')

document.body.appendChild(canvas)
// set the canvas size in JS instead of CSS to prevent blurry renderings
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const initialPaddle: Paddle = {
  // position it in the bottom center of the canvas
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_HEIGHT - PADDLE_BOTTOM_MARGIN,
}
const initialBall: Ball = {
  ...centerTopOfPaddle(initialPaddle),
  direction: 30,
  speed: 0,
  radius: BALL_RADIUS,
}

const ticks$ = interval(TICK_INTERVAL, animationFrameScheduler)
const paddle$ = createPaddleStream(initialPaddle, canvas)
const ball$ = createBallStream(initialBall, canvas)
const bricks$ = createBricksSubject(canvas)

// returns a function that accepts a normalized value (between 0 and 1) that returns a direction between
// FAR_LEFT_BOUNCE_DIRECTION and FAR_RIGHT_BOUNCE_DIRECTION based on this normalized value
const paddleBounce = lerp(FAR_LEFT_BOUNCE_DIRECTION, FAR_RIGHT_BOUNCE_DIRECTION)

const updateEntities = ({ paddle, ball, bricks }: Entities): Entities => {
  if (ball.speed === 0) {
    const { x, y } = centerTopOfPaddle(paddle)
    ball.x = x
    ball.y = y
    return
  }

  // fixme: improve performance!
  const brickCollision = getBrickCollision(ball, bricks)
  if (brickCollision) {
    const { brickIndex, hasCollidedVertically } = brickCollision
    ball.direction = ball.direction * -1 + (hasCollidedVertically ? 0 : 180)
    // todo: show ball speed on screen?
    ball.speed *= BALL_SPEED_INCREASE
    const bricksWithoutCollidedBrick = bricks.filter((_, i) => i !== brickIndex)
    bricks$.next(bricksWithoutCollidedBrick)
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
}

const render = ({ paddle, ball, bricks }: Entities) => {
  // clear previous renders
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)

  renderPaddle(canvasContext, paddle)
  renderBall(canvasContext, ball)
  renderBricks(canvasContext, bricks)
}

combineLatest({ tick: ticks$, paddle: paddle$, ball: ball$, bricks: bricks$ })
  .pipe(
    // make the stream emit only as fast as TICK_INTERVAL, this prevents mouse movements to make things move faster
    sampleTime(TICK_INTERVAL, animationFrameScheduler),
    tap(updateEntities),
    tap(render)
  )
  .subscribe()

interface Entities {
  tick: number
  paddle: Paddle
  ball: Ball
  bricks: Brick[]
}
