import { Vector2 } from '@daign/math';
import { Application, ApplicationView, Group, InteractiveViewport } from '@daign/2d-graphics';
import { RendererFactory, SvgContext, SvgRenderer } from '@daign/2d-graphics-svg';
import { Schedule } from '@daign/schedule';

import { AreaControlManager, BackgroundImage, DistanceAlert, WindTurbineControl } from './controls';
import { styleSheet } from './drawing.style';
import { Layer, Tool } from './types';
import { DrawAreaHandle, DrawTurbineHandle } from './handles';
import { roundedRectangleModule } from './basic-elements';
import { FileUploader, LayerManager, loadIcons, ToolBar, ToolManager } from './gui';

export class WindTurbinePlanner {
  // Drawing application objects.
  private svgContext: SvgContext;
  public application: Application;
  private view: ApplicationView;
  private renderer: SvgRenderer;

  // User interface managers.
  public layerManager: LayerManager;
  public toolManager: ToolManager;
  private toolBar: ToolBar;
  public fileUploader: FileUploader;

  // Content elements.
  private backgroundImage: BackgroundImage = new BackgroundImage(
    [ new Vector2(), new Vector2( 0, -100 ) ]
  );
  private cityAreaManager: AreaControlManager;
  private woodAreaManager: AreaControlManager;
  private turbines: WindTurbineControl;
  private distanceAlert: DistanceAlert = new DistanceAlert();

  // Content layers.
  private layers: any = {
    [ Layer.BackgroundImage ]: new Group(),
    [ Layer.CityArea ]: new Group(),
    [ Layer.WoodArea ]: new Group(),
    [ Layer.Turbines ]: new Group()
  };

  // Drawing handles.
  public drawCityHandle: DrawAreaHandle;
  public drawWoodHandle: DrawAreaHandle;
  public drawTurbineHandle: DrawTurbineHandle;

  /**
   * The constructor.
   */
  public constructor() {
    // Layer manager.
    this.layerManager = new LayerManager();
    this.layerManager.subscribeToChanges( (): void => {
      this.setLayer();
      this.toolManager.setLayer( this.layerManager.currentLayer );
    } );

    // Tool manager and tool bar.
    this.toolBar = new ToolBar();
    this.toolManager = new ToolManager( this, this.toolBar );
    this.toolManager.subscribeToChanges( (): void => {
      this.setTool();
      this.application.redraw();
    } );

    // Create the SVG context, set the size and append it to the container element.
    this.svgContext = new SvgContext();
    this.calculateContextSize();
    const svgContainer = document.getElementById( 'svg-container' );
    if ( svgContainer ) {
      svgContainer.appendChild( this.svgContext.domNode );
    }
    loadIcons( this.svgContext.defsNode );

    // Create the application.
    // This is just a group containing the drawing layer and the layer for control points.
    // Set second parameter true for an interactive application with panning and zooming.
    this.application = new Application( this.svgContext, true );

    // File Uploader.
    this.fileUploader = new FileUploader( this.application, 'fileInput', this.backgroundImage );

    // Create the view.
    this.view = new ApplicationView( this.application );

    // Create the SVG renderer and set the style sheet.
    const rendererFactory = new RendererFactory();
    this.renderer = rendererFactory.createRenderer( styleSheet );
    this.renderer.addRenderModule( roundedRectangleModule );
    this.renderer.useNativeTransforms = true;
    this.renderer.flattenGroups = false;
    this.renderer.useInlineStyles = true;

    // Add tool bar to application.
    this.application.appendChild( this.toolBar );
    this.toolManager.setLayer( this.layerManager.currentLayer );

    // Create the graphic elements.
    this.turbines = new WindTurbineControl( this.application );
    this.turbines.points.subscribeToChanges( (): void => {
      const restrictedAreas = this.cityAreaManager.areas;
      this.distanceAlert.redraw( this.turbines, restrictedAreas );
    } );
    this.cityAreaManager = new AreaControlManager( this.application )
    this.cityAreaManager.setLayer( this.layers[ Layer.CityArea ] );
    this.woodAreaManager = new AreaControlManager( this.application )
    this.woodAreaManager.setLayer( this.layers[ Layer.WoodArea ] );

    this.constructGraphic();

    // Setup the drawing handles.
    this.drawCityHandle = new DrawAreaHandle( this.svgContext.domNode, this.application,
      this.cityAreaManager );
    this.drawWoodHandle = new DrawAreaHandle( this.svgContext.domNode, this.application,
      this.woodAreaManager );
    this.drawTurbineHandle = new DrawTurbineHandle( this.svgContext.domNode, this.application,
      this.turbines );

    // Initial rendering.
    this.setLayer();
    this.drawGraphic();

    // The function to execute when the window is being resized.
    const resizeCallback = (): void => {
      // Resize the drawing area.
      this.calculateContextSize();

      // Update the viewport so that what was in the center, remains in the center.
      ( this.application.drawingLayer as any ).updateViewport();
      this.application.redraw();
    };
    // A throttled version of the resize callback function. 100 ms wait = 10 fps.
    const throttledResizeCallback = Schedule.deferringThrottle( resizeCallback, 100, this );

    // Subscribe to window resize event.
    window.addEventListener( 'resize', throttledResizeCallback );

    // Subscribe to render signal.
    this.application.updateManager.setRenderFunction( (): void => {
      this.drawGraphic();
    } );
  }

