import { MathHelper } from '@daign/math';

/**
 * Class for unit formatting.
 */
export class UnitFormatter {
  /**
   * Convert to a string adapting to the magnitude of the length value.
   * @param input - The length value to format.
   * @returns The formatted string.
   */
  public static printLengthAdapted( input: number ): string {
    let value = input;
    let unit = 'm';
    let valueString = '';

    if ( value >= 995 ) {
      // Output in kilometers.
      unit = 'km';
      value = value / 1000;
    }

    if ( value < 1 ) {
      valueString = value.toFixed( 2 );
    } else {
      const numberOfDigits = Math.floor( Math.log10( value ) ) + 1;
      if ( numberOfDigits === 1 ) {
        valueString = value.toFixed( 1 );
      } else {
        valueString = MathHelper.precisionRound( value, 2 - numberOfDigits ).toFixed( 0 );
      }
    }

    const output = `${ valueString } ${ unit }`;
    return output;
  }

  /**
   * Convert to a string adapting to the magnitude of the area value.
   * @param input - The area value to format.
   * @returns The formatted string.
   */
  public static printAreaAdapted( input: number ): string {
    let value = input;
    let unit = 'qm';
    let valueString = '';

    if ( value >= 995 ) {
      // Output in hectare.
      unit = 'ha';
      value = value / 1000;
    }

    if ( value < 1 ) {
      valueString = value.toFixed( 2 );
    } else {
      const numberOfDigits = Math.floor( Math.log10( value ) ) + 1;
      if ( numberOfDigits === 1 ) {
        valueString = value.toFixed( 1 );
      } else {
        valueString = MathHelper.precisionRound( value, 2 - numberOfDigits ).toFixed( 0 );
      }
    }

    const output = `${ valueString } ${ unit }`;
    return output;
  }
}
