import { BehaviorSubject } from 'rxjs'
import { drawText, formatNumber } from './common/utils'

export const createScoreSubject = (score: number) => {
  return new BehaviorSubject(score)
}

export const renderScore = (canvasContext: CanvasRenderingContext2D, score: number): void => {
  drawText(canvasContext, { x: 200, y: canvasContext.canvas.height - 40, content: `Score: ${formatNumber(score)}` })
}
