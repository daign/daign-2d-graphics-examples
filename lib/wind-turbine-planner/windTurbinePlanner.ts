import { Vector2 } from '@daign/math';
import { Application, ApplicationView, GraphicStyle, Group,
  InteractiveViewport } from '@daign/2d-graphics';
import { RendererFactory, SvgContext, SvgRenderer } from '@daign/2d-graphics-svg';
import { Schedule } from '@daign/schedule';
import { StyleSheet } from '@daign/style-sheets';

import { AreaControlManager, AreaFactory, BackgroundImage, DeforestationEstimate, DistanceAlert,
  WindTurbineControl } from './controls';
import { Layer, Tool } from './types';
import { DrawAreaHandle, DrawTurbineHandle } from './handles';
import { roundedRectangleModule } from './basic-elements';
import { FileUploader, LayerMenu, ScaleBar, ToolMenu } from './gui';
import { LayerManager, ToolManager } from './managers';

export class WindTurbinePlanner {
  // Drawing application objects.
  private svgContext: SvgContext;
  public application: Application;
  private view: ApplicationView;
  private renderer: SvgRenderer | null = null;

  // User interface managers.
  public layerManager: LayerManager;
  private layerMenu: LayerMenu;
  public toolManager: ToolManager;
  private toolMenu: ToolMenu;
  public fileUploader: FileUploader;

  public scaleBar: ScaleBar;

  // Content elements.
  private backgroundImage: BackgroundImage;
  private cityAreaManager: AreaControlManager;
  private woodAreaManager: AreaControlManager;
  private turbines: WindTurbineControl;
  private distanceAlert: DistanceAlert = new DistanceAlert();
  private deforestationEstimate: DeforestationEstimate = new DeforestationEstimate();

  // Content layers.
  private layers: { [ key in Layer ]: Group } = {
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
    // Create the SVG context, set the size and append it to the container element.
    this.svgContext = new SvgContext();
    this.calculateContextSize();
    const svgContainer = document.getElementById( 'svg-container' );
    if ( svgContainer ) {
      svgContainer.appendChild( this.svgContext.domNode );
    }

    // Create the application.
    // This is just a group containing the drawing layer and the layer for control points.
    // Set second parameter true for an interactive application with panning and zooming.
    this.application = new Application( this.svgContext, true );

    // Create the view.
    this.view = new ApplicationView( this.application );

    // Layer manager and layer menu.
    this.layerMenu = new LayerMenu();
    this.layerManager = new LayerManager( this, this.layerMenu );
    this.layerManager.subscribeToChanges( (): void => {
      this.setLayer();
      this.toolManager.setLayer( this.layerManager.currentLayer );
    } );

    // Tool manager and tool menu.
    this.toolMenu = new ToolMenu();
    this.toolManager = new ToolManager( this, this.toolMenu );
    this.toolManager.subscribeToChanges( (): void => {
      this.setTool();
      this.application.redraw();
    } );

    // Scale bar.
    this.scaleBar = new ScaleBar( this.svgContext, this.application.drawingLayer );
    this.application.updateManager.subscribeToRedrawEvent( (): void => {
      this.scaleBar.redraw();
    } );

    // Add menu and scale bar to application.
    this.application.appendChild( this.layerMenu );
    this.application.appendChild( this.toolMenu );
    this.application.appendChild( this.scaleBar );
    this.toolManager.setLayer( this.layerManager.currentLayer );

    // Create the graphic elements.
    this.backgroundImage = new BackgroundImage( this.application, [
      // Center and extension point.
      new Vector2( 0, 0 ), new Vector2( 0, -1500 ),
      // Points for matching the scale.
      new Vector2( -500, 500 ), new Vector2( 500, 500 )
    ] );

    this.turbines = new WindTurbineControl( this.application );
    this.cityAreaManager = new AreaControlManager( this.application );
    this.cityAreaManager.setLayer( this.layers[ Layer.CityArea ] );
    this.woodAreaManager = new AreaControlManager( this.application );
    this.woodAreaManager.setLayer( this.layers[ Layer.WoodArea ] );
    // Subscriptions on graphic elements.
    this.turbines.points.subscribeToChanges( (): void => {
      const cityAreas = this.cityAreaManager.areas;
      const woodAreas = this.woodAreaManager.areas;
      this.distanceAlert.redraw( this.turbines, cityAreas );
      this.deforestationEstimate.redraw( this.turbines, woodAreas );
    } );
    this.cityAreaManager.subscribeToChanges( (): void => {
      const cityAreas = this.cityAreaManager.areas;
      this.distanceAlert.redraw( this.turbines, cityAreas );
    } );
    this.woodAreaManager.subscribeToChanges( (): void => {
      const woodAreas = this.woodAreaManager.areas;
      this.deforestationEstimate.redraw( this.turbines, woodAreas );
    } );

    const cityAreaFactory = new AreaFactory( false, this.cityAreaManager );
    const woodAreaFactory = new AreaFactory( true, this.woodAreaManager );

    this.constructGraphic();

    // File Uploader.
    this.fileUploader = new FileUploader( this.application, 'fileInput', this.backgroundImage );

    // Setup the drawing handles.
    this.drawCityHandle = new DrawAreaHandle( this.svgContext.domNode, this.application,
      cityAreaFactory );
    this.drawWoodHandle = new DrawAreaHandle( this.svgContext.domNode, this.application,
      woodAreaFactory );
    this.drawTurbineHandle = new DrawTurbineHandle( this.svgContext.domNode, this.application,
      this.turbines );

    this.setLayer();

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

    Promise.all( [
      // Load style sheet.
      this.loadStyleSheet()
        .then( ( styleSheet: StyleSheet<GraphicStyle> ): void => {
          // Create the SVG renderer and set the style sheet.
          const rendererFactory = new RendererFactory();
          this.renderer = rendererFactory.createRenderer( styleSheet );
          this.renderer.addRenderModule( roundedRectangleModule );
          this.renderer.useNativeTransforms = true;
          this.renderer.flattenGroups = false;
          this.renderer.useInlineStyles = true;
        } ),
      // Load icons.
      this.loadSvgFile( './assets/icons.svg' )
        .then( ( svgContent: string ): void => {
          // Attach icons to defs section of SVG context.
          this.svgContext.defsNode.domNode.innerHTML += svgContent;
        } ),
      // Load example map.
      this.loadSvgFile( './assets/map.svg' )
        .then( ( svgContent: string ): void => {
          // Attach map to defs section of SVG context.
          this.svgContext.defsNode.domNode.innerHTML += svgContent;
        } )
    ] )
      .then( (): void => {
        // Initial render.
        this.drawGraphic();
      } );
  }

