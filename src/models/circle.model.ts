import { Rect } from './rect.model'
import { distanceBetween, Point, Shape, Type } from './shape.model'

export class Circle implements Shape {
  readonly center: Point;
  readonly radius: number;
  readonly type: Type;

  constructor(x: number, y: number, radius: number) {
    this.center = <Point>{ x, y };
    this.type = Type.CIRCLE;
    this.radius = radius;
  }

  collides(other: Shape): boolean {
    switch (other.type) {
      case Type.CIRCLE:
        const _other = <Circle>(<any>other);
        const distance = distanceBetween(this.center, _other.center);

        return distance <= this.radius + _other.radius;
      case Type.RECT:
        const rect: Rect = Rect.fromShape(other);
        const target: Point = rect.center;
        const pointDistance: Point = <Point>{
          x: Math.abs(this.center.x - target.x),
          y: Math.abs(this.center.y - target.y),
        };

        if (pointDistance.x > rect.width / 2 + this.radius) {
          return false;
        } else if (pointDistance.y > rect.height / 2 + this.radius) {
          return false;
        } else if (pointDistance.x <= rect.width / 2) {
          return true;
        } else if (pointDistance.y <= rect.height / 2) {
          return true;
        }

        const circleToRectDistance =
          Math.pow(pointDistance.x - rect.width / 2, 2) +
          Math.pow(pointDistance.y - rect.height / 2, 2);

        return circleToRectDistance <= Math.pow(this.radius, 2);
      default:
        throw new Error(`Invalid shape type!`);
    }
  }

  /**
   * Typecasts a Shape object into this Shape type
   * @param other the Shape object
   * @returns a Circle object
   */
  static fromShape(other: Shape): Circle {
    const polymorph = <any>other;
    if (!polymorph.radius) {
      throw new Error('Shape is invalid! Cannot convert to a Circle');
    }

    return new Circle(polymorph.center.x, polymorph.center.y, polymorph.radius);
  }
}
