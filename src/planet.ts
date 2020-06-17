import { GameObject, Camera } from "./game";
import { Vector2 } from "./vector";

const G = 100;

export class Planet extends GameObject {
  radius: number;
  mass: number;
  position: Vector2;
  velocity: Vector2;

  get impulse(): Vector2 {
    return this.velocity.multiply(this.mass);
  }

  get volume(): number {
    return 0.75 * Math.PI * this.radius ** 3;
  }

  set volume(value: number) {
    this.radius = Math.pow(value / (0.75 * Math.PI), 1 / 3);
  }

  constructor(
    position: Vector2,
    radius: number,
    mass: number,
    velocity?: Vector2
  ) {
    super();
    this.position = position;
    this.radius = radius;
    this.mass = mass;
    this.velocity = velocity || new Vector2(0, 0);
  }

  private attract(other: Planet) {
    const r = this.position.distance(other.position);

    /// F = G * (m1 * m2) / r^2

    const F = (G * this.mass * other.mass) / r ** 2;

    /// a = F / m
    /// v = a * t

    const a = F / this.mass;
    const v = a * this.fixedDeltaTime;

    const direction = other.position.subtract(this.position);

    this.velocity = this.velocity.add(direction.normalize().multiply(v));
  }

  inside(point: Vector2) {
    return point.distance(this.position) < this.radius;
  }

  fixedUpdate() {
    const planets = this.game.children
      .filter((obj) => obj !== this && "attract" in obj)
      .map((obj) => obj as Planet);

    for (let planet of planets) {
      this.applyCollision(planet);
      this.attract(planet);
    }
  }

  applyCollision(planet: Planet) {
    const direction = planet.position.subtract(this.position);
    const dist = direction.magnitude() - (planet.radius + this.radius);

    if (dist < -Number.EPSILON) {
      if (planet.mass < this.mass) {
        this.volume += planet.volume;
        this.mass += planet.mass;
        
        planet.remove();
      }
    }
  }

  update() {
    this.position = this.position.add(this.velocity.multiply(this.deltaTime));
  }

  render(ctx: CanvasRenderingContext2D) {
    const center = this.camera.worldToScreen(this.position);

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(center.x, center.y, this.radius * this.camera.zoom, 0, Math.PI * 2);
    ctx.fill();

    const fontSize = 0.4 * this.radius * this.camera.zoom;
    if (fontSize > 7) {
      const text = `${Math.round(this.velocity.magnitude() * 10) / 10}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.font = `${fontSize}px Arial`;
      ctx.fillText(text, center.x, center.y);
    }

    const vp = this.camera.worldToScreen(this.position.add(this.velocity));
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = Math.min(5, this.camera.zoom * 100);
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(vp.x, vp.y);
    ctx.stroke();
  }

  inScene(camera: Camera) {
    return camera.inScreen(camera.worldToScreen(this.position));
  }
}
