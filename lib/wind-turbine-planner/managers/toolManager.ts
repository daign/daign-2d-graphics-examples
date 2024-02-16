import { Observable } from '@daign/observable';

import { WindTurbinePlanner } from '../windTurbinePlanner';
import { MenuButton, ToolMenu } from '../gui';
import { Layer, Tool } from '../types';

/**
 * Class for the tool manager.
 */
export class ToolManager extends Observable {
  private currentButtons: MenuButton[] = [];

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
   * @param toolMenu - The tool menu group object.
   */
  public constructor(
    private project: WindTurbinePlanner,
    private toolMenu: ToolMenu
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
      const uploadTool = new MenuButton( false, (): void => {
        this.project.fileUploader.triggerFileUpload();
      }, '#uploadIcon', this.project.application );

      const exampleMapTool = new MenuButton( false, (): void => {
        this.project.setExampleMap();
      }, '#starMapIcon', this.project.application );

      const editTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Edit;
      }, '#resizeIcon', this.project.application );

      const scaleTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Scale;
      }, '#rulerIcon', this.project.application );

      this.currentButtons = [ uploadTool, exampleMapTool, editTool, scaleTool ];

      // Edit tool should be enabled when accessing layer. Set silent.
      this._currentTool = Tool.Edit;
      editTool.active = true;
    } else if ( layer === Layer.CityArea ) {
      const drawTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Draw;
      }, '#drawIcon', this.project.application );

      const moveTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Edit;
      }, '#moveIcon', this.project.application );

      const deleteTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Delete;
      }, '#deleteIcon', this.project.application );

      this.currentButtons = [ moveTool, drawTool, deleteTool ];

      // First tool should be enabled when accessing layer. Set silent.
      this._currentTool = Tool.Edit;
      moveTool.active = true;
    } else if ( layer === Layer.WoodArea ) {
      const drawTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Draw;
      }, '#drawIcon', this.project.application );

      const moveTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Edit;
      }, '#moveIcon', this.project.application );

      const deleteTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Delete;
      }, '#deleteIcon', this.project.application );

      this.currentButtons = [ moveTool, drawTool, deleteTool ];

      // First tool should be enabled when accessing layer. Set silent.
      this._currentTool = Tool.Edit;
      moveTool.active = true;
    } else if ( layer === Layer.Turbines ) {
      const drawTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Draw;
      }, '#drawIcon', this.project.application );

      const moveTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Edit;
      }, '#moveIcon', this.project.application );

      const deleteTool = new MenuButton( true, (): void => {
        this.deactivateAll();
        this.currentTool = Tool.Delete;
      }, '#deleteIcon', this.project.application );

      this.currentButtons = [ moveTool, drawTool, deleteTool ];

      // First tool should be enabled when accessing layer. Set silent.
      this._currentTool = Tool.Edit;
      moveTool.active = true;
    }

    this.toolMenu.drawButtons( this.currentButtons );

    this.notifyObservers();
  }

  /**
   * Deactivate all current buttons.
   */
  public deactivateAll(): void {
    this.currentButtons.forEach( ( button: MenuButton ): void => {
      button.active = false;
    } );
  }
}
