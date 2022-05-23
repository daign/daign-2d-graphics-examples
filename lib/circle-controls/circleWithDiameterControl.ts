import { Vector2 } from '@daign/math';
import { ControlObject, TwoPointCircle } from '@daign/2d-graphics';

/**
 * Circle control object with two control points for the diameter.
 */
export class CircleWithDiameterControl extends ControlObject {
  /**
   * Constructor.
   * @param points - The coordinates of the diameter.
   */
  public constructor( points: Vector2[] ) {
    super();

    // Style selector.
    this.baseClass = 'circle-with-diameter';

    // Every vector in this array will be a control point for the shape.
    this.points.elements = points;
  }

  /**
   * The redraw method creates the shape out of basic elements.
   */
  public redraw(): void {
    super.redraw();

    // In this case a single TwoPointCircle object is enough to draw the shape.
    const circle = new TwoPointCircle();
    this.appendChild( circle );

    // Calculate the center from the two points of the diameter.
    if ( this.points.length >= 2 ) {
      const point1 = this.points.getElement( 0 );
      const point2 = this.points.getElement( 1 );
      const center = point1!.clone().add( point2! ).multiplyScalar( 0.5 );

      // Set the coordinates to the TwoPointCircle.
      circle.center = center;
      circle.circlePoint = point1!;
    }
  }
}
