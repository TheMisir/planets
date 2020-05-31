import { GameObject } from "./game";

export class Movement extends GameObject {
  readonly movementSpeed: number;
  readonly zoomFactor: number;
  readonly keys: { [key: number]: boolean };

  constructor(movementSpeed: number, zoomFactor: number) {
    super();
    this.movementSpeed = movementSpeed;
    this.zoomFactor = zoomFactor;
    this.keys = new Array(221).fill(false);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  start() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown(event: KeyboardEvent) {
    this.keys[event.keyCode] = true;
  }

  onKeyUp(event: KeyboardEvent) {
    this.keys[event.keyCode] = false;
  }

  update() {
    const shiftKey = this.keys[16];
    const altKey = this.keys[18];
    const multipler = (shiftKey ? 5 : 1) / (altKey ? 5 : 1);

    const zoomSpeed = this.zoomFactor * multipler * this.deltaTime;
    const movementSpeed =
      (this.movementSpeed * multipler * this.deltaTime) / this.camera.zoom;

    /// - or [ or NUM -
    if (this.keys[189] || this.keys[219] || this.keys[109]) {
      this.camera.zoom -= zoomSpeed;
    }

    /// = or ] or NUM +
    if (this.keys[187] || this.keys[221] || this.keys[107]) {
      this.camera.zoom += zoomSpeed;
    }

    /// W or UpArrow
    if (this.keys[87] || this.keys[38]) {
      this.camera.position.y += movementSpeed;
    }

    /// A or LeftArrow
    if (this.keys[65] || this.keys[37]) {
      this.camera.position.x += movementSpeed;
    }

    /// S or DownArrow
    if (this.keys[83] || this.keys[40]) {
      this.camera.position.y -= movementSpeed;
    }

    /// D or RightArrow
    if (this.keys[68] || this.keys[39]) {
      this.camera.position.x -= movementSpeed;
    }
  }
}
