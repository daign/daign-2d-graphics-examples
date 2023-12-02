import { Handle } from '@daign/handle';
import { Application } from '@daign/2d-graphics';
import { Vector2 } from '@daign/math';

import { WindTurbineControl } from '../controls';

// Minimum distance before a drag is recognised.
const minimumDragDistance = 5;

// Use event coordinate extraction relative to target of mouse event, in this case the drawing area.
const extractFromEvent = ( event: any ): Vector2 => {
  return new Vector2().setFromEventRelative( event );
};

/**
 * Class to manage the Handle used for drawing wind turbines.
 */
export class DrawTurbineHandle {
  // Always works on the only wind turbine control.
  private currentControl: WindTurbineControl;

  // The contained Handle object.
  private handle: Handle;

  /**
   * Modify the enabled state of the contained handle.
   * @param value - The enabled state to set.
   */
  public set enabled( value: boolean ) {
    this.handle.enabled = value;
  }

  /**
   * Return the enabled state of the contained handle.
   * @returns The enabled state.
   */
  public get enabled(): boolean {
    return this.handle.enabled;
  }

  /**
   * Create the Handle used for drawing wind turbines.
   * @param domNode - The domNode to register the handle to.
   * @param application - The corresponding application object.
   * @param control - The control object to add new points to.
   * @returns The handle.
   */
  public constructor( domNode: any, application: Application, control: WindTurbineControl ) {
    this.currentControl = control;

    // The new point that is currently added to the area.
    let newPoint: Vector2 | null = null;

    // Create the handle.
    const drawHandle = new Handle();
    drawHandle.setStartNode( domNode );
    drawHandle.minimumDragDistance = minimumDragDistance;
    drawHandle.extractFromEvent = extractFromEvent;
    drawHandle.enabled = false;

    /* The action to take when mouse is pressed down. Point will be added to the control when mouse
     * is pressed, and gets updated as long as the mouse is dragged. */
    drawHandle.beginning = (): boolean => {
      // Get the coordinates of the point where the mouse points to.
      newPoint = drawHandle!.start!.clone();
      // Calculate from screen coordinates to world coordinates.
      newPoint.transform( application.drawingLayer.transformation.inverseTransformMatrix );

      // Add point to the control.
      this.currentControl.points.push( newPoint );
      application.selectionManager.setSelection( this.currentControl, newPoint );

      // Rerender.
      application.redraw();

      // Continue the drag operation.
      return true;
    };

    // The action to take when the pressed down mouse is moved.
    drawHandle.continuing = (): void => {
      if ( newPoint ) {
        // Get the coordinates of the point where the mouse points to.
        const updatedPoint = drawHandle!.temp!.clone();
        // Calculate from screen coordinates to world coordinates.
        updatedPoint.transform( application.drawingLayer.transformation.inverseTransformMatrix );

        // Update new point with position during the drag.
        newPoint.copy( updatedPoint );

        // Rerender.
        application.redraw();
      }
    };

    this.handle = drawHandle;
  }
}
