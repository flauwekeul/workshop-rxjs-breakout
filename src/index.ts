import { animationFrameScheduler, combineLatest, interval, tap } from 'rxjs'
import { createPaddle, renderPaddle } from './paddle'
import { TICK_INTERVAL } from './settings'

const canvas = document.createElement('canvas')
const canvasContext = canvas.getContext('2d')

document.body.appendChild(canvas)
// set the canvas size in JS instead of CSS to prevent blurry renderings
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ticks$ = interval(TICK_INTERVAL, animationFrameScheduler)
const paddle$ = createPaddle(canvas)

combineLatest({
  ticks: ticks$,
  paddle: paddle$,
})
  .pipe(
    tap(({ paddle }) => {
      // clear previous renders
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      renderPaddle(canvasContext, paddle)
    })
  )
  .subscribe()
