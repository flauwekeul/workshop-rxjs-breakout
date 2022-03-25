import {
  animationFrameScheduler,
  combineLatest,
  filter,
  interval,
  map,
  merge,
  partition,
  sampleTime,
  takeWhile,
  tap,
} from 'rxjs'
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
import { Ball, Entities, Paddle } from '../shared/types'
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

const render = ({ paddle, ball, bricks, lives, score }: Entities): void => {
  // clear previous renders
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)

  renderPaddle(canvasContext, paddle)
  renderBall(canvasContext, ball)
  renderBricks(canvasContext, bricks)
  renderLives(canvasContext, lives)
  renderScore(canvasContext, score)
}

const input$ = combineLatest({
  tick: ticks$,
  paddle: paddle$,
  ball: ball$,
  bricks: bricks$,
  lives: lives$,
  score: score$,
}).pipe(
  // make the stream emit only as fast as TICK_INTERVAL, this prevents mouse movements to make things move faster
  sampleTime(TICK_INTERVAL, animationFrameScheduler)
)

const [whenBallOnPaddle$, whenBallNotOnPaddle$] = partition(input$, ({ ball }) => ball.speed === 0)

const keepBallOnPaddle$ = whenBallOnPaddle$.pipe(
  tap(({ paddle, ball }) => {
    canvas.classList.remove('hide-cursor')
    const { x, y } = centerTopOfPaddle(paddle)
    ball.x = x
    ball.y = y
  })
)

const hideCursor$ = whenBallNotOnPaddle$.pipe(
  tap(() => {
    canvas.classList.add('hide-cursor')
  })
)

const [whenBallPassesPaddle$, whenBallIsAbovePaddle$] = partition(whenBallNotOnPaddle$, ({ ball, paddle }) =>
  hasBallPassedPaddle(ball.y, paddle)
)

const loseLifeAndResetBall$ = whenBallPassesPaddle$.pipe(
  tap(({ lives }) => {
    lives$.next(--lives)
  }),
  filter(({ lives }) => lives > 0),
  tap(() => {
    ball$.next(initialBall)
  })
)

const whenBallCollidesWithBrick$ = whenBallIsAbovePaddle$.pipe(
  map((entities) => ({ ...entities, brickCollision: getBrickCollision(entities.ball, entities.bricks) })),
  filter(({ brickCollision }) => !!brickCollision),
  tap(({ brickCollision, ball, bricks, score }) => {
    const { brickIndex, hasCollidedVertically } = brickCollision
    ball.direction = ball.direction * -1 + (hasCollidedVertically ? 0 : 180)
    ball.speed *= BALL_SPEED_INCREASE
    const bricksWithoutCollidedBrick = bricks.filter((_, i) => i !== brickIndex)
    bricks$.next(bricksWithoutCollidedBrick)
    score$.next(score + BRICK_SCORE)
  })
)

const whenBallTouchesPaddle$ = whenBallIsAbovePaddle$.pipe(
  filter(({ ball, paddle }) => hasBallTouchedPaddle(ball, paddle)),
  tap(({ ball, paddle }) => {
    const normalizedPaddleImpactPosition = (ball.x - paddle.x) / PADDLE_WIDTH
    ball.direction = paddleBounce(normalizedPaddleImpactPosition)
  })
)

const whenBallTouchesSide$ = whenBallIsAbovePaddle$.pipe(
  filter(({ ball }) => hasBallTouchedSide(ball, canvas.width)),
  tap(({ ball }) => {
    ball.direction *= -1
  })
)

const whenBallTouchesTop$ = whenBallIsAbovePaddle$.pipe(
  filter(({ ball }) => hasBallTouchedTop(ball)),
  tap(({ ball }) => {
    ball.direction = ball.direction * -1 + 180
  })
)

const updateBallPosition$ = whenBallIsAbovePaddle$.pipe(
  tap(({ ball }) => {
    const { x, y } = nextBallPosition(ball)
    ball.x = x
    ball.y = y
  })
)

merge(
  keepBallOnPaddle$,
  hideCursor$,
  loseLifeAndResetBall$,
  whenBallCollidesWithBrick$,
  whenBallTouchesPaddle$,
  whenBallTouchesSide$,
  whenBallTouchesTop$,
  updateBallPosition$
)
  .pipe(
    tap(render),
    takeWhile(({ lives }) => lives > 0)
  )
  .subscribe({
    complete: () => {
      drawGameOver(canvasContext, score$.getValue())
    },
  })
