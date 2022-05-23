import { Triangle2, Vector2 } from '@daign/math';
import { ControlObject, TwoPointCircle } from '@daign/2d-graphics';

/**
 * Circle control object with three control points on the circle.
 */
export class ThreePointCircleControl extends ControlObject {
  /**
   * Constructor.
   * @param points - The coordinates on the circle.
   */
  public constructor( points: Vector2[] ) {
    super();

    // Style selector.
    this.baseClass = 'three-point-circle';

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

    // Calculate the circumcenter of the three control points.
    if ( this.points.length >= 3 ) {
      const triangle = new Triangle2(
        this.points.getElement( 0 ),
        this.points.getElement( 1 ),
        this.points.getElement( 2 )
      );
      const center = triangle.getCircumcenter();

      // Set the coordinates to the TwoPointCircle.
      if ( center !== null ) {
        circle.center = center;
        circle.circlePoint = this.points.getElement( 0 )!
      }
    }
  }
}
