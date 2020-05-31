import { Vector2 } from "./vector";

export class Scene {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  center: Vector2;

  constructor(canvas: Element | string) {
    if (typeof canvas === "string") {
      canvas = document.querySelector(canvas);
    }

    this.canvas = canvas as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.resized = this.resized.bind(this);
    this.resized();

    window.addEventListener("resize", this.resized);
  }

  resized() {
    this.canvas.width = this.width = window.innerWidth;
    this.canvas.height = this.height = window.innerHeight;
    this.center = new Vector2(this.width / 2, this.height / 2);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
