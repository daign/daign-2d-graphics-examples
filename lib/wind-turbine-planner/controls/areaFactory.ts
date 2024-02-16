import { AreaControl } from './areaControl';
import { AreaControlManager } from './areaControlManager';
import { AreaControlWood } from './areaControlWood';

/**
 * Factory class for creating AreaControls.
 */
export class AreaFactory {
  /**
   * Constructor.
   * @param makeWoodArea - Whether to create a wood area.
   * @param manager - The area control manager to add new areas to.
   */
  public constructor(
    private makeWoodArea: boolean,
    private manager: AreaControlManager
  ) {}

  /**
   * Create a new area control object.
   * @returns The new area control.
   */
  public createArea(): AreaControl {
    let area;

    if ( this.makeWoodArea ) {
      area = new AreaControlWood( this.manager );
    } else {
      area = new AreaControl( this.manager );
    }

    this.manager.addArea( area );

    return area;
  }
}
