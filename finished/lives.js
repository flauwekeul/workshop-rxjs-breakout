import {BehaviorSubject} from "../snowpack/pkg/rxjs.js";
import {drawText} from "../shared/utils.js";
export const createLivesSubject = (lives) => new BehaviorSubject(lives);
export const renderLives = (canvasContext, lives) => {
  drawText(canvasContext, {x: 40, y: canvasContext.canvas.height - 40, content: `Lives: ${lives}`});
};
