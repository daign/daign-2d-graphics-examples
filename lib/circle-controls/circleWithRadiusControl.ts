import { Vector2 } from '@daign/math';
import { ControlObject, TwoPointCircle } from '@daign/2d-graphics';

/**
 * Circle control object with control points for center and radius.
 */
export class CircleWithRadiusControl extends ControlObject {
  /**
   * Constructor.
   * @param center - The coordinates of the center.
   * @param circlePoint - The coordinates of a point on the circle.
   */
  public constructor( center: Vector2, circlePoint: Vector2 ) {
    super();

    // Style selector.
    this.baseClass = 'circle-with-radius';

    // Every vector in this array will be a control point for the shape.
    this.points.elements = [ center, circlePoint ];
  }

  /**
   * The redraw method creates the shape out of basic elements.
   */
  public redraw(): void {
    super.redraw();

    // In this case a single TwoPointCircle object is enough to draw the shape.
    const circle = new TwoPointCircle();
    this.appendChild( circle );

    // Set the first point to the center of the TwoPointCircle.
    const center = this.points.getElement( 0 );
    if ( center !== undefined ) {
      circle.center = center;
    }

    // Set the second point to the circle point of the TwoPointCircle.
    const circlePoint = this.points.getElement( 1 );
    if ( circlePoint !== undefined ) {
      circle.circlePoint = circlePoint;
    }
  }
}
