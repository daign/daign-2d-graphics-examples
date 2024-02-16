import { Vector2 } from '@daign/math';
import { Group, Line, Polyline, Text, Viewport } from '@daign/2d-graphics';
import { SvgContext } from '@daign/2d-graphics-svg';
import { NativeTranslateTransform } from '@daign/2d-pipeline';

/**
 * Class for the scale bar.
 */
export class ScaleBar extends Group {
  // Position of the scale on the drawing context.
  private scalePosition: NativeTranslateTransform;

  /**
   * Constructor.
   */
  public constructor(
    private svgContext: SvgContext,
    private viewport: Viewport
  ) {
    super();

    // Style Sheet selector.
    this.addClass( 'scale-bar' );

    this.scalePosition = new NativeTranslateTransform();
    this.transformation.push( this.scalePosition );

    this.redraw();
  }

  /**
   * Create the child objects that constitute the graphical element.
   */
  public redraw(): void {
    this.clearChildren();

    // Calculate position of the scale on the drawing context.
    const contextSize = this.svgContext.size.clone();
    this.scalePosition.translation.set( 20, contextSize.y - 15 );

    // Get current scale from viewport.
    const scale = this.viewport.viewScale.x;

    const maxScaleWidth = 200;
    const distance = maxScaleWidth / scale;
    if ( distance >= 1 ) {
      const numberOfDigits = Math.floor( Math.log10( distance ) ) + 1;
      const roundingFactor = Math.pow( 10, 1 - numberOfDigits );
      const roundedBaseValue = Math.floor( ( distance + Number.EPSILON ) * roundingFactor );
      const roundedValue = roundedBaseValue / roundingFactor;
      const scaleSize = roundedValue * scale;

      let endLabel = `${ roundedValue } m`;
      if ( roundedValue > 999 ) {
        endLabel = `${ Math.round( roundedValue / 1000 ) } km`;
      }

      // The line with start and end tick.
      const line = new Polyline();
      line.points.elements = [
        new Vector2( 0, -10 ),
        new Vector2( 0, 0 ),
        new Vector2( scaleSize, 0 ),
        new Vector2( scaleSize, -10 )
      ];
      this.appendChild( line );

      // Small ticks at steps on scale.
      let subScaleDivisions = roundedBaseValue;
      if ( subScaleDivisions === 1 ) {
        subScaleDivisions = 10;
      }
      for ( let i = 1; i < subScaleDivisions; i += 1 ) {
        const subLinePosition = i * scaleSize / subScaleDivisions;
        const subLine = new Line();
        subLine.start = new Vector2( subLinePosition, 0 );
        subLine.end = new Vector2( subLinePosition, -7 );
        this.appendChild( subLine );
      }

      const textZero = new Text();
      textZero.anchor.set( 0, -13 );
      textZero.content = '0';
      textZero.textAnchor = 'middle';
      this.appendChild( textZero );

      const textEnd = new Text();
      textEnd.anchor.set( scaleSize, -13 );
      textEnd.content = endLabel;
      textEnd.textAnchor = 'middle';
      this.appendChild( textEnd );
    }
  }
}
