import { StyleSheet } from '@daign/style-sheets';
import { GraphicStyle } from '@daign/2d-graphics';

export const styleSheet = new StyleSheet<GraphicStyle>();
styleSheet.parseFromString(
  `.tool-bar {
    .tool-button {
      .rectangle {
        fill: #000;
        stroke: #999;
        stroke-width: 2;
        cursor: pointer;
      }
      .rectangle.active {
        fill: #090;
      }
      .rectangle.inactive {
        fill: #666;
      }
      .use {
        fill: #fff;
        pointer-events: none;
      }
    }
  }

  .background-image-layer {
    .background-image {
      .rectangle {
        fill: none;
        stroke: #999;
        stroke-width: 0.005;
      }
    }
  }
  .background-image-layer.inactive {
    pointer-events: none;
  }

  .city-layer {
    .area {
      .polygon {
        fill: url(#cityPattern);
        fill-opacity: 0.4;
        stroke: #C840A8;
        stroke-width: 0.5;
      }
    }
  }
  .city-layer.inactive {
    pointer-events: none;
  }

  .wood-layer {
    .area {
      .polygon {
        fill: url(#woodPattern);
        fill-opacity: 0.5;
        stroke: #35B934;
        stroke-width: 0.5;
      }
    }
  }
  .wood-layer.inactive {
    pointer-events: none;
  }

  .turbine-layer.inactive {
    pointer-events: none;
  }

  .distance-alert {
    .line {
      stroke: #ff0000;
      stroke-width: 0.5;
    }
    .circle {
      fill: url(#warnPattern);
      stroke: #ff0000;
      stroke-width: 0.2;
      fill-opacity: 0.3;
      stroke-opacity: 0.5;
    }
  }

  .control-layer {
    .controlPoint {
      fill: #ff0000;
    }
  }`, GraphicStyle
);
