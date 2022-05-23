import { Vector2 } from '@daign/math';
import { Application, ApplicationView, ScalableText } from '@daign/2d-graphics';
import { SvgContext, SvgRenderer, RendererFactory } from '@daign/2d-graphics-svg';

import { PolylineControl } from './polylineControl';
import { styleSheet } from './drawing.style';

export class BasicExample {
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

    this.constructGraphic();
    this.drawGraphic();

    // Redraw the graphic when there are changes in the drawing layer.
    this.application.drawingLayer.redrawObservable.subscribeToChanges( (): void => {
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
    const points = [
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
    ];

    // Create a polyline from the points and add it to the drawing layer.
    const polyline = new PolylineControl( points );
    this.application.drawingLayer.appendChild( polyline );

    // Add a text object.
    const text = new ScalableText();
    text.anchor = new Vector2( 8, 15 );
    text.fontSize = 1.5;
    text.content = 'Click on the line to show the controls.';
    text.textAnchor = 'middle';
    this.application.drawingLayer.appendChild( text );

    // Set zooming and panning to fit the content plus margin.
    this.application.fitToContent( 2 );

    // Define which part of the document we want to view. In this case the whole application.
    this.view.mountNode( this.application );
  }

  /**
   * Render the view into the context node.
   */
  private drawGraphic(): void {
    this.renderer.render( this.view, this.svgContext.wrappedNode );
  }
}
