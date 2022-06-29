import { BehaviorSubject } from "rxjs";
import { drawText, formatNumber } from "../shared/utils";

export const createScoreSubject = (score: number): BehaviorSubject<number> =>
  new BehaviorSubject(score);

export const renderScore = (
  canvasContext: CanvasRenderingContext2D,
  score: number
) => {
  drawText(canvasContext, {
    x: 200,
    y: canvasContext.canvas.height - 40,
    content: `Score: ${formatNumber(score)}`,
  });
};
