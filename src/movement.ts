import { GameObject } from "./game";
import { Vector2 } from "./vector";

type KeyStateArray = { [key: number]: boolean };
type MouseState = {
  buttons: KeyStateArray;
  position: Vector2;
  downPosition?: Vector2;
  prevPosition: Vector2;
  wheelDelta: number;
};

export class Movement extends GameObject {
  readonly movementSpeed: number;
  readonly zoomFactor: number;
  readonly keys: KeyStateArray;
  readonly mouse: MouseState;

  constructor(movementSpeed: number, zoomFactor: number) {
    super();
    this.movementSpeed = movementSpeed;
    this.zoomFactor = zoomFactor;
    this.keys = new Array(221).fill(false);
    this.mouse = {
      buttons: [false, false],
      position: new Vector2(0, 0),
      prevPosition: new Vector2(0, 0),
      wheelDelta: 0,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  start() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("wheel", this.onWheel);
  }

  onWheel(event: WheelEvent) {
    // @ts-ignore
    this.mouse.wheelDelta = event.wheelDelta;
  }

  onPointerDown(event: PointerEvent) {
    this.mouse.buttons[event.button] = true;
    this.onPointerMove(event);

    if (event.button == 0) {
      this.mouse.downPosition = new Vector2(event.pageX, event.pageY);
    }
  }

  onPointerMove(event: PointerEvent) {
    this.mouse.prevPosition.copyFrom(this.mouse.position);
    this.mouse.position.set(event.pageX, event.pageY);
  }

  onPointerUp(event: PointerEvent) {
    this.mouse.buttons[event.button] = false;
    this.onPointerMove(event);

    if (event.button == 0) {
      this.mouse.downPosition = undefined;
    }
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
    if (
      this.keys[189] ||
      this.keys[219] ||
      this.keys[109] ||
      this.mouse.wheelDelta < 0
    ) {
      this.camera.zoom -= zoomSpeed;
    }

    /// = or ] or NUM +
    if (
      this.keys[187] ||
      this.keys[221] ||
      this.keys[107] ||
      this.mouse.wheelDelta > 0
    ) {
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

    // Dragging
    if (this.mouse.buttons[0]) {
      this.camera.position.addSelf(
        this.mouse.position
          .subtract(this.mouse.prevPosition)
          .multiply(movementSpeed)
      );
    }

    // Reset value
    this.mouse.wheelDelta = 0;
    this.mouse.prevPosition.copyFrom(this.mouse.position);
  }
}
