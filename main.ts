import { Vector2 } from "./src/vector";
import { Game, Camera, GameObject } from "./src/game";
import { Scene } from "./src/scene";
import { FPSMeter } from "./src/meter";

const G = 50;

class Planet extends GameObject {
  radius: number;
  mass: number;
  position: Vector2;
  velocity: Vector2;

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
    const F = (G * this.mass * other.mass) / r ** 2;

    /// F = m * a
    /// a = F / m

    const a = F / this.mass;

    /// a = v / t
    /// v = a * t

    /// Limit velocity to 100 units
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
      planet.attract(this);
    }
  }

  applyCollision() {
    const planets = this.game.children
      .filter((obj) => obj !== this && obj instanceof Planet)
      .map((obj) => obj as Planet);

    for (let planet of planets) {
      if (planet.mass < this.mass) {
        const direction = planet.position.subtract(this.position);
        const dist = direction.magnitude() - (planet.radius + this.radius);

        if (dist < 0) {
          const v = direction.normalize().multiply(-dist);
          planet.position = planet.position.add(v);
        }
      }
    }
  }

  update() {
    this.position = this.position.add(this.velocity.multiply(this.deltaTime));
    this.applyCollision();
  }

  render(ctx: CanvasRenderingContext2D) {
    const center = this.camera.worldToScreen(this.position);

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.arc(center.x, center.y, this.radius * this.camera.zoom, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = `${15 * this.camera.zoom}px Arial`;
    ctx.fillText(
      `${Math.round(this.velocity.magnitude() * 100) / 100}`,
      center.x,
      center.y
    );

    const vp = this.camera.worldToScreen(this.position.add(this.velocity));
    ctx.strokeStyle = "rgba(255,0,0,.5)";
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(vp.x, vp.y);
    ctx.stroke();
  }

  inScene(camera: Camera) {
    return camera.inScreen(camera.worldToScreen(this.position));
  }
}

function randomBetween(min: number, max: number) {
  return min + (max - min) * Math.random();
}

const scene = new Scene("#canvas");
const camera = new Camera(0.003);
const game = new Game(scene, camera);

scene.ctx.imageSmoothingEnabled = false;

game.add(new FPSMeter());

const galaxySize = 1000000;
const planetCount = 300;
const planetRadius = () => randomBetween(50, 500);
const planetMass = () => randomBetween(50, 500) * 100000;

for (let i = 0; i < planetCount; i++) {
  game.add(
    new Planet(
      new Vector2(
        randomBetween(-galaxySize, galaxySize),
        randomBetween(-galaxySize, galaxySize)
      ),
      planetRadius(),
      planetMass()
    )
  );
}

game.start();

document.onkeypress = (event) => {
  switch (event.key) {
    case "q":
      camera.zoom /= 1.2;
      break;
    case "e":
      camera.zoom *= 1.2;
      break;
    case "w":
      camera.position.y += 5 / camera.zoom;
      break;
    case "a":
      camera.position.x -= 5 / camera.zoom;
      break;
    case "s":
      camera.position.y -= 5 / camera.zoom;
      break;
    case "d":
      camera.position.x += 5 / camera.zoom;
      break;
  }
};

let downAt: number;

document.onmousedown = (event) => {
  downAt = Date.now();
};

document.onmouseup = (event) => {
  const radius = Math.max(20, Math.min(500, (Date.now() - downAt) / 10));

  game.add(
    new Planet(
      camera.screenToWorld(new Vector2(event.pageX, event.pageY)),
      radius,
      radius * 10000
    )
  );
};
