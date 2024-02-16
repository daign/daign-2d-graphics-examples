import { Line2, Polygon2, Vector2 } from '@daign/math';
import { Group, TwoPointRectangle, ScalableText } from '@daign/2d-graphics';

import { WindTurbineControl } from './windTurbineControl';
import { AreaControl } from './areaControl';
import { UnitFormatter } from './unitFormatter';

const deforestationRadius = 50;

/**
 * Show estimation for deforestation area.
 */
export class DeforestationEstimate extends Group {
  /**
   * Constructor.
   */
  public constructor() {
    super();

    this.addClass( 'deforestation-estimate' );
  }

  /**
   * The redraw method creates the shape out of basic elements.
   * @param turbines - The wind turbine control.
   * @param woodAreas - Array of area control objects.
   */
  public redraw( turbines: WindTurbineControl, woodAreas: AreaControl[] ): void {
    this.clearChildren();

    woodAreas.forEach( ( area: AreaControl ): void => {
      // No value when area has less then 3 points.
      if ( area.points.length < 3 ) {
        return;
      }

      const center = area.polygon.getBoxCenter();
      let deforestationAreaEstimateValue = 0;

      // For each turbine.
      turbines.points.iterate( ( point: Vector2 ): void => {
        const estimate = this.estimateCirclePolygonIntersection( point, deforestationRadius,
          area.polygon );
        deforestationAreaEstimateValue += estimate;
      } );

      if ( deforestationAreaEstimateValue > 0 ) {
        const textContent =
          `-${ UnitFormatter.printAreaAdapted( deforestationAreaEstimateValue ) }`;

        const textBox = new TwoPointRectangle();
        const textBoxHeight = 90;
        const textBoxWidth = textBoxHeight * textContent.length * 0.5;
        const textBoxCorner = new Vector2( textBoxWidth, textBoxHeight ).multiplyScalar( 0.5 );
        textBox.start.copy( center ).add( textBoxCorner );
        textBox.end.copy( center ).sub( textBoxCorner );
        this.appendChild( textBox );

        const text = new ScalableText();
        text.anchor.copy( center ).add( new Vector2( 0, 20 ) );
        text.fontSize = 60;
        text.content = textContent;
        text.textAnchor = 'middle';
        this.appendChild( text );
      }
    } );
  }

  /**
   * Estimate point and circle intersection area.
   * @param circleCenter - The circle center.
   * @param circleRadius - The radius of the circle.
   * @param polygon - The polygon.
   */
  private estimateCirclePolygonIntersection(
    circleCenter: Vector2, circleRadius: number, polygon: Polygon2
  ): number {
    const circleArea = circleRadius * circleRadius * Math.PI;
    const centerIsInside = polygon.isPointInside( circleCenter );
    let shortestDistance = Infinity;

    polygon.iterateLineSegments( ( line: Line2 ): void => {
      const nearestPoint = line.getNearestPointOnLineSegment( circleCenter );
      const distance = circleCenter.distanceTo( nearestPoint );
      if ( distance < shortestDistance ) {
        shortestDistance = distance;
      }
    } );

    if ( centerIsInside ) {
      /* If shortest distance is 0, then 50% of circle are inside of polygon. If shortest distance
       * is equal or greater than circleRadius, then 100% of circle are inside of polygon. */
      const factor = Math.min( shortestDistance / circleRadius / 2 + 0.5, 1 );
      return circleArea * factor;
    } else {
      /* If shortest distance is 0, then 50% of circle are inside of polygon. If shortest distance
       * is equal or greater than circleRadius, then 0% of circle are inside of polygon. */
      const factor = Math.max( -shortestDistance / circleRadius / 2 + 0.5, 0 );
      return circleArea * factor;
    }
  }
}
