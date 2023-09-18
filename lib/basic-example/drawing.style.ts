import { StyleSheet } from '@daign/style-sheets';
import { GraphicStyle } from '@daign/2d-graphics';

export const styleSheet = new StyleSheet<GraphicStyle>();
styleSheet.parseFromString(
  `.polyline {
    fill: none;
    stroke: #6699ff;
    stroke-width: 0.5;
  }
  .control-layer {
    .controlPoint {
      fill: #ff0000;
    }
  }`, GraphicStyle
);
