import { TwoPointRectangle } from '@daign/2d-graphics';

/**
 * Class for a rounded rectangle element.
 * With the ability to act as a button.
 */
export class RoundedRectangle extends TwoPointRectangle {
  // Radius of corner rounding.
  public rx: number = 0;
  public ry: number = 0;

  public callback: ( () => void ) | null = null;

  /**
   * Constructor.
   */
  public constructor() {
    super();
  }
}
