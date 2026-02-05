import MEDUSAE_DEFAULTS from "../../packages/medusae/src/defaults.js";

const SETTINGS_CONFIG = {
    storageKey: "cursorJitterSettings",
    defaults: MEDUSAE_DEFAULTS,
    settingsSchema: [
        {
            id: "cursor",
            label: "Cursor",
            fields: [
                { path: "cursor.radius", label: "Hover Radius", step: 0.001 },
                { path: "cursor.strength", label: "Hover Strength", step: 0.01 },
                { path: "cursor.dragFactor", label: "Drag Factor", step: 0.001 },
            ],
        },
        {
            id: "halo",
            label: "Halo",
            fields: [
                { path: "halo.outerOscFrequency", label: "Outer Osc Frequency", step: 0.05 },
                { path: "halo.outerOscAmplitude", label: "Outer Osc Strength", step: 0.01 },
                {
                    path: "halo.outerOscJitterStrength",
                    label: "Outer Osc Jitter Strength",
                    step: 0.01,
                },
                { path: "halo.outerOscJitterSpeed", label: "Outer Osc Jitter Speed", step: 0.01 },
                { path: "halo.radiusBase", label: "Radius Base", step: 0.01 },
                { path: "halo.radiusAmplitude", label: "Radius Amplitude", step: 0.01 },
                { path: "halo.shapeAmplitude", label: "Shape Amplitude", step: 0.01 },
                { path: "halo.rimWidth", label: "Rim Width", step: 0.01 },
                { path: "halo.outerStartOffset", label: "Outer Start Offset", step: 0.01 },
                { path: "halo.outerEndOffset", label: "Outer End Offset", step: 0.01 },
                { path: "halo.scaleX", label: "Halo Width", step: 0.01 },
                { path: "halo.scaleY", label: "Halo Height", step: 0.01 },
            ],
        },
        {
            id: "particles",
            label: "Particles",
            fields: [
                { path: "particles.baseSize", label: "Base Size", step: 0.001 },
                { path: "particles.activeSize", label: "Active Size", step: 0.001 },
                { path: "particles.blobScaleX", label: "Blob Width", step: 0.01 },
                { path: "particles.blobScaleY", label: "Blob Height", step: 0.01 },
                { path: "particles.rotationSpeed", label: "Rotation Speed", step: 0.05 },
                { path: "particles.rotationJitter", label: "Rotation Jitter", step: 0.01 },
                {
                    path: "particles.cursorFollowStrength",
                    label: "Cursor Follow Strength",
                    step: 0.05,
                },
                { path: "particles.oscillationFactor", label: "Oscillation Factor", step: 0.05 },
            ],
        },
    ],
};

export default SETTINGS_CONFIG;
