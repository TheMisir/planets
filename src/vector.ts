export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static get zero() {
    return new Vector2(0, 0);
  }

  static random(dx: number, dy: number) {
    return new Vector2(dx * Math.random(), dy * Math.random());
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  distance(other: Vector2) {
    return this.subtract(other).magnitude();
  }

  add(other: Vector2) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  multiply(other: number) {
    return new Vector2(this.x * other, this.y * other);
  }

  negative() {
    return this.multiply(-1);
  }

  normalize() {
    const mag = this.magnitude();
    return new Vector2(this.x / mag, this.y / mag);
  }

  static angle(rad: number) {
    return new Vector2(Math.cos(rad), Math.sin(rad));
  }

  perpendicularClockwise() {
    return new Vector2(this.y, -this.x);
  }

  perpendicularCounterClockwise() {
    return new Vector2(-this.y, this.x);
  }
}
