import { Group } from '@daign/2d-graphics';

import { ToolButton } from './toolButton';

/**
 * Class for the tool bar.
 */
export class ToolBar extends Group {
  private buttons: ToolButton[] = [];

  /**
   * Constructor.
   */
  public constructor() {
    super();

    // Style Sheet selector.
    this.addClass( 'tool-bar' );

    this.redraw();
  }

  /**
   * Draw button.
   * @param buttons - Array of tool buttons.
   */
  public drawButtons( buttons: ToolButton[] ): void {
    this.buttons = buttons;
    this.redraw();
  }

  /**
   * Create the child objects that constitute the graphical element.
   */
  public redraw(): void {
    this.clearChildren();

    this.buttons.forEach( ( button: ToolButton, index: number ): void => {
      button.position.set( 10, 10 + 45 * index );
      button.redraw();
      this.appendChild( button );
    } );
  }
}
