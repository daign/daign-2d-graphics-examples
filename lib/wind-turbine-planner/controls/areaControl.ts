import { ButtonObject, ControlObject, Polygon, UseElement } from '@daign/2d-graphics';
import { Polygon2 } from '@daign/math';

import { AreaControlManager } from './areaControlManager';
import { Tool } from '../types';

/**
 * Polygon area control object with control points for each point of the polygon.
 */
export class AreaControl extends ControlObject {
  protected currentTool: Tool = Tool.Edit;

  public polygon: Polygon2 = new Polygon2();

  private subscriptionRemover: () => void;

  /**
   * Constructor.
   * @param areaManager - The object managing this area.
   */
  public constructor(
    protected areaManager: AreaControlManager
  ) {
    super();

    this.addClass( 'area' );

    this.updatePolygon();

    // Update the mathematical polygon object whenever the points of the area control change.
    this.subscriptionRemover = this.points.subscribeToChanges( (): void => {
      this.updatePolygon();
      this.areaManager.sendChangeNotification();
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
      this.addDeleteButton();
    }
  }

  /**
   * Add a delete button.
   */
  protected addDeleteButton(): void {
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

  /**
   * Update the polygon object for mathematical calculations.
   */
  private updatePolygon(): void {
    this.polygon.elements = this.points.elements
  }

  /**
   * Remove subscriptions from this object.
   */
  public removeSubscriptions(): void {
    this.subscriptionRemover();
  }
}
