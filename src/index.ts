import { animationFrameScheduler, combineLatest, interval, sampleTime, tap } from 'rxjs'
import { createBall, renderBall, updateBall } from './ball'
import { createBricks, renderBricks } from './brick'
import { centerTopOfPaddle, createPaddle, renderPaddle } from './paddle'
import { BALL_RADIUS, PADDLE_BOTTOM_MARGIN, PADDLE_HEIGHT, PADDLE_WIDTH, TICK_INTERVAL } from './settings'
import { Ball, Brick, Paddle } from './types'

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
const paddle$ = createPaddle(initialPaddle, canvas)
const ball$ = createBall(initialBall, canvas)
const bricks$ = createBricks(canvas)

const updateEntities = ({ paddle, ball, bricks }: Entities) => {
  updateBall(ball, paddle, canvas.width, bricks)
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
