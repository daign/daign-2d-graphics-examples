import { Vector2 } from '@daign/math';
import { MatrixTransform } from '@daign/2d-pipeline';
import {
  Application, ApplicationView, ControlModifierChain, FollowAlongModifier, OrthogonalModifier,
  RoundingModifier, ScalableText
} from '@daign/2d-graphics';
import { SvgContext, SvgRenderer, RendererFactory } from '@daign/2d-graphics-svg';

import { PolylineControl } from './polylineControl';
import { styleSheet } from './drawing.style';

export class ControlModifiersExample {
  private svgContext: SvgContext;
  private application: Application;
  private view: ApplicationView;
  private renderer: SvgRenderer;

  /**
   * The constructor.
   */
  public constructor() {
    // Create the SVG context, set the size and append it to the document body.
    this.svgContext = new SvgContext();
    this.svgContext.size = new Vector2( 800, 600 );
    document.body.appendChild( this.svgContext.domNode );

    // Create the application.
    // This is just a group containing the drawing layer and the layer for control points.
    // Set second parameter true for an interactive application with panning and zooming.
    this.application = new Application( this.svgContext, true );

    // Create the view.
    this.view = new ApplicationView( this.application );

    // Create the SVG renderer and set the style sheet.
    const rendererFactory = new RendererFactory();
    this.renderer = rendererFactory.createRenderer( styleSheet );
    this.renderer.useNativeTransforms = true;
    this.renderer.flattenGroups = true;
    this.renderer.useInlineStyles = true;

    this.constructGraphic();
    this.drawGraphic();

    // Subscribe to render signal.
    this.application.updateManager.setRenderFunction( (): void => {
      this.drawGraphic();
    } );
  }

  /**
   * Construct all elements of the graphic.
   */
  private constructGraphic(): void {
    // If the graphic has to be reconstructed it is important to clear the drawing layer first.
    this.application.drawingLayer.clearChildren();

    // Create some points.
    const generatePoints = (): Vector2[] => {
      return [
        new Vector2( 2, 12 ),
        new Vector2( 2, 8 ),
        new Vector2( 0, 8 ),
        new Vector2( 8, 0 ),
        new Vector2( 11, 3 ),
        new Vector2( 11, 0 ),
        new Vector2( 13, 0 ),
        new Vector2( 13, 5 ),
        new Vector2( 16, 8 ),
        new Vector2( 14, 8 ),
        new Vector2( 14, 12 ),
        new Vector2( 9, 12 ),
        new Vector2( 9, 9 ),
        new Vector2( 7, 9 ),
        new Vector2( 7, 12 ),
        new Vector2( 4, 12 )
      ]
    };

    // Default polyline.
    const polyline1 = new PolylineControl( generatePoints() );
    this.application.drawingLayer.appendChild( polyline1 );

    // Polyline with follow-along-modifier.
    const polyline2 = new PolylineControl( generatePoints() );
    polyline2.controlModifier = new FollowAlongModifier();

    const matrixTransform = new MatrixTransform();
    matrixTransform.matrix.applyTranslation( new Vector2( 20, 0 ) );
    polyline2.transformation.push( matrixTransform );
    this.application.drawingLayer.appendChild( polyline2 );

    // Polyline with orthogonal- and follow-along-modifier.
    const polyline3 = new PolylineControl( generatePoints() );
    const modifierChain = new ControlModifierChain();
    modifierChain.addModifier( new OrthogonalModifier() );
    modifierChain.addModifier( new FollowAlongModifier() );
    polyline3.controlModifier = modifierChain;

    const matrixTransform2 = new MatrixTransform();
    matrixTransform2.matrix.applyTranslation( new Vector2( 0, 18 ) );
    polyline3.transformation.push( matrixTransform2 );
    this.application.drawingLayer.appendChild( polyline3 );

    // Polyline with rounding/grid modifier.
    const polyline4 = new PolylineControl( generatePoints() );
    polyline4.controlModifier = new RoundingModifier( 0 );

    const matrixTransform3 = new MatrixTransform();
    matrixTransform3.matrix.applyTranslation( new Vector2( 20, 18 ) );
    polyline4.transformation.push( matrixTransform3 );
    this.application.drawingLayer.appendChild( polyline4 );

    // Add text objects.

    const text1 = new ScalableText();
    text1.anchor = new Vector2( 8, 15 );
    text1.fontSize = 1.5;
    text1.content = 'no modifier';
    text1.textAnchor = 'middle';
    this.application.drawingLayer.appendChild( text1 );

    const text2 = new ScalableText();
    text2.anchor = new Vector2( 28, 15 );
    text2.fontSize = 1.5;
    text2.content = 'follow along';
    text2.textAnchor = 'middle';
    this.application.drawingLayer.appendChild( text2 );

    const text3 = new ScalableText();
    text3.anchor = new Vector2( 8, 33 );
    text3.fontSize = 1.5;
    text3.content = 'orthogonal';
    text3.textAnchor = 'middle';
    this.application.drawingLayer.appendChild( text3 );

    const text4 = new ScalableText();
    text4.anchor = new Vector2( 28, 33 );
    text4.fontSize = 1.5;
    text4.content = 'grid';
    text4.textAnchor = 'middle';
    this.application.drawingLayer.appendChild( text4 );

    // Set zooming and panning to fit the content plus margin.
    this.application.fitToContent( 2 );

    // Define which part of the document we want to view. In this case the whole application.
    this.view.mountNode( this.application );
  }

  /**
   * Render the view into the context node.
   */
  private drawGraphic(): void {
    this.renderer.render( this.view, this.svgContext.contentNode );
  }
}
