import { Vector2 } from '@daign/math';
import { ControlObject, Polyline } from '@daign/2d-graphics';

/**
 * Polyline control object with control points for each point of the line.
 */
export class PolylineControl extends ControlObject {
  /**
   * Constructor.
   * @param points - The coordinates of the polyline.
   */
  public constructor( points: Vector2[] ) {
    super();

    // Every vector in this array will be a control point for the shape.
    this.points.elements = points;
  }

  /**
   * The redraw method creates the shape out of basic elements.
   */
  public redraw(): void {
    super.redraw();

    // In this case a single Polyline object is enough to draw the shape.
    const polyline = new Polyline();
    this.appendChild( polyline );

    // The coordinates of the polyline are the same as the control points.
    polyline.points.copyElements( this.points );
  }
}
