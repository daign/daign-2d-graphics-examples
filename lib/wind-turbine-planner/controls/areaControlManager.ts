import { Application, Group } from '@daign/2d-graphics';

import { AreaControl } from './areaControl';
import { Tool } from '../types';

/**
 * Manager for area control objects.
 */
export class AreaControlManager {
  public areas: AreaControl[] = [];
  private layer: Group | null = null;

  /**
   * Constructor.
   * @param application - The corresponding application.
   */
  public constructor( private application: Application ) {}

  /**
   * Set the group object that is the layer containing the areas in the graphic.
   * @param layer - The layer group object.
   */
  public setLayer( layer: Group ): void {
    this.layer = layer;
  }

  /**
   * Add an area control object.
   * @param area - The area to add.
   */
  public addArea( area: AreaControl ): void {
    this.areas.push( area );
    if ( this.layer ) {
      this.layer.appendChild( area );
    }

    area.setManager( this );
  }

  /**
   * Remove an area control object.
   * @param area - The area control to remove.
   */
  public removeArea( area: AreaControl ): void {
    const index = this.areas.indexOf( area );
    if ( index !== -1 ) {
      this.areas.splice( index, 1 );
    }
    if ( this.layer ) {
      this.layer.removeChild( area );
    }

    this.application.selectionManager.setSelection( null, null );
    this.application.redraw();
  }

  /**
   * Set the current tool to all areas.
   * @param tool - The current tool.
   */
  public setTool( tool: Tool ): void {
    this.areas.forEach( ( area: AreaControl ): void => {
      area.setTool( tool );
    } );
  }
}