  /**
   * Load style sheet.
   * @returns Promise containing the style sheet.
   */
  private loadStyleSheet(): Promise<StyleSheet<GraphicStyle>> {
    return fetch( './graphicStyle.scss' )
      .then( ( response: Response ): Promise<StyleSheet<GraphicStyle>> => {
        if ( !response.ok ) {
          throw new Error( 'Failed to load the graphics style.' );
        }

        return response.text()
          .then( ( content: string ): StyleSheet<GraphicStyle> => {
            const styleSheet = new StyleSheet<GraphicStyle>();
            styleSheet.parseFromString( content, GraphicStyle );
            return styleSheet;
        } );
      } );
  }

  /**
   * Load SVG file.
   * @param filePath - The path of the file.
   * @returns Promise containing the inner HTML string.
   */
  private loadSvgFile( filePath: string ): Promise<string> {
    return fetch( filePath )
      .then( ( response: Response ): Promise<string> => {
        if ( !response.ok ) {
          throw new Error( 'Failed to load SVG file.' );
        }

        return response.text()
          .then( ( content: string ): string => {
            // Parse loaded file to DOM.
            const parser = new DOMParser();
            const svg = parser.parseFromString( content, 'image/svg+xml' ).documentElement;

            if ( !svg.firstElementChild ) {
              throw new Error( 'SVG file is empty.' );
            }
            return svg.firstElementChild.innerHTML;
          } );
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

    this.application.drawingLayer.appendChild( this.deforestationEstimate );

    this.application.drawingLayer.appendChild( this.distanceAlert );

    // Attach the single preset background image element.
    this.layers[ Layer.BackgroundImage ].appendChild( this.backgroundImage );

    // Attach the single preset wind turbine control.
    this.layers[ Layer.Turbines ].appendChild( this.turbines );

    // Set initial view scale, center and limits.
    this.application.drawingLayer.viewScale.x = 0.4;
    this.application.drawingLayer.viewCenter.set( 0, 0 );
    this.application.drawingLayer.scaleMin = 0.01;
    this.application.drawingLayer.scaleMax = 100;
    const viewLimit = Math.pow( 10, 6 );
    const viewCenterLimit = this.application.drawingLayer.viewCenterLimit;
    viewCenterLimit.makeEmpty();
    viewCenterLimit.expandByPoint( new Vector2( -viewLimit, -viewLimit ) );
    viewCenterLimit.expandByPoint( new Vector2( viewLimit, viewLimit ) );

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
    if ( currentLayer === Layer.BackgroundImage ) {
      if ( this.backgroundImage ) {
        this.backgroundImage.setTool( currentTool );
      }
    } else if ( currentLayer === Layer.CityArea ) {
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
   * Set the example map to the background image.
   */
  public setExampleMap(): void {
    this.backgroundImage.useReference = '#exampleMap';

    this.application.selectionManager.setSelection( this.backgroundImage, null );
    this.application.redraw();
  }

  /**
   * Render the view into the context node.
   */
  private drawGraphic(): void {
    if ( this.renderer ) {
      this.renderer.render( this.view, this.svgContext.contentNode );
    }
  }
}
