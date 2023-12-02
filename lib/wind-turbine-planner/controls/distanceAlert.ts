import { Vector2, Line2 } from '@daign/math';
import { Line, Group, TwoPointCircle } from '@daign/2d-graphics';

import { WindTurbineControl } from './windTurbineControl';
import { AreaControl } from './areaControl';

/**
 * Paint distance alerts between turbines, as well as between turbines and restricted areas.
 */
export class DistanceAlert extends Group {
  /**
   * Constructor.
   */
  public constructor() {
    super();

    this.addClass( 'distance-alert' );
  }

  /**
   * The redraw method creates the shape out of basic elements.
   * @param turbines - The wind turbine control.
   * @param restrictedAreas - Array of area control objects.
   */
  public redraw( turbines: WindTurbineControl, restrictedAreas: AreaControl[] ): void {
    this.clearChildren();

    const minimumDistance = 30;

    // For each turbine.
    turbines.points.iterate( ( point1: Vector2, index1: number ): void => {
      // Whether to show a distance alert.
      let isTooNear = false;
      // The distance of the alert case that is currently the shortest distance.
      let currentNearestDistance = Infinity;
      // Point for drawing a line to the cause of the distance alert.
      let collisionPoint: Vector2 | null = null;

      // Test distance to each of the other turbines.
      turbines.points.iterate( ( point2: Vector2, index2: number ): void => {
        if ( index1 !== index2 ) {
          const distance = point1.distanceTo( point2 );
          if ( distance < minimumDistance && distance < currentNearestDistance ) {
            currentNearestDistance = distance;
            isTooNear = true;
            collisionPoint = point2;
          }
        }
      } );

      // Test distance to each of the restricted areas.
      restrictedAreas.forEach( ( area: AreaControl ): void => {
        // Wind turbine is inside of area.
        if ( area.polygon.isPointInside( point1 ) ) {
          currentNearestDistance = 0;
          isTooNear = true;
          // Don't show line to nearest collision when inside of polygon.
          collisionPoint = null;
        } else {
          // Else test for each edge of the area.
          area.polygon.iterateLineSegments( ( line: Line2 ): void => {
            const nearestPoint = line.getNearestPointOnLineSegment( point1 );
            const distance = nearestPoint.distanceTo( point1 );
            if ( distance < minimumDistance && distance < currentNearestDistance ) {
              currentNearestDistance = distance;
              isTooNear = true;
              collisionPoint = nearestPoint;
            }
          } );
        }
      } );

      // Add the graphical elements.
      if ( isTooNear ) {
        // Add a line to the cause of the distance alert.
        if ( collisionPoint ) {
          const line = new Line();
          line.start.copy( point1 );
          line.end.copy( collisionPoint );
          this.appendChild( line );
        }

        // Add a warning area circle around the affected turbine.
        const warnArea1 = new TwoPointCircle();
        warnArea1.center.copy( point1 );
        warnArea1.circlePoint.copy( point1 ).add( new Vector2( minimumDistance, 0 ) );
        this.appendChild( warnArea1 );
      }
    } );
  }
}
