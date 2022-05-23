import { expect } from 'chai';

import { Vector2 } from '@daign/math';

import { PolylineControl } from '../../lib/basic-example/polylineControl';

describe( 'PolylineControl', (): void => {
  describe( 'constructor', (): void => {
    it( 'should set the passed points to the internal points array', (): void => {
      // Arrange
      const input = [
        new Vector2( 0, 1 ),
        new Vector2( 0, 2 ),
        new Vector2( 0, 3 )
      ];

      // Act
      const polyline = new PolylineControl( input );

      // Assert
      const controlPoints = polyline.points.elements;
      expect( controlPoints.length ).to.equal( 3 );
      expect( controlPoints[ 0 ].equals( input[ 0 ] ) ).to.be.true;
      expect( controlPoints[ 1 ].equals( input[ 1 ] ) ).to.be.true;
      expect( controlPoints[ 2 ].equals( input[ 2 ] ) ).to.be.true;
    } );
  } );
} );
