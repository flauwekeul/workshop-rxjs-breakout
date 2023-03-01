import { BehaviorSubject } from 'rxjs'
import { drawText } from '../shared/utils'

export const createLivesSubject = (lives: number) => {
  return new BehaviorSubject(lives)
}

export const renderLives = (canvasContext: CanvasRenderingContext2D, lives: number): void => {
  drawText(canvasContext, { x: 40, y: canvasContext.canvas.height - 40, content: `Lives: ${lives}` })
}
