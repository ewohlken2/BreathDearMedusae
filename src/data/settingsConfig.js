const SETTINGS_CONFIG = {
    storageKey: "cursorJitterSettings",
    defaults: {
        cursor: {
            radius: 0.065,
            strength: 2,
            dragFactor: 0.015,
        },
        halo: {
            outerOscFrequency: 2.6,
            outerOscAmplitude: 0.76,
            radiusBase: 2.2,
            radiusAmplitude: 0.5,
            shapeAmplitude: 0.75,
            rimWidth: 1.8,
            outerStartOffset: 0.4,
            outerEndOffset: 2.2,
        },
        particles: {
            baseSize: 0.012,
            activeSize: 0.055,
            blobScaleX: 1,
            blobScaleY: 0.75,
        },
    },
};

export default SETTINGS_CONFIG;