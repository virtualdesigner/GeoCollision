import { Circle } from './circle.model';
import { IntersectionDetector } from './intersectionDetector.model';
import { Line } from './line.model';
import { Point, Shape, Type } from './shape.model';

export class Rect implements Shape {
  readonly center: Point;
  readonly width: number;
  readonly height: number;
  readonly type: Type;

  constructor(x: number, y: number, width: number, height: number) {
    this.center = <Point>{ x, y };
    this.type = Type.RECT;
    this.width = width;
    this.height = height;
  }

  collides(other: Shape): boolean {
    switch (other.type) {
      case Type.CIRCLE:
        const circle: Circle = Circle.fromShape(other);
        return IntersectionDetector.collideCheckCircleWithRect(circle, this);
      case Type.RECT:
        const _other = <Rect>(<any>other);
        return IntersectionDetector.collideCheckRectWithRect(this, _other);
      case Type.LINE:
        const line: Line = Line.fromShape(other);
        return IntersectionDetector.collideCheckLineWithRect(line, this);
      default:
        throw new Error(`Invalid shape type!`);
    }
  }

  /**
   * Typecasts a Shape object into this Shape type
   * @param other the Shape object
   * @returns a Rect object
   */
  static fromShape(other: Shape): Rect {
    const polymorph = <any>other;
    if (!polymorph.width || !polymorph.height) {
      throw new Error('Shape is invalid! Cannot convert to a Rectangle');
    }

    return new Rect(
      polymorph.center.x,
      polymorph.center.y,
      polymorph.width,
      polymorph.height,
    );
  }

  static getEndPoints(rect: Rect): any {
    return {
      x1: rect.center.x - rect.width / 2,
      y1: rect.center.y + rect.height / 2,
      x2: rect.center.x - rect.width / 2,
      y2: rect.center.y - rect.height / 2,
      x3: rect.center.x + rect.width / 2,
      y3: rect.center.y - rect.height / 2,
      x4: rect.center.x + rect.width / 2,
      y4: rect.center.y + rect.height / 2,
    };
  }
}
