import { Vector2 } from '@daign/math';
import { Application, ButtonObject, ControlObject, Group, TwoPointCircle,
  UseElement } from '@daign/2d-graphics';

import { Tool } from '../types';

const deforestationRadius = 50;

/**
 * Collection of points for each wind turbine position.
 */
export class WindTurbineControl extends ControlObject {
  private currentTool: Tool = Tool.Edit;

  /**
   * Constructor.
   */
  public constructor(
    private application: Application
  ) {
    super();

    this.addClass( 'wind-turbines' );
  }

  /**
   * Set the current active tool for the turbine control.
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

    // Display a turbine icon for each point.
    this.points.elements.forEach( ( point: Vector2 ): void => {
      const useElement = new UseElement();
      useElement.href = '#turbineGraphic';
      useElement.anchor = point.clone();
      this.appendChild( useElement );
    } );

    // Create a reusable element with circles of deforestation radius around each turbine.
    // The outer group is hidden because the element should not appear unless in use elements.
    const deforestationTemplate = new Group();
    deforestationTemplate.addClass( 'deforestationTemplate' );
    this.appendChild( deforestationTemplate );

    // The inner group that can be referenced and contains the circles.
    const deforestationArea = new Group();
    deforestationArea.id = 'deforestationArea';
    deforestationArea.addClass( 'deforestationArea' );
    deforestationTemplate.appendChild( deforestationArea );
    this.points.elements.forEach( ( point: Vector2 ): void => {
      const circle = new TwoPointCircle();
      circle.center.copy( point );
      circle.circlePoint.copy( point ).add( new Vector2( deforestationRadius, 0 ) );
      deforestationArea.appendChild( circle );
    } );

    // Display a delete button for each turbine.
    if ( this.currentTool === Tool.Delete ) {
      this.points.iterate( ( point: Vector2, index: number ): void => {
        // Callback function.
        const deletionCallback = (): void => {
          this.deletePoint( index );
        };

        const buttonShape = new UseElement();
        buttonShape.href = '#deleteButton';

        const button = new ButtonObject( deletionCallback );
        button.buttonShape = buttonShape;
        button.anchor.copy( point );
        this.buttons.push( button );
      } );
    }
  }

  /**
   * Delete one of the turbines.
   * @param index - The index of the turbine to delete.
   */
  private deletePoint( index: number ): void {
    this.points.remove( index );
    this.redraw();
    this.application.redraw();
  }
}
