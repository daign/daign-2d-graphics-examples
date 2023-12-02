import { Vector2 } from '@daign/math';
import { Application, Group, UseElement } from '@daign/2d-graphics';

import { RoundedRectangle } from '../basic-elements';
import { ToolManager } from '../gui';

/**
 * Class for a tool button.
 */
export class ToolButton extends Group {
  private _active: boolean = false;

  public position: Vector2 = new Vector2();

  /**
   * Setter for the activation state.
   * @param value - The activation state.
   */
  public set active( value: boolean ) {
    if ( this.activatable ) {
      this._active = value;
      if ( this.rectangle ) {
        this.rectangle.setVariableClass( 'state', value ? 'active' : 'inactive' );
      }
    }
  };

  /**
   * Getter for the activation state.
   * @returns The activation state.
   */
  public get active(): boolean {
    return this._active;
  }

  // The shape of the tool button.
  private rectangle: RoundedRectangle | null = null;

  /**
   * Constructor.
   * @param toolManager - The tool manager.
   * @param activatable - Whether it can be set to active.
   * @param action - The function to call.
   * @param iconName - The icon on the button.
   * @param application - The corresponding application.
   */
  public constructor(
    private toolmanager: ToolManager,
    private activatable: boolean,
    private action: () => void,
    private iconName: string,
    private application: Application
  ) {
    super();

    // Style Sheet selector.
    this.addClass( 'tool-button' );

    this.redraw();
  }

  /**
   * Create the child objects that constitute the graphical element.
   */
  public redraw(): void {
    this.clearChildren();

    // The shape of the tool button.
    this.rectangle = new RoundedRectangle();
    this.rectangle.start = this.position;
    this.rectangle.end = this.position.clone().addScalar( 40 );
    this.rectangle.rx = 10;
    this.rectangle.ry = 10;

    // Assign different classes based on activation state.
    if ( this.activatable ) {
      this.rectangle.setVariableClass( 'state', this.active ? 'active' : 'inactive' );
    }

    // Add a callback function for when the tool is clicked.
    this.rectangle.callback = (): void => {
      this.toolmanager.deactivateAll();
      this.active = true;
      this.action();
      this.application.redraw();
    };

    // Add rectangle to tool button group.
    this.appendChild( this.rectangle );

    // Add icon.
    const useElement = new UseElement();
    useElement.href = this.iconName;
    useElement.anchor = this.position.clone().addScalar( 5 );
    this.appendChild( useElement );
  }
}
