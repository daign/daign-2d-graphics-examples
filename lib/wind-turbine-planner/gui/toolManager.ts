import { Observable } from '@daign/observable';

import { WindTurbinePlanner } from '../windTurbinePlanner';
import { ToolButton } from './toolButton';
import { ToolBar } from './toolBar';
import { Layer, Tool } from '../types';

/**
 * Class for the tool manager.
 */
export class ToolManager extends Observable {
  private currentButtons: ToolButton[] = [];

  private _currentTool: Tool = Tool.None;

  /**
   * Getter for current tool.
   * @returns The current tool.
   */
  public get currentTool(): Tool {
    return this._currentTool;
  }

  /**
   * Setter for current tool.
   * @param value - The current tool.
   */
  public set currentTool( value: Tool ) {
    this._currentTool = value;
    this.notifyObservers();
  }

  /**
   * Constructor.
   * @param project - The main project class.
   * @param toolBar - The tool bar group object.
   */
  public constructor(
    private project: WindTurbinePlanner,
    private toolBar: ToolBar
  ) {
    super();
  }

  /**
   * Set layer.
   * @param layer - The layer to set.
   */
  public setLayer( layer: Layer ): void {
    this.currentButtons = [];

    // Create the tools depending on which layer becomes active.
    if ( layer === Layer.BackgroundImage ) {
      const uploadTool = new ToolButton( this, false, (): void => {
        this.project.fileUploader.triggerFileUpload();
      }, '#uploadIcon', this.project.application );
      this.currentButtons = [ uploadTool ];
    } else if ( layer === Layer.CityArea ) {
      const drawTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Draw;
      }, '#drawIcon', this.project.application );

      const moveTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Edit;
      }, '#moveIcon', this.project.application );

      const deleteTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Delete;
      }, '#deleteIcon', this.project.application );

      this.currentButtons = [ drawTool, moveTool, deleteTool ];

      // First tool should be enabled when accessing layer. Set silent.
      this._currentTool = Tool.Draw;
      drawTool.active = true;
    } else if ( layer === Layer.WoodArea ) {
      const drawTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Draw;
      }, '#drawIcon', this.project.application );

      const moveTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Edit;
      }, '#moveIcon', this.project.application );

      const deleteTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Delete;
      }, '#deleteIcon', this.project.application );

      this.currentButtons = [ drawTool, moveTool, deleteTool ];

      // First tool should be enabled when accessing layer. Set silent.
      this._currentTool = Tool.Draw;
      drawTool.active = true;
    } else if ( layer === Layer.Turbines ) {
      const drawTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Draw;
      }, '#drawIcon', this.project.application );

      const moveTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Edit;
      }, '#moveIcon', this.project.application );

      const deleteTool = new ToolButton( this, true, (): void => {
        this.currentTool = Tool.Delete;
      }, '#deleteIcon', this.project.application );

      this.currentButtons = [ drawTool, moveTool, deleteTool ];

      // First tool should be enabled when accessing layer. Set silent.
      this._currentTool = Tool.Draw;
      drawTool.active = true;
    }

    this.toolBar.drawButtons( this.currentButtons );

    this.notifyObservers();
  }

  /**
   * Deactivate all current buttons.
   */
  public deactivateAll(): void {
    this.currentButtons.forEach( ( button: ToolButton ): void => {
      button.active = false;
    } );
  }
}
