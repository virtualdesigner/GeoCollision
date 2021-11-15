import { Circle } from './circle.model';
import { Line } from './line.model';
import { Rect } from './rect.model';
import { Point, distanceBetween } from './shape.model';

export class IntersectionDetector {
  static collideCheckCircleWithRect(circle: Circle, rect: Rect): boolean {
    const target: Point = rect.center;
    const pointDistance: Point = <Point>{
      x: Math.abs(circle.center.x - target.x),
      y: Math.abs(circle.center.y - target.y),
    };

    if (pointDistance.x > rect.width / 2 + circle.radius) {
      return false;
    } else if (pointDistance.y > rect.height / 2 + circle.radius) {
      return false;
    } else if (pointDistance.x <= rect.width / 2) {
      return true;
    } else if (pointDistance.y <= rect.height / 2) {
      return true;
    }

    const circleToRectDistance =
      Math.pow(pointDistance.x - rect.width / 2, 2) +
      Math.pow(pointDistance.y - rect.height / 2, 2);

    return circleToRectDistance <= Math.pow(circle.radius, 2);
  }

  public static collideCheckCircleWithLine(
    circle: Circle,
    line: Line,
  ): boolean {
    const { x: x0, y: y0 }: Point = circle.center;
    const {
      center: { x: a1, y: b1 },
      otherEnd: { x: a2, y: b2 },
    } = line;
    const distanceBetweenLineAndCircle =
      Math.abs((a2 - a1) * (b1 - y0) - (a1 - x0) * (b2 - b1)) /
      Math.sqrt(Math.pow(a2 - a1, 2) + Math.pow(b2 - b1, 2));

    return distanceBetweenLineAndCircle <= circle.radius;
  }

  public static collideCheckLineWithLine(
    line: Line,
    anotherLine: Line,
  ): boolean {
    function doIntersect(p1, q1, p2, q2) {
      function onSegment(p, q, r) {
        if (
          q.x <= Math.max(p.x, r.x) &&
          q.x >= Math.min(p.x, r.x) &&
          q.y <= Math.max(p.y, r.y) &&
          q.y >= Math.min(p.y, r.y)
        )
          return true;

        return false;
      }

      function orientation(p, q, r) {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

        if (val == 0) return 0; // collinear

        return val > 0 ? 1 : 2; // clock or counterclock wise
      }

      // Find the four orientations needed for general and
      // special cases
      const o1 = orientation(p1, q1, p2);
      const o2 = orientation(p1, q1, q2);
      const o3 = orientation(p2, q2, p1);
      const o4 = orientation(p2, q2, q1);

      // General case
      if (o1 != o2 && o3 != o4) return true;

      // Special Cases
      // p1, q1 and p2 are collinear and p2 lies on segment p1q1
      if (o1 == 0 && onSegment(p1, p2, q1)) return true;

      // p1, q1 and q2 are collinear and q2 lies on segment p1q1
      if (o2 == 0 && onSegment(p1, q2, q1)) return true;

      // p2, q2 and p1 are collinear and p1 lies on segment p2q2
      if (o3 == 0 && onSegment(p2, p1, q2)) return true;

      // p2, q2 and q1 are collinear and q1 lies on segment p2q2
      if (o4 == 0 && onSegment(p2, q1, q2)) return true;

      return false; // Doesn't fall in any of the above cases
    }
    return doIntersect(
      line.center,
      line.otherEnd,
      anotherLine.center,
      anotherLine.otherEnd,
    );
  }

  public static collideCheckLineWithRect(line: Line, rect: Rect): boolean {
    const {
      center: { x: a1, y: b1 },
      otherEnd: { x: a2, y: b2 },
    } = line;
    // x1 y1 - top left
    // x2 y2 - bottom left
    // x3 y3 - bottom right
    // x4 y4 - top right
    const { x1, y1, x2, y2, x3, y3, x4, y4 } = Rect.getEndPoints(rect);

    // return true if the line intersects with atleast one of the sides of the rectangle (or) if the line stays inside the rectangle
    return (
      this.collideCheckLineWithLine(new Line(x1, y1, x2, y2), line) ||
      this.collideCheckLineWithLine(new Line(x2, y2, x3, y3), line) ||
      this.collideCheckLineWithLine(new Line(x1, y1, x4, y4), line) ||
      this.collideCheckLineWithLine(new Line(x3, y3, x4, y4), line) ||
      (a1 >= x1 && b1 <= y1 && a2 <= x3 && b2 >= y3)
    );
  }

  public static collideCheckCircleWithCircle(
    circle: Circle,
    anotherCircle: Circle,
  ): boolean {
    const distance = distanceBetween(circle.center, anotherCircle.center);

    return distance <= circle.radius + anotherCircle.radius;
  }

  public static collideCheckRectWithRect(
    rect: Rect,
    anotherRect: Rect,
  ): boolean {
    const distance: Point = <Point>{
      x: Math.abs(rect.center.x - anotherRect.center.x),
      y: Math.abs(rect.center.y - anotherRect.center.y),
    };
    if (
      distance.x <= rect.width / 2 + anotherRect.width / 2 ||
      distance.y <= rect.height / 2 + anotherRect.height / 2
    ) {
      return true;
    }
    return false;
  }
}
