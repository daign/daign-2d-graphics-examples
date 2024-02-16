import { Vector2 } from '@daign/math';
import { NativeScaleTransform, NativeTranslateTransform } from '@daign/2d-pipeline';
import { Application, ButtonObject, ControlObject, FixedRadiusCircle, Group, TwoPointImage,
  TwoPointRectangle, UseElement } from '@daign/2d-graphics';

import { BackgroundImageModifier } from './backgroundImageModifier';
import { BackgroundImageGuide } from './backgroundImageGuide';
import { Tool } from '../types';

/**
 * Class for a resizable background image.
 */
export class BackgroundImage extends ControlObject {
  private application: Application;
  public currentTool: Tool = Tool.Edit;

  // Base64 Image data string.
  private _imageData: string | null = null;

  // Use element href reference.
  private _useReference: string | null = null;

  // Whether the control points to set the scale have their positions on the image locked.
  public scalePointsLocked: boolean = false;

  private backgroundImageModifier: BackgroundImageModifier;

  /**
   * Setter for imageData.
   * @param value - The image data string.
   */
  public set imageData( value: string ) {
    this._imageData = value;
    this._useReference = null;
    this.redraw();
  }

  /**
   * Setter for useReference.
   * @param value - The image data string.
   */
  public set useReference( value: string ) {
    this._useReference = value;
    this._imageData = null;
    this.redraw();
  }

  /**
   * Constructor.
   * @param application - The corresponding application.
   * @param points - The coordinates of the two control points.
   */
  public constructor( application: Application, points: Vector2[] ) {
    super();

    // Style Sheet selector.
    this.addClass( 'background-image' );

    this.application = application;
    this.points.elements = points;

    this.backgroundImageModifier = new BackgroundImageModifier();
    this.controlModifier = this.backgroundImageModifier;
    this.controlGuides.push( new BackgroundImageGuide() );

    this.setControlShapes();
  }

  /**
   * Set the current active tool for the background image.
   * @param tool - The tool to set.
   */
  public setTool( tool: Tool ): void {
    this.currentTool = tool;

    // Set control shapes.
    this.setControlShapes();

    this.redraw();
  }

  /**
   * Set the control shapes array that defines which handles are displayed and how.
   */
  private setControlShapes(): void {
    if ( this.currentTool === Tool.Scale ) {
      // When scale tool is active the last two points are shown with custom shapes.
      const targetShape1 = new FixedRadiusCircle();
      targetShape1.radius = 15;
      targetShape1.addClass( 'scale-pin' );
      const targetShape2 = new FixedRadiusCircle();
      targetShape2.radius = 15;
      targetShape2.addClass( 'scale-pin' );

      this.controlPointShapes = [ null, null, targetShape1, targetShape2 ];
    } else {
      // Else show the first two control points with default shape.
      this.controlPointShapes = [ undefined, undefined, null, null ] as any;
    }
  }

  /**
   * Construct the child elements.
   */
  public redraw(): void {
    super.redraw();

    if ( this.points.length >= 2 && ( this._imageData || this._useReference ) ) {
      // Center point of image.
      const centerPoint = this.points.getElement( 0 )!;
      // Point in the center of the upper edge of the image.
      const extensionPoint = this.points.getElement( 1 )!;

      const extensionLine = extensionPoint.clone().sub( centerPoint );
      // Use minimum 1 to avoid scaling of 0.
      const size = Math.max( extensionLine.length(), 1 );
      const scale = new Vector2( size, size );

      // Group with image and frame.
      const group = new Group();
      this.appendChild( group );

      // Add the rectangle frame.
      const frame = new TwoPointRectangle();
      /* Both frame and image are created with default dimensions around the center of the
       * coordinate system. The real scaling is happening with transformations. */
      frame.start = new Vector2( 1, 1 );
      frame.end = new Vector2( -1, -1 );
      group.appendChild( frame );

      if ( this._imageData ) {
        // Add the image element.
        const image = new TwoPointImage();
        image.href = this._imageData;
        image.start = new Vector2( 1, 1 );
        image.end = new Vector2( -1, -1 );
        group.appendChild( image );
      } else if ( this._useReference ) {
        // Add the use element.
        const useElement = new UseElement();
        useElement.href = this._useReference;
        const useScaling = new NativeScaleTransform();
        useScaling.scaling.set( 2 / 800, 2 / 800 );
        const useTranslation = new NativeTranslateTransform();
        useTranslation.translation.set( -400, -300 );
        useElement.transformation.push( useScaling );
        useElement.transformation.push( useTranslation );
        group.appendChild( useElement );
      }

      /* Transformations are applied on the group to get the correct position and scale based on the
       * two control points. */
      const scaleTransform = new NativeScaleTransform();
      scaleTransform.scaling.copy( scale );
      const translateTransform = new NativeTranslateTransform();
      translateTransform.translation.copy( centerPoint );
      group.transformation.push( translateTransform );
      group.transformation.push( scaleTransform );

      // Add the lock button for the scale tool.
      if ( this.currentTool === Tool.Scale ) {
        // Callback function.
        const lockCallback = (): void => {
          // Switch state.
          this.scalePointsLocked = !this.scalePointsLocked;

          // And set the modifier.
          this.backgroundImageModifier.scalePointsLocked = this.scalePointsLocked;
          this.redraw();

          this.application.redraw();
        };

        // Displayed shape.
        const lockButton = new UseElement();
        lockButton.href = this.scalePointsLocked ? '#lockClosedButton' : '#lockOpenButton';

        // Button object.
        const button = new ButtonObject( lockCallback );
        button.buttonShape = lockButton;
        const buttonAnchor = centerPoint.clone();
        button.anchor.copy( buttonAnchor );
        this.buttons.push( button );
      }
    }

  }
}
