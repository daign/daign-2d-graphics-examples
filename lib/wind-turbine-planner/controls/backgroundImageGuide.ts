import { Line2, Vector2 } from '@daign/math';
import { ControlObject, Group, IControlGuide, Line, ScalableText, StyledGraphicNode,
  TwoPointRectangle } from '@daign/2d-graphics';

import { BackgroundImage } from './backgroundImage';
import { Tool } from '../types';
import { UnitFormatter } from './unitFormatter';

/**
 * Control guide for drawing a line between the scale points of the background image scale tool.
 */
export class BackgroundImageGuide implements IControlGuide {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Create the shapes that make up the control guide.
   * @param activeObject - The currently active control object.
   */
  public redraw( activeObject: ControlObject ): StyledGraphicNode | null {
    const backgroundImage = activeObject as BackgroundImage;

    /* Only show line when scale points are locked, there are at least four control points on the
     * image, and the current tool is the scale tool. */
    if (
      backgroundImage.currentTool === Tool.Scale &&
      backgroundImage.points.length >= 4
    ) {
      /* The transformation that converts from the coordinate system of the control object to view
       * coordinates. */
      const transformation = backgroundImage.presentationNodes[ 0 ].projectNodeToView;

      // The scale points.
      const start = backgroundImage.points.getElement( 2 )!;
      const end = backgroundImage.points.getElement( 3 )!;
      const distance = start.distanceTo( end );
      const center = new Line2( start.clone(), end.clone() ).getCenter();

      // Transformed to view coordinates.
      const startTransformed = start.clone().transform( transformation );
      const endTransformed = end.clone().transform( transformation );
      const centerTransformed = center.clone().transform( transformation );

      const group = new Group();
      group.addClass( 'scale-distance' );

      const line = new Line();
      line.start = startTransformed;
      line.end = endTransformed;
      group.appendChild( line );

      const textContent = UnitFormatter.printLengthAdapted( distance );
      const textBox = new TwoPointRectangle();
      const textBoxHeight = 24;
      const textBoxWidth = textBoxHeight * textContent.length * 0.5;
      const textBoxCorner = new Vector2( textBoxWidth, textBoxHeight ).multiplyScalar( 0.5 );
      textBox.start.copy( centerTransformed ).add( textBoxCorner );
      textBox.end.copy( centerTransformed ).sub( textBoxCorner );
      group.appendChild( textBox );

      const text = new ScalableText();
      text.anchor.copy( centerTransformed ).add( new Vector2( 0, 5.5 ) );
      text.fontSize = 16;
      text.content = textContent;
      text.textAnchor = 'middle';
      group.appendChild( text );

      return group;
    } else {
      return null;
    }
  }
}
