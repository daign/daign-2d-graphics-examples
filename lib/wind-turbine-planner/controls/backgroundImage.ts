import { Angle, Vector2 } from '@daign/math';
import { NativeRotateTransform, NativeScaleTransform, NativeTranslateTransform } from '@daign/2d-pipeline';
import { ControlObject, Group, TwoPointImage, TwoPointRectangle } from '@daign/2d-graphics';

/**
 * Class for a resizable background image.
 */
export class BackgroundImage extends ControlObject {
  // Base64 Image data string.
  public _imageData: string | null = null;

  /**
   * Setter for imageData.
   * @param value - The image data string.
   */
  public set imageData( value: string ) {
    this._imageData = value;
    this.redraw();
  }

  /**
   * Constructor.
   * @param points - The coordinates of the two control points.
   */
  public constructor( points: Vector2[] ) {
    super();

    // Style Sheet selector.
    this.addClass( 'background-image' );

    this.points.elements = points;
  }

  /**
   * Construct the child elements.
   */
  public redraw(): void {
    super.redraw();

    if ( this.points.length >= 2 && this._imageData ) {
      // Center point of image.
      const centerPoint = this.points.getElement( 0 )!;
      // Point in the center of the upper edge of the image.
      const extensionPoint = this.points.getElement( 1 )!;

      const extensionLine = extensionPoint.clone().sub( centerPoint );
      // Use minimum 1 to avoid scaling of 0.
      const size = Math.max( extensionLine.length(), 1 );
      const scale = new Vector2( size, size );
      // Add 90 degree because angle of vector is calculated relative to x-axis.
      const angle = extensionLine.angle().add( new Angle( Math.PI / 2 ) );

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

      // Add the image element.
      const image = new TwoPointImage();
      image.href = this._imageData;
      image.start = new Vector2( 1, 1 );
      image.end = new Vector2( -1, -1 );
      group.appendChild( image );

      /* Transformations are applied on the group to get the correct position, scale and rotation
       * based on the two control points. */
      const scaleTransform = new NativeScaleTransform();
      scaleTransform.scaling.copy( scale );
      const rotateTransform = new NativeRotateTransform();
      rotateTransform.angle.copy( angle );
      const translateTransform = new NativeTranslateTransform();
      translateTransform.translation.copy( centerPoint );
      group.transformation.push( translateTransform );
      group.transformation.push( rotateTransform );
      group.transformation.push( scaleTransform );
    }
  }
}
