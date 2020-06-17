import { Vector2 } from "./vector";
import { Scene } from "./scene";

export class Camera {
  private scene: Scene;
  private m_zoom: number;

  public get zoom() {
    return this.m_zoom;
  }

  public set zoom(value: number) {
    this.m_zoom = Math.max(0.0005, Math.min(100, value));
  }

  public position = new Vector2(0, 0);

  constructor(zoom: number = 1) {
    this.m_zoom = zoom;
  }

  setScene(scene: Scene) {
    this.scene = scene;
  }

  worldToScreen(point: Vector2) {
    return point.add(this.position).multiply(this.zoom).add(this.scene.center);
  }

  inScreen(point: Vector2) {
    return (
      point.x >= 0 &&
      point.x <= this.scene.width &&
      point.y >= 0 &&
      point.y <= this.scene.height
    );
  }

  screenToWorld(point: Vector2) {
    return point
      .subtract(this.scene.center)
      .multiply(1 / this.zoom)
      .subtract(this.position);
  }
}

export class Game {
  private lastTick: number;
  private objects: GameObject[] = [];

  public fixedDeltaTime: number;
  public deltaTime: number;

  public scene: Scene;
  public camera: Camera;

  constructor(scene: Scene, camera: Camera, fixedTicks: number = 60) {
    this.scene = scene;
    this.camera = camera;
    this.fixedDeltaTime = 1 / fixedTicks;

    camera.setScene(scene);
  }

  get children(): Array<GameObject> {
    return this.objects;
  }

  add(object: GameObject) {
    this.objects.push(object);
    object.setGame(this);
  }

  remove(object: GameObject) {
    if (object.dispose) {
      object.dispose();
    }

    this.objects = this.objects.filter((obj) => obj !== object);
  }

  forEach(cb: (object: GameObject) => void, onlyActive = true) {
    let i = 0;

    while (i < this.objects.length) {
      const object = this.objects[i];
      if (!onlyActive || object.active) {
        cb(object);
      }
      i++;
    }
  }

  start() {
    this.lastTick = Date.now();
    this.fixedUpdateAll = this.fixedUpdateAll.bind(this);
    this.render = this.render.bind(this);

    setInterval(this.fixedUpdateAll, this.fixedDeltaTime);

    this.forEach((obj) => {
      if (obj.enabled) {
        obj.start?.apply(obj);
      }
    });

    this.render();
  }

  render() {
    const now = Date.now();
    const delta = now - this.lastTick;

    this.lastTick = now;
    this.deltaTime = delta / 1000;

    this.scene.clear();

    this.forEach((obj) => {
      if (obj.enabled && obj.update) {
        obj.update();
      }

      if (!obj.inScene || obj.inScene(this.camera)) {
        if (obj.render) {
          obj.render(this.scene.ctx);
        }
      }
    });

    requestAnimationFrame(this.render);
  }

  fixedUpdateAll() {
    this.objects.forEach((obj) => {
      if (obj.active && obj.fixedUpdate) {
        obj.fixedUpdate();
      }
    });
  }
}

export class GameObject {
  public active: boolean = true;
  public enabled: boolean = true;
  public game: Game;

  get deltaTime() {
    return this.game.deltaTime;
  }

  get fixedDeltaTime() {
    return this.game.fixedDeltaTime;
  }

  get camera() {
    return this.game.camera;
  }

  get ctx() {
    return this.game.scene.ctx;
  }

  get scene() {
    return this.game.scene;
  }

  setGame(game: Game) {
    this.game = game;
  }

  start?(): void;

  fixedUpdate?(): void;

  update?(): void;

  render?(ctx: CanvasRenderingContext2D): void;

  inScene?(camera: Camera): boolean;

  dispose?(): void;

  remove() {
    this.game.remove(this);
  }
}
