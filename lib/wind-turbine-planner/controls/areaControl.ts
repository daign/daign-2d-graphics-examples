import { ButtonObject, ControlObject, Polygon, UseElement } from '@daign/2d-graphics';
import { Polygon2 } from '@daign/math';

import { AreaControlManager } from './areaControlManager';
import { Tool } from '../types';

/**
 * Polygon area control object with control points for each point of the polygon.
 */
export class AreaControl extends ControlObject {
  private currentTool: Tool = Tool.Edit;
  private areaManager: AreaControlManager | null = null;

  public polygon: Polygon2 = new Polygon2();

  /**
   * Constructor.
   */
  public constructor() {
    super();

    this.addClass( 'area' );

    this.updatePolygon();

    // Update the mathematical polygon object whenever the points of the area control change.
    this.points.subscribeToChanges( (): void => {
      this.updatePolygon();
    } );
  }

  /**
   * Set the current active tool for the area control.
   * @param tool - The tool to set.
   */
  public setTool( tool: Tool ): void {
    this.currentTool = tool;
    this.redraw();
  }

  /**
   * Set the manager which is managing this area.
   * @param manager - The manager to set.
   */
  public setManager( manager: AreaControlManager ): void {
    this.areaManager = manager;
  }

  /**
   * The redraw method creates the shape out of basic elements.
   */
  public redraw(): void {
    super.redraw();

    // In this case a single Polygon object is enough to draw the shape.
    const polygon = new Polygon();
    this.appendChild( polygon );

    // The coordinates of the polygon are the same as the control points.
    polygon.points.copyElements( this.points );

    // Display a delete button.
    if ( this.currentTool === Tool.Delete ) {
      // Callback function.
      const deletionCallback = (): void => {
        if ( this.areaManager ) {
          this.areaManager.removeArea( this );
        }
      };

      const buttonShape = new UseElement();
      buttonShape.href = '#deleteButton';

      const button = new ButtonObject( deletionCallback );
      button.buttonShape = buttonShape;
      button.anchor.copy( this.polygon.getBoxCenter() );
      this.buttons.push( button );
    }
  }

  /**
   * Update the polygon object for mathematical calculations.
   */
  private updatePolygon(): void {
    this.polygon.elements = this.points.elements
  }
}
