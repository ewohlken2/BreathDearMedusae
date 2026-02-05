import type { CSSProperties } from "react";

export interface MedusaeConfig {
  cursor?: {
    radius?: number;
    strength?: number;
    dragFactor?: number;
  };
  halo?: {
    outerOscFrequency?: number;
    outerOscAmplitude?: number;
    radiusBase?: number;
    radiusAmplitude?: number;
    shapeAmplitude?: number;
    rimWidth?: number;
    outerStartOffset?: number;
    outerEndOffset?: number;
    scaleX?: number;
    scaleY?: number;
  };
  particles?: {
    baseSize?: number;
    activeSize?: number;
    blobScaleX?: number;
    blobScaleY?: number;
    rotationSpeed?: number;
    rotationJitter?: number;
    cursorFollowStrength?: number;
    oscillationFactor?: number;
    colorBase?: string;
    colorOne?: string;
    colorTwo?: string;
    colorThree?: string;
  };
  background?: {
    color?: string;
  };
}

export interface MedusaeProps {
  className?: string;
  style?: CSSProperties;
  config?: MedusaeConfig;
}

export declare function Medusae(props: MedusaeProps): JSX.Element;
