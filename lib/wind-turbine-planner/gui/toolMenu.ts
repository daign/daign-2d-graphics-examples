import { Group } from '@daign/2d-graphics';

import { MenuButton } from './menuButton';

/**
 * Class for the tool menu.
 */
export class ToolMenu extends Group {
  private buttons: MenuButton[] = [];

  /**
   * Constructor.
   */
  public constructor() {
    super();

    // Style Sheet selector.
    this.addClass( 'tool-menu' );

    this.redraw();
  }

  /**
   * Set array of buttons and redraw.
   * @param buttons - Array of menu buttons.
   */
  public drawButtons( buttons: MenuButton[] ): void {
    this.buttons = buttons;
    this.redraw();
  }

  /**
   * Create the child objects that constitute the graphical element.
   */
  public redraw(): void {
    this.clearChildren();

    this.buttons.forEach( ( button: MenuButton, index: number ): void => {
      button.position.set( 85, 10 + 45 * index );
      button.redraw();
      this.appendChild( button );
    } );
  }
}
