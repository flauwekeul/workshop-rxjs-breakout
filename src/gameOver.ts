import { drawText } from "../shared/utils";

export const renderGameOver = (
  canvasContext: CanvasRenderingContext2D,
  lives: number
) => {
  if (lives === 0) {
    drawText(canvasContext, {
      x: canvasContext.canvas.width * 0.5,
      y: canvasContext.canvas.height * 0.5,
      content: `GAME OVER`,
      textAlign: "center",
      size: 80,
    });
  }
};
