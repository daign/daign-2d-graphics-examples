import { TwoPointRectangle } from '@daign/2d-graphics';

/**
 * Class for a rounded rectangle element.
 */
export class RoundedRectangle extends TwoPointRectangle {
  // Radius of corner rounding.
  public rx: number = 0;
  public ry: number = 0;

  /**
   * Constructor.
   */
  public constructor() {
    super();
  }
}
