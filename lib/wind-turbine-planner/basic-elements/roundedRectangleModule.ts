import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';
import { RenderModule } from '@daign/2d-graphics-svg';

import { RoundedRectangle } from './roundedRectangle';

/**
 * Render module defining how a RoundedRectangle should be rendered.
 */
export const roundedRectangleModule = new RenderModule(
  RoundedRectangle,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const rectangle = currentNode.sourceNode as RoundedRectangle;
    selectorChain.addSelector( rectangle.styleSelector );

    // Start and size are transformed according to the current projection.
    const startPoint = rectangle.getStartTransformed( projection );
    const size = rectangle.getSizeTransformed( projection );

    const rectNode = WrappedDomPool.getSvg( 'rect' );
    rectNode.setAttribute( 'x', String( startPoint.x ) );
    rectNode.setAttribute( 'y', String( startPoint.y ) );
    rectNode.setAttribute( 'width', String( size.x ) );
    rectNode.setAttribute( 'height', String( size.y ) );
    rectNode.setAttribute( 'rx', String( rectangle.rx ) );
    rectNode.setAttribute( 'ry', String( rectangle.ry ) );

    return rectNode;
  }
);
