import { Vector2 } from '@daign/math';
import { Application, Group, UseElement } from '@daign/2d-graphics';
import { NativeScaleTransform, NativeTranslateTransform } from '@daign/2d-pipeline';

import { RoundedRectangle } from '../basic-elements';

/**
 * Class for a menu button.
 */
export class MenuButton extends Group {
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
   * @param activatable - Whether it can be set to active.
   * @param action - The function to call.
   * @param iconName - The icon on the button.
   * @param application - The corresponding application.
   * @param mainButton - Whether the button is on the main menu.
   */
  public constructor(
    private activatable: boolean,
    private action: () => void,
    private iconName: string,
    private application: Application | null,
    private mainButton: boolean = false
  ) {
    super();

    // Style Sheet selector.
    this.addClass( 'menu-button' );

    this.redraw();
  }

  /**
   * Create the child objects that constitute the graphical element.
   */
  public redraw(): void {
    this.clearChildren();

    const cornerRadius = this.mainButton ? 30 : 20;
    const rectangleSize = this.mainButton ? 60 : 40;
    const usePosition = this.mainButton ? 7.5 : 5;
    const useScale = this.mainButton ? 1.5 : 1;

    // The shape of the tool button.
    this.rectangle = new RoundedRectangle();
    this.rectangle.start = this.position;
    this.rectangle.end = this.position.clone().addScalar( rectangleSize );
    this.rectangle.rx = cornerRadius;
    this.rectangle.ry = cornerRadius;

    // Assign different classes based on activation state.
    if ( this.activatable ) {
      this.rectangle.setVariableClass( 'state', this.active ? 'active' : 'inactive' );
    }

    // Add a callback function for when the tool is clicked.
    this.rectangle.onclick = (): void => {
      this.action();
      this.active = true;
      if ( this.application ) {
        this.application.redraw();
      }
    };

    // Add rectangle to tool button group.
    this.appendChild( this.rectangle );

    // Add icon.
    const useElement = new UseElement();
    useElement.href = this.iconName;

    const scaleTransform = new NativeScaleTransform();
    scaleTransform.scaling.set( useScale, useScale );
    const translateTransform = new NativeTranslateTransform();
    translateTransform.translation.copy( this.position ).addScalar( usePosition );
    useElement.transformation.push( translateTransform );
    useElement.transformation.push( scaleTransform );

    this.appendChild( useElement );
  }
}
