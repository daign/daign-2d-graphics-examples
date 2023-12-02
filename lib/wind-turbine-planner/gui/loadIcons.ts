import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

/**
 * Attach reusable icon shapes to the defs section of the SVG.
 * @param defsNode - The node to attach the icons to.
 */
export const loadIcons = ( defsNode: WrappedNode ): void => {
  // Create pattern for alert area.
  const pattern = WrappedDomPool.getSvg( 'pattern' );
  pattern.setAttribute( 'x', '0' );
  pattern.setAttribute( 'y', '0' );
  pattern.setAttribute( 'width', '4' );
  pattern.setAttribute( 'height', '4' );
  pattern.setAttribute( 'id', 'warnPattern' );
  pattern.setAttribute( 'patternUnits', 'userSpaceOnUse' );
  const patternContent = WrappedDomPool.getSvg( 'path' );
  patternContent.setAttribute( 'd', 'M 0,2 L 2,0 4,0 0,4 z M 4,2 4,4 2,4 z' );
  patternContent.setAttribute( 'fill', '#f00' );
  pattern.appendChild( patternContent );
  const patternContent2 = WrappedDomPool.getSvg( 'path' );
  patternContent2.setAttribute( 'd', 'M 0,0 L 2,0 0,2 z M 4,0 L 4,2 2,4 0,4 z' );
  patternContent2.setAttribute( 'fill', '#f99' );
  pattern.appendChild( patternContent2 );
  defsNode.appendChild( pattern );

  const houseIcon = WrappedDomPool.getSvg( 'path' );
  houseIcon.setAttribute( 'id', 'houseIcon' );
  houseIcon.setAttribute( 'd',
    `M 15,4 4,15 h 3 v 9 H 4 v 2 H 26 v -2 h -3 v -9 h 3 z M 9,16 h 4 l 0,8 H 9 Z m 6,0 H 21 l 0,5
    h -6 z`
  );
  defsNode.appendChild( houseIcon );

  // Pattern for city area.
  const cityPattern = WrappedDomPool.getSvg( 'pattern' );
  cityPattern.setAttribute( 'x', '0' );
  cityPattern.setAttribute( 'y', '0' );
  cityPattern.setAttribute( 'width', '20' );
  cityPattern.setAttribute( 'height', '20' );
  cityPattern.setAttribute( 'id', 'cityPattern' );
  cityPattern.setAttribute( 'patternUnits', 'userSpaceOnUse' );
  const cityPatternBackground = WrappedDomPool.getSvg( 'rect' );
  cityPatternBackground.setAttribute( 'fill', '#c840a8' );
  cityPatternBackground.setAttribute( 'x', '0' );
  cityPatternBackground.setAttribute( 'y', '0' );
  cityPatternBackground.setAttribute( 'width', '20' );
  cityPatternBackground.setAttribute( 'height', '20' );
  cityPattern.appendChild( cityPatternBackground );
  const cityPatternIcon1 = WrappedDomPool.getSvg( 'use' );
  cityPatternIcon1.setAttributeNS( WrappedDomPool.xlinkNamespace, 'href', '#houseIcon' );
  cityPatternIcon1.setAttribute( 'fill', '#6b0f55' );
  cityPatternIcon1.setAttribute( 'x', '0' );
  cityPatternIcon1.setAttribute( 'y', '0' );
  cityPatternIcon1.setAttribute( 'transform', 'scale(0.2,0.2)' );
  cityPattern.appendChild( cityPatternIcon1 );
  const cityPatternIcon2 = WrappedDomPool.getSvg( 'use' );
  cityPatternIcon2.setAttributeNS( WrappedDomPool.xlinkNamespace, 'href', '#houseIcon' );
  cityPatternIcon2.setAttribute( 'fill', '#6b0f55' );
  cityPatternIcon2.setAttribute( 'x', '0' );
  cityPatternIcon2.setAttribute( 'y', '0' );
  cityPatternIcon2.setAttribute( 'transform', 'translate(10,10) scale(0.2,0.2)' );
  cityPattern.appendChild( cityPatternIcon2 );
  defsNode.appendChild( cityPattern );

  const treeIcon = WrappedDomPool.getSvg( 'path' );
  treeIcon.setAttribute( 'id', 'treeIcon' );
  treeIcon.setAttribute( 'd',
    `M 14,2 11,7 H 13 L 10,13 H 12 L 9,19 H 13 v 5 H 8 v -2 h 2 L 9,19 7,13 4,22 h 2 v 2 H 4 v 2
    H 26 v -2 h -3 v -4 l 3,-4 -1,-6 -3,-6 -3,6 -1,6 3,4 v 4 h -6 v -5 h 4 L 16,13 h 2 L 15,7 h 2 z`
  );
  defsNode.appendChild( treeIcon );

  // Pattern for wood area.
  const woodPattern = WrappedDomPool.getSvg( 'pattern' );
  woodPattern.setAttribute( 'x', '0' );
  woodPattern.setAttribute( 'y', '0' );
  woodPattern.setAttribute( 'width', '20' );
  woodPattern.setAttribute( 'height', '20' );
  woodPattern.setAttribute( 'id', 'woodPattern' );
  woodPattern.setAttribute( 'patternUnits', 'userSpaceOnUse' );
  const woodPatternBackground = WrappedDomPool.getSvg( 'rect' );
  woodPatternBackground.setAttribute( 'fill', '#35B934' );
  woodPatternBackground.setAttribute( 'x', '0' );
  woodPatternBackground.setAttribute( 'y', '0' );
  woodPatternBackground.setAttribute( 'width', '20' );
  woodPatternBackground.setAttribute( 'height', '20' );
  woodPattern.appendChild( woodPatternBackground );
  const woodPatternIcon1 = WrappedDomPool.getSvg( 'use' );
  woodPatternIcon1.setAttributeNS( WrappedDomPool.xlinkNamespace, 'href', '#treeIcon' );
  woodPatternIcon1.setAttribute( 'fill', '#198718' );
  woodPatternIcon1.setAttribute( 'x', '0' );
  woodPatternIcon1.setAttribute( 'y', '0' );
  woodPatternIcon1.setAttribute( 'transform', 'scale(0.2,0.2)' );
  woodPattern.appendChild( woodPatternIcon1 );
  const woodPatternIcon2 = WrappedDomPool.getSvg( 'use' );
  woodPatternIcon2.setAttributeNS( WrappedDomPool.xlinkNamespace, 'href', '#treeIcon' );
  woodPatternIcon2.setAttribute( 'fill', '#198718' );
  woodPatternIcon2.setAttribute( 'x', '0' );
  woodPatternIcon2.setAttribute( 'y', '0' );
  woodPatternIcon2.setAttribute( 'transform', 'translate(10,10) scale(0.2,0.2)' );
  woodPattern.appendChild( woodPatternIcon2 );
  defsNode.appendChild( woodPattern );

  const deleteButton = WrappedDomPool.getSvg( 'g' );
  deleteButton.setAttribute( 'id', 'deleteButton' );
  const buttonCircle = WrappedDomPool.getSvg( 'circle' );
  buttonCircle.setAttribute( 'fill', '#f00' );
  buttonCircle.setAttribute( 'r', '15' );
  deleteButton.appendChild( buttonCircle );
  const buttonCross = WrappedDomPool.getSvg( 'polygon' );
  buttonCross.setAttribute( 'fill', '#fff' );
  buttonCross.setAttribute( 'points', '0,3 6,9 9,6 3,0 9,-6 6,-9 0,-3 -6,-9 -9,-6 -3,0 -9,6 -6,9' );
  deleteButton.appendChild( buttonCross );
  defsNode.appendChild( deleteButton );

  const moveIcon = WrappedDomPool.getSvg( 'path' );
  moveIcon.setAttribute( 'id', 'moveIcon' );
  moveIcon.setAttribute( 'd',
    `M 15,0 9,6 H 13 V 13 H 6 V 9 L 0,15 6,21 V 17 H 13 v 7 H 9 l 6,6 6,-6 h -4 v -7 h 7 v 4
    L 30,15 24,9 V 13 H 17 V 6 h 4 z`
  );
  defsNode.appendChild( moveIcon );

  const drawIcon = WrappedDomPool.getSvg( 'path' );
  drawIcon.setAttribute( 'id', 'drawIcon' );
  drawIcon.setAttribute( 'd',
    `M 22,3 9,16 7,23 14,21 27,8 Z M 10,17 13,20 10,21 9,20 Z m -6,7 v 2 H 26 v -2 z`
  );
  defsNode.appendChild( drawIcon );

  const deleteIcon = WrappedDomPool.getSvg( 'path' );
  deleteIcon.setAttribute( 'id', 'deleteIcon' );
  deleteIcon.setAttribute( 'd',
    `M 12,4 10,7 H 7 L 6,9 H 24 L 23,7 H 20 L 18,4 Z m 1,1 h 4 l 1,2 H 12 Z M 7,11 10,27 h 10
    l 3,-16 z m 3,2 h 2 l 1,12 h -2 z m 4,0 h 2 v 12 h -2 z m 4,0 h 2 l -1,12 h -2 z`
  );
  defsNode.appendChild( deleteIcon );

  const turbineIcon = WrappedDomPool.getSvg( 'path' );
  turbineIcon.setAttribute( 'id', 'turbineIcon' );
  turbineIcon.setAttribute( 'd',
    `m 15,1.5 -1,8.5 h 2 z M 16,10 15,12 14,10 7,16 14,12.5 V 26 H 10 V 28 H 20 V 26 H 16 V 12.5
    l 7,3.5 z`
  );
  defsNode.appendChild( turbineIcon );

  const uploadIcon = WrappedDomPool.getSvg( 'path' );
  uploadIcon.setAttribute( 'id', 'uploadIcon' );
  uploadIcon.setAttribute( 'd',
    `m 5,26 v -4 h 20 v 4 z M 15,0 9,6 H 13 V 18 h 4 V 6 h 4 z`
  );
  defsNode.appendChild( uploadIcon );

  // The animated turbine graphic.
  const turbineGraphic = WrappedDomPool.getSvg( 'g' );
  turbineGraphic.setAttribute( 'id', 'turbineGraphic' );
  turbineGraphic.setAttribute( 'transform', 'scale(0.5,0.5) translate(0,-30)' );
  const towerBackground = WrappedDomPool.getSvg( 'path' );
  towerBackground.setAttribute( 'd', 'M -2,30 -1,0 h 2 l 1,30 z' );
  towerBackground.setAttribute( 'fill', '#fff' );
  turbineGraphic.appendChild( towerBackground );
  const towerShadow = WrappedDomPool.getSvg( 'path' );
  towerShadow.setAttribute( 'd', 'M 0,30 H 2 L 1,0 H 0 Z' );
  towerShadow.setAttribute( 'fill', '#ccc' );
  turbineGraphic.appendChild( towerShadow );
  const towerOutline = WrappedDomPool.getSvg( 'path' );
  towerOutline.setAttribute( 'd', 'M -2,30 -1,0 h 2 l 1,30 z' );
  towerOutline.setAttribute( 'fill', 'none' );
  towerOutline.setAttribute( 'stroke', '#000' );
  towerOutline.setAttribute( 'stroke-width', '0.3' );
  turbineGraphic.appendChild( towerOutline );
  const rotor = WrappedDomPool.getSvg( 'g' );
  const blade1 = WrappedDomPool.getSvg( 'path' );
  blade1.setAttribute( 'd', 'm 0,-1 h 3 l 2,-1 14,1 V 0 H 5 0 Z' );
  blade1.setAttribute( 'fill', '#fff' );
  blade1.setAttribute( 'stroke', '#000' );
  blade1.setAttribute( 'stroke-width', '0.3' );
  rotor.appendChild( blade1 );
  const blade2 = WrappedDomPool.getSvg( 'path' );
  blade2.setAttribute( 'd', 'm 0,-1 h 3 l 2,-1 14,1 V 0 H 5 0 Z' );
  blade2.setAttribute( 'transform', 'rotate(120)' );
  blade2.setAttribute( 'fill', '#fff' );
  blade2.setAttribute( 'stroke', '#000' );
  blade2.setAttribute( 'stroke-width', '0.3' );
  rotor.appendChild( blade2 );
  const blade3 = WrappedDomPool.getSvg( 'path' );
  blade3.setAttribute( 'd', 'm 0,-1 h 3 l 2,-1 14,1 V 0 H 5 0 Z' );
  blade3.setAttribute( 'transform', 'rotate(240)' );
  blade3.setAttribute( 'fill', '#fff' );
  blade3.setAttribute( 'stroke', '#000' );
  blade3.setAttribute( 'stroke-width', '0.3' );
  rotor.appendChild( blade3 );
  const animation = WrappedDomPool.getSvg( 'animateTransform' );
  animation.setAttribute( 'attributeName', 'transform' );
  animation.setAttribute( 'type', 'rotate' );
  animation.setAttribute( 'from', '0' );
  animation.setAttribute( 'to', '360' );
  animation.setAttribute( 'dur', '10s' );
  animation.setAttribute( 'repeatCount', 'indefinite' );
  rotor.appendChild( animation );
  turbineGraphic.appendChild( rotor );
  const circle = WrappedDomPool.getSvg( 'path' );
  circle.setAttribute( 'd', 'M 2,0 A 2,2 0 0 1 0,2 2,2 0 0 1 -2,0 2,2 0 0 1 0,-2 2,2 0 0 1 2,0 Z' );
  circle.setAttribute( 'fill', '#fff' );
  circle.setAttribute( 'stroke', '#000' );
  circle.setAttribute( 'stroke-width', '0.3' );
  turbineGraphic.appendChild( circle );
  defsNode.appendChild( turbineGraphic );
};
