import {BehaviorSubject} from "../snowpack/pkg/rxjs.js";
import {drawText, formatNumber} from "../shared/utils.js";
export const createScoreSubject = (score) => new BehaviorSubject(score);
export const renderScore = (canvasContext, score) => {
  drawText(canvasContext, {x: 200, y: canvasContext.canvas.height - 40, content: `Score: ${formatNumber(score)}`});
};
