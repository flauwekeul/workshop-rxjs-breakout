import { combineLatest, tap } from 'rxjs'
import { createBall, renderBall } from './ball'
import { createPaddle, renderPaddle } from './paddle'
import { BALL_RADIUS, PADDLE_BOTTOM_MARGIN, PADDLE_HEIGHT, PADDLE_WIDTH } from './settings'
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
  // actual position is set during rendering
  x: 0,
  y: 0,
  direction: 0,
  speed: 0,
}

// const ticks$ = interval(TICK_INTERVAL, animationFrameScheduler)
const paddle$ = createPaddle(initialPaddle, canvas)
const ball$ = createBall(initialBall)

combineLatest([paddle$, ball$])
  .pipe(
    tap(([paddle, ball]): void => {
      // clear previous renders
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      // beginPath() is needed to clear any previously drawn paths
      canvasContext.beginPath()

      renderPaddle(canvasContext, paddle)

      if (ball.speed === 0) {
        // put ball on the paddle, in the center
        renderBall(canvasContext, {
          x: paddle.x + PADDLE_WIDTH / 2,
          y: paddle.y - BALL_RADIUS,
        })
      }
    })
  )
  .subscribe()
