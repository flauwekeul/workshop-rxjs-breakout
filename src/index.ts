import { animationFrameScheduler, combineLatest, interval, sampleTime, tap } from 'rxjs'
import { createBall, renderBall, updateBall } from './ball'
import { centerTopOfPaddle, createPaddle, renderPaddle } from './paddle'
import { PADDLE_BOTTOM_MARGIN, PADDLE_HEIGHT, PADDLE_WIDTH, TICK_INTERVAL } from './settings'
import { Ball, Paddle } from './types'

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
}

const ticks$ = interval(TICK_INTERVAL, animationFrameScheduler)
const paddle$ = createPaddle(initialPaddle, canvas)
const ball$ = createBall(initialBall, canvas)

const updateEntities = ({ paddle, ball }: Entities) => {
  updateBall(ball, paddle, canvas.width)
}

const render = ({ paddle, ball }: Entities) => {
  // clear previous renders
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)
  // beginPath() is needed to clear any previously drawn paths
  canvasContext.beginPath()

  renderPaddle(canvasContext, paddle)
  renderBall(canvasContext, ball)
}

combineLatest({ tick: ticks$, paddle: paddle$, ball: ball$ })
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
}
