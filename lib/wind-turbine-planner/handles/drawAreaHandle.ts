import { Handle } from '@daign/handle';
import { Application } from '@daign/2d-graphics';
import { Vector2 } from '@daign/math';

import { AreaControl, AreaFactory } from '../controls';

// Minimum distance before a drag is recognised.
const minimumDragDistance = 5;

// Use event coordinate extraction relative to target of mouse event, in this case the drawing area.
const extractFromEvent = ( event: any ): Vector2 => {
  return new Vector2().setFromEventRelative( event );
};

/**
 * Class to manage the Handle used for drawing areas.
 */
export class DrawAreaHandle {
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
   * Create the Handle used for drawing areas.
   * @param domNode - The domNode to register the handle to.
   * @param application - The corresponding application object.
   * @param areaFactory - The factory to create new areas.
   * @returns The handle.
   */
  public constructor( domNode: any, application: Application, areaFactory: AreaFactory ) {
    // The currently selected area.
    let activeArea: AreaControl | null = null;

    // The new point that is currently added to the area.
    let newPoint: Vector2 | null = null;

    // Create the handle.
    const drawAreaHandle = new Handle();
    drawAreaHandle.setStartNode( domNode );
    drawAreaHandle.minimumDragDistance = minimumDragDistance;
    drawAreaHandle.extractFromEvent = extractFromEvent;
    drawAreaHandle.enabled = false;

    // The action to take when mouse is pressed down.
    /* Point will be added to the area when mouse is pressed, and gets updated as long as the mouse
     * is dragged. */
    drawAreaHandle.beginning = (): boolean => {
      // Get the currently selected wire or null.
      const activeObject = application.selectionManager.activeObject;

      if ( activeObject && activeObject instanceof AreaControl ) {
        activeArea = activeObject;
      } else {
        activeArea = areaFactory.createArea();
      }

      // Get the coordinates of the point where the mouse points to.
      newPoint = drawAreaHandle!.start!.clone();
      // Calculate from screen coordinates to world coordinates.
      newPoint.transform( application.drawingLayer.transformation.inverseTransformMatrix );

      // Add point to the control.
      activeArea.points.push( newPoint );
      application.selectionManager.setSelection( activeArea, newPoint );

      // Rerender.
      application.redraw();

      // Continue the drag operation.
      return true;
    };

    // The action to take when the pressed down mouse is moved.
    drawAreaHandle.continuing = (): void => {
      if ( activeArea && newPoint ) {
        // Get the coordinates of the point where the mouse points to.
        const updatedPoint = drawAreaHandle!.temp!.clone();
        // Calculate from screen coordinates to world coordinates.
        updatedPoint.transform( application.drawingLayer.transformation.inverseTransformMatrix );

        // Update new point with position during the drag.
        newPoint.copy( updatedPoint );

        // Rerender.
        application.redraw();
      }
    };

    this.handle = drawAreaHandle;
  }
}
