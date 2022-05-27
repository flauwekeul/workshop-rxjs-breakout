import { combineLatest, of, tap } from 'rxjs'
import { Entities } from '../shared/types'
import { createCanvas } from '../shared/utils'
import { createBallStream, renderBall } from './ball'
import { createBricksStream, renderBricks } from './bricks'
import { createLivesSubject, renderLives } from './lives'
import { createPaddleStream, renderPaddle } from './paddle'
import { createScoreSubject, renderScore } from './score'

const { canvas, canvasContext } = createCanvas()

const ticks$ = of()
const paddle$ = createPaddleStream()
const ball$ = createBallStream()
const bricks$ = createBricksStream()
const lives$ = createLivesSubject()
const score$ = createScoreSubject()

const updateEntities = ({ paddle, ball, bricks, lives, score }: Entities): void => {}

const render = ({ paddle, ball, bricks, lives, score }: Entities): void => {
  // clear previous renders
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)

  renderPaddle()
  renderBall()
  renderBricks()
  renderLives()
  renderScore()
}

combineLatest({ tick: ticks$, paddle: paddle$, ball: ball$, bricks: bricks$, lives: lives$, score: score$ })
  .pipe(tap(updateEntities), tap(render))
  .subscribe()
