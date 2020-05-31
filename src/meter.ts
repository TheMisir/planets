import { GameObject } from "./game";

export class FPSMeter extends GameObject {
  render(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = "start";
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`${Math.round(1 / this.deltaTime)} FPS`, 100, 100);
  }
}
