import { Observable } from '@daign/observable';

import { Layer } from '../types';

const maxLayer = 3;
const layerTitles = {
  [ Layer.BackgroundImage ] : 'Background Image',
  [ Layer.CityArea ] : 'City Area',
  [ Layer.WoodArea ] : 'Wood Area',
  [ Layer.Turbines ] : 'Turbine Placement'
};

/**
 * Class for the layer manager.
 */
export class LayerManager extends Observable {
  private layerTitleElement: HTMLElement;
  private previousLayerButton: HTMLElement;
  private nextLayerButton: HTMLElement;

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
   */
  public constructor() {
    super();

    // Collect the html elements that allow switching between layers.
    this.layerTitleElement = document.getElementById( 'layerTitle' ) as HTMLElement;
    this.nextLayerButton = document.getElementById( 'nextLayer' ) as HTMLElement;
    this.previousLayerButton = document.getElementById( 'previousLayer' ) as HTMLElement;

    this.nextLayerButton.addEventListener( 'click', (): void => {
      this.nextLayer();
    } );
    this.previousLayerButton.addEventListener( 'click', (): void => {
      this.previousLayer();
    } );

    this.setLayerTitle();
    this.setButtons();
  }

  /**
   * Activate next layer.
   */
  private nextLayer(): void {
    const newLayer = this.currentLayer + 1;
    if ( newLayer <= maxLayer ) {
      this._currentLayer = newLayer;
      this.setLayerTitle();
      this.setButtons();
      this.notifyObservers();
    }
  }

  /**
   * Activate previous layer.
   */
  private previousLayer(): void {
    const newLayer = this.currentLayer - 1;
    if ( newLayer >= 0 ) {
      this._currentLayer = newLayer;
      this.setLayerTitle();
      this.setButtons();
      this.notifyObservers();
    }
  }

  /**
   * Display layer title in frontend.
   */
  private setLayerTitle(): void {
    this.layerTitleElement.textContent = layerTitles[ this.currentLayer ];
  }

  /**
   * Show or hide the buttons, depending on whether they have a use at the moment.
   */
  private setButtons(): void {
    this.nextLayerButton.style.visibility = 'visible';
    this.previousLayerButton.style.visibility = 'visible';

    if ( this.currentLayer === Layer.BackgroundImage ) {
      this.previousLayerButton.style.visibility = 'hidden';
    }
    if ( this.currentLayer === Layer.Turbines ) {
      this.nextLayerButton.style.visibility = 'hidden';
    }
  }
}
