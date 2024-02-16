import { Observable } from '@daign/observable';

import { Layer } from '../types';
import { LayerMenu, MenuButton } from '../gui';
import { WindTurbinePlanner } from '../windTurbinePlanner';

const layerTitles = {
  [ Layer.BackgroundImage ] : 'Background Image',
  [ Layer.CityArea ] : 'Residential Areas',
  [ Layer.WoodArea ] : 'Forest Areas',
  [ Layer.Turbines ] : 'Wind Turbine Placement'
};

/**
 * Class for the layer manager.
 */
export class LayerManager extends Observable {
  private buttons: MenuButton[] = [];

  private layerTitle: HTMLElement;

  private _currentLayer: Layer = Layer.BackgroundImage;

  /**
   * Getter for current layer.
   * @returns the current layer.
   */
  public get currentLayer(): Layer {
    return this._currentLayer;
  }

  /**
   * Constructor.
   * @param project - The main project class.
   * @param layerMenu - The tool menu group object.
   */
  public constructor(
    private project: WindTurbinePlanner,
    private layerMenu: LayerMenu
  ) {
    super();

    this.layerTitle = document.getElementById( 'layerTitle' ) as HTMLElement;

    const turbinesButton = new MenuButton( true, (): void => {
      this.deactivateAll();
      this.setLayer( Layer.Turbines );
    }, '#turbineIcon', this.project.application, true );

    const backgroundButton = new MenuButton( true, (): void => {
      this.deactivateAll();
      this.setLayer( Layer.BackgroundImage );
    }, '#mapIcon', this.project.application, true );

    const cityButton = new MenuButton( true, (): void => {
      this.deactivateAll();
      this.setLayer( Layer.CityArea );
    }, '#houseIcon', this.project.application, true );

    const woodButton = new MenuButton( true, (): void => {
      this.deactivateAll();
      this.setLayer( Layer.WoodArea );
    }, '#treeIcon', this.project.application, true );

    this.buttons = [
      turbinesButton, backgroundButton, cityButton, woodButton
    ];
    backgroundButton.active = true;
    this.layerMenu.drawButtons( this.buttons );
  }

  /**
   * Set layer.
   */
  private setLayer( layer: Layer ): void {
    this._currentLayer = layer;
    this.layerTitle.innerHTML = layerTitles[ layer ];
    this.notifyObservers();
  }

  /**
   * Deactivate all buttons.
   */
  public deactivateAll(): void {
    this.buttons.forEach( ( button: MenuButton ): void => {
      button.active = false;
    } );
  }
}
