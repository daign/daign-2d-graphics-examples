import { Mask, Polygon, UseElement } from '@daign/2d-graphics';

import { AreaControl } from './areaControl';
import { AreaControlManager } from './areaControlManager';
import { Tool } from '../types';

/**
 * Polygon area control object with special wood area properties.
 */
export class AreaControlWood extends AreaControl {
  /**
   * Constructor.
   * @param areaManager - The object managing this area.
   */
  public constructor( areaManager: AreaControlManager ) {
    super( areaManager );
  }

  /**
   * The redraw method creates the shape out of basic elements.
   */
  public redraw(): void {
    // Overwriting super methods.
    // Cleanup.
    this.clearChildren();
    this.buttons = [];

    // Generate an id suffix for masks in this class, so that there's no conflict between areas.
    const randomMaskId = Math.floor( Math.random() * ( 10000 + 1 ) );

    // Mask for the remaining area after deforestation.
    const woodMask = new Mask();
    woodMask.id = `woodMask${randomMaskId}`;
    woodMask.addClass( 'woodMask' );
    this.appendChild( woodMask );
    const woodMaskPolygon = new Polygon();
    woodMaskPolygon.points.copyElements( this.points );
    woodMask.appendChild( woodMaskPolygon );
    const woodMaskCutout = new UseElement();
    woodMaskCutout.href = '#deforestationArea';
    woodMaskCutout.addClass( 'woodMaskCutout' );
    woodMask.appendChild( woodMaskCutout );

    // The remaining wood area shape.
    const woodArea = new Polygon();
    woodArea.addClass( 'woodArea' );
    // The coordinates of the polygon are the same as the control points.
    woodArea.points.copyElements( this.points );
    woodArea.mask = `url(#woodMask${randomMaskId})`;
    this.appendChild( woodArea );

    // Mask for the deforestation areas.
    const deforestationMask = new Mask();
    deforestationMask.id = `deforestationMask${randomMaskId}`;
    deforestationMask.addClass( 'deforestationMask' );
    this.appendChild( deforestationMask );
    const deforestationMaskElement = new UseElement();
    deforestationMaskElement.href = '#deforestationArea';
    deforestationMaskElement.addClass( 'woodMaskCutout' );
    deforestationMask.appendChild( deforestationMaskElement );

    // Deforestation areas.
    const deforestationArea = new Polygon();
    deforestationArea.addClass( 'deforestationArea' );
    deforestationArea.points.copyElements( this.points );
    deforestationArea.mask = `url(#deforestationMask${randomMaskId})`;
    this.appendChild( deforestationArea );

    // Mask for only the circle borders.
    const deforestationBorderMask = new Mask();
    deforestationBorderMask.id = `deforestationBorderMask${randomMaskId}`;
    deforestationBorderMask.addClass( 'deforestationBorderMask' );
    this.appendChild( deforestationBorderMask );
    const borderMaskPositive = new UseElement();
    borderMaskPositive.href = '#deforestationArea';
    borderMaskPositive.addClass( 'borderMaskPositive' );
    deforestationBorderMask.appendChild( borderMaskPositive );
    const borderMaskNegative = new UseElement();
    borderMaskNegative.href = '#deforestationArea';
    borderMaskNegative.addClass( 'borderMaskNegative' );
    deforestationBorderMask.appendChild( borderMaskNegative );

    // Deforestation border.
    const deforestationBorder = new Polygon();
    deforestationBorder.addClass( 'deforestationBorder' );
    deforestationBorder.points.copyElements( this.points );
    deforestationBorder.mask = `url(#deforestationBorderMask${randomMaskId})`;
    this.appendChild( deforestationBorder );

    // Dashed area border in deforestation areas. On complete area shape.
    const dashedBorder = new Polygon();
    dashedBorder.addClass( 'dashedBorder' );
    dashedBorder.points.copyElements( this.points );
    this.appendChild( dashedBorder );

    // Display a delete button.
    if ( this.currentTool === Tool.Delete ) {
      this.addDeleteButton();
    }
  }
}
