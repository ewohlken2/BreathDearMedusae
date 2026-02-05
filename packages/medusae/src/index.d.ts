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
  };
}

export interface MedusaeProps {
  className?: string;
  style?: CSSProperties;
  config?: MedusaeConfig;
}

export declare function Medusae(props: MedusaeProps): JSX.Element;