  /**
   * Construct all elements of the graphic.
   */
  private constructGraphic(): void {
    this.application.drawingLayer.clearChildren();

    // Attach the layers.
    this.layers[ Layer.BackgroundImage ].addClass( 'background-image-layer' );
    this.application.drawingLayer.appendChild( this.layers[ Layer.BackgroundImage ] );

    this.layers[ Layer.CityArea ].addClass( 'city-layer' );
    this.application.drawingLayer.appendChild( this.layers[ Layer.CityArea ] );

    this.layers[ Layer.WoodArea ].addClass( 'wood-layer' );
    this.application.drawingLayer.appendChild( this.layers[ Layer.WoodArea ] );

    this.layers[ Layer.Turbines ].addClass( 'turbine-layer' );
    this.application.drawingLayer.appendChild( this.layers[ Layer.Turbines ] );

    this.application.drawingLayer.appendChild( this.distanceAlert );

    // Attach the single preset background image element.
    this.layers[ Layer.BackgroundImage ].appendChild( this.backgroundImage );

    // Attach the single preset wind turbine control.
    this.layers[ Layer.Turbines ].appendChild( this.turbines );

    ( this.application.drawingLayer as any ).viewScale = 5;
    ( this.application.drawingLayer as any ).viewCenter.set( 0, 0 );
    ( this.application.drawingLayer as any ).updateViewport();

    // Define which part of the document we want to view. In this case the whole application.
    this.view.mountNode( this.application );
  }

  /**
   * Set the size of the drawing area to the maximum available space.
   */
  private calculateContextSize(): void {
    const toolbarHeight = 60;
    this.svgContext.size = new Vector2( window.innerWidth, window.innerHeight - toolbarHeight );
  }

  /**
   * Switch between layers.
   */
  private setLayer(): void {
    // Reset all layers to inactive first.
    this.layers[ Layer.BackgroundImage ].setVariableClass( 'state', 'inactive' );
    this.layers[ Layer.CityArea ].setVariableClass( 'state', 'inactive' );
    this.layers[ Layer.WoodArea ].setVariableClass( 'state', 'inactive' );
    this.layers[ Layer.Turbines ].setVariableClass( 'state', 'inactive' );

    // Clear selection.
    this.application.selectionManager.setSelection( null, null );

    const currentLayer = this.layerManager.currentLayer;

    // Set state for new current layer to active.
    this.layers[ currentLayer ].setVariableClass( 'state', 'active' );
  }

  /**
   * Switch between tools.
   */
  private setTool(): void {
    // Reset viewport actions to enabled.
    ( this.application.drawingLayer as InteractiveViewport ).enableViewportActions( true );
    // Disable all handles.
    if ( this.drawCityHandle ) {
      this.drawCityHandle.enabled = false;
    }
    if ( this.drawWoodHandle ) {
      this.drawWoodHandle.enabled = false;
    }
    if ( this.drawTurbineHandle ) {
      this.drawTurbineHandle.enabled = false;
    }

    const currentLayer = this.layerManager.currentLayer;
    const currentTool = this.toolManager.currentTool;

    // Different actions to take depending on active layer.
    if ( currentLayer === Layer.CityArea ) {
      this.cityAreaManager.setTool( currentTool );

      // For the drawing tool, viewport actions have to be disabled.
      if ( currentTool === Tool.Draw ) {
        this.drawCityHandle.enabled = true;
        ( this.application.drawingLayer as InteractiveViewport ).enableViewportActions( false );
      }
    } else if ( currentLayer === Layer.WoodArea ) {
      this.woodAreaManager.setTool( currentTool );

      // For the drawing tool, viewport actions have to be disabled.
      if ( currentTool === Tool.Draw ) {
        this.drawWoodHandle.enabled = true;
        ( this.application.drawingLayer as InteractiveViewport ).enableViewportActions( false );
      }
    } else if ( currentLayer === Layer.Turbines ) {
      this.turbines.setTool( currentTool );

      // For the drawing tool, viewport actions have to be disabled.
      if ( currentTool === Tool.Draw ) {
        this.drawTurbineHandle.enabled = true;
        ( this.application.drawingLayer as InteractiveViewport ).enableViewportActions( false );
      }
    }
  }

  /**
   * Render the view into the context node.
   */
  private drawGraphic(): void {
    this.renderer.render( this.view, this.svgContext.contentNode );
  }
}
