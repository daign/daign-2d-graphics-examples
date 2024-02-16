import { Line2, Vector2 } from '@daign/math';
import { ControlObject, IControlModifier } from '@daign/2d-graphics';

/**
 * Class for the BackgroundImage control point modifier.
 */
export class BackgroundImageModifier implements IControlModifier {
  // Variable to temporarily disable the control modifier.
  public enabled: boolean = true;

  // Whether the control points to set the scale have their positions on the image locked.
  public scalePointsLocked: boolean = false;

  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Modify the position change that has been requested for a control object.
   * @param updatedPoints - The array of updated points.
   * @param pointIndex - The index of the point that initiated the change.
   * @param controlObject - The corresponding control object.
   * @returns The modified array of points.
   */
  public modifyPoints(
    updatedPoints: Vector2[],
    pointIndex: number,
    controlObject: ControlObject
  ): Vector2[] {
    if ( !this.enabled ) {
      return updatedPoints;
    }

    // Movement restrictions. When the possible movement of a point is restricted by other points.

    // The first point can move freely.

    /* The second point can only move vertically to the first point. Also not below the first point
     * and with a minimum distance above. */
    if ( pointIndex === 1 ) {
      const extensionPoint = updatedPoints[1];
      const centerPoint = updatedPoints[0];

      // Compute extensionPoint position after restriction.
      const alignedPoint = extensionPoint.clone().setX( centerPoint.x );
      const minimumDistance = 10;
      const yValue = Math.min( extensionPoint.y, centerPoint.y - minimumDistance );
      alignedPoint.setY( yValue );

      // Set computed position to extension point.
      extensionPoint.copy( alignedPoint );
    }

    // The scale points cannot change the angle between them when they are locked.
    if ( pointIndex > 1 && this.scalePointsLocked ) {
      const scale1 = controlObject.points.getElement( 2 )!;
      const scale2 = controlObject.points.getElement( 3 )!;
      const line = new Line2( scale1.clone(), scale2.clone() );

      // Projected the moved point onto the line between the initial scale points.
      const scalePointProjected = updatedPoints[ pointIndex ].projectOnLine( line );
      updatedPoints[ pointIndex ] = scalePointProjected;
    }

    // Movement dependencies. When moving a point changes other points.

    // When the center point is modified, then the extension point moves along.
    if ( pointIndex === 0 ) {
      const pointBefore = controlObject.points.getElement( 0 )!;
      const pointAfter = updatedPoints[ 0 ];
      // Difference between old and new position.
      const diff = pointAfter.clone().sub( pointBefore );

      updatedPoints[ 1 ].add( diff );
    }

    // If center or extension point are moved, then transform the scale points.
    if ( pointIndex < 2 ) {
      const scale1Transformed = this.transformPointRelative(
        controlObject.points.getElement( 2 )!,
        controlObject.points.getElement( 0 )!,
        controlObject.points.getElement( 1 )!,
        updatedPoints[ 0 ],
        updatedPoints[ 1 ]
      );
      const scale2Transformed = this.transformPointRelative(
        controlObject.points.getElement( 3 )!,
        controlObject.points.getElement( 0 )!,
        controlObject.points.getElement( 1 )!,
        updatedPoints[ 0 ],
        updatedPoints[ 1 ]
      );
      updatedPoints[ 2 ] = scale1Transformed;
      updatedPoints[ 3 ] = scale2Transformed;
    }

    /* If the scale points are locked, then moving them will manipulate the center and extension
     * point, while keeping the relative position of the scale points on the image. */
    if ( pointIndex > 1 && this.scalePointsLocked ) {
      const centerTransformed = this.transformPointRelative(
        controlObject.points.getElement( 0 )!,
        controlObject.points.getElement( 2 )!,
        controlObject.points.getElement( 3 )!,
        updatedPoints[ 2 ],
        updatedPoints[ 3 ]
      );
      const extensionPointTransformed = this.transformPointRelative(
        controlObject.points.getElement( 1 )!,
        controlObject.points.getElement( 2 )!,
        controlObject.points.getElement( 3 )!,
        updatedPoints[ 2 ],
        updatedPoints[ 3 ]
      );
      updatedPoints[ 0 ] = centerTransformed;
      updatedPoints[ 1 ] = extensionPointTransformed;
    }

    return updatedPoints;
  }

  /**
   * Transform a point relative to a coordinate system defined by two points that change position.
   * @param point - The point to transform.
   * @param refA0 - The first reference point, initial position.
   * @param refB0 - The second reference point, initial position.
   * @param refA1 - The first reference point, final position.
   * @param refB1 - The second reference point, final position.
   * @returns The transformed point.
   */
  private transformPointRelative(
    point: Vector2, refA0: Vector2, refB0: Vector2, refA1: Vector2, refB1: Vector2
  ): Vector2 {
    // Coordinate system created by vector from refA to refB and an orthogonal vector.
    // The point refA functions as the origin of the coordinate system.
    const v0 = refB0.clone().sub( refA0 );
    const v1 = refB1.clone().sub( refA1 );
    const o0 = v0.perpendicular();
    const o1 = v1.perpendicular();

    // Normalize.
    const v0n = v0.clone().normalize();
    const v1n = v1.clone().normalize();
    const o0n = o0.clone().normalize();
    const o1n = o1.clone().normalize();

    // Scale factor during transformation.
    const scale = v1.length() / v0.length();

    // The support vector that is going to be decomposed into the axes of the coordinate system.
    const support = point.clone().sub( refA0 );

    // Dot products. These are the factors for both components.
    const dotV = support.dot( v0n );
    const dotO = support.dot( o0n );

    /* Calculate components after movement by applying the previous factors and scale on the new
     * coordinate axes. */
    const componentV = v1n.clone().multiplyScalar( dotV * scale );
    const componentO = o1n.clone().multiplyScalar( dotO * scale );

    // Add both components onto the point which functions as the coordinate system origin.
    const transformedPoint = refA1.clone().add( componentV ).add( componentO );
    return transformedPoint;
  }
}
