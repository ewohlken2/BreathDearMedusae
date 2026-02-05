import { useState } from "react";

const SettingsMenu = ({
  radius,
  strength,
  dragFactor,
  outerOscFrequency,
  outerOscAmplitude,
  haloRadiusBase,
  haloRadiusAmplitude,
  haloShapeAmplitude,
  haloRimWidth,
  haloOuterStartOffset,
  haloOuterEndOffset,
  particleBaseSize,
  particleActiveSize,
  blobScaleX,
  blobScaleY,
  onRadiusChange,
  onStrengthChange,
  onDragFactorChange,
  onOuterOscFrequencyChange,
  onOuterOscAmplitudeChange,
  onHaloRadiusBaseChange,
  onHaloRadiusAmplitudeChange,
  onHaloShapeAmplitudeChange,
  onHaloRimWidthChange,
  onHaloOuterStartOffsetChange,
  onHaloOuterEndOffsetChange,
  onParticleBaseSizeChange,
  onParticleActiveSizeChange,
  onBlobScaleXChange,
  onBlobScaleYChange,
  onSave,
  onReset,
  onExport,
  hasDirtyChanges,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button
        className="menu-button"
        type="button"
        onClick={() => setShowSettings((prev) => !prev)}
      >
        Settings
      </button>
      {showSettings && (
        <div className="settings-dialog" role="dialog" aria-label="Scene settings">
          <div className="settings-title">Scene Settings</div>
          <details className="settings-accordion" open>
            <summary>Cursor</summary>
            <label className="settings-row">
              <span>Hover Radius</span>
              <input
                type="number"
                step="0.001"
                value={radius}
                onChange={(event) => onRadiusChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Hover Strength</span>
              <input
                type="number"
                step="0.01"
                value={strength}
                onChange={(event) => onStrengthChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Drag Factor</span>
              <input
                type="number"
                step="0.001"
                value={dragFactor}
                onChange={(event) => onDragFactorChange(Number(event.target.value))}
              />
            </label>
          </details>
          <details className="settings-accordion">
            <summary>Halo</summary>
            <label className="settings-row">
              <span>Outer Osc Frequency</span>
              <input
                type="number"
                step="0.05"
                value={outerOscFrequency}
                onChange={(event) => onOuterOscFrequencyChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Outer Osc Strength</span>
              <input
                type="number"
                step="0.01"
                value={outerOscAmplitude}
                onChange={(event) => onOuterOscAmplitudeChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Radius Base</span>
              <input
                type="number"
                step="0.01"
                value={haloRadiusBase}
                onChange={(event) => onHaloRadiusBaseChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Radius Amplitude</span>
              <input
                type="number"
                step="0.01"
                value={haloRadiusAmplitude}
                onChange={(event) => onHaloRadiusAmplitudeChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Shape Amplitude</span>
              <input
                type="number"
                step="0.01"
                value={haloShapeAmplitude}
                onChange={(event) => onHaloShapeAmplitudeChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Rim Width</span>
              <input
                type="number"
                step="0.01"
                value={haloRimWidth}
                onChange={(event) => onHaloRimWidthChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Outer Start Offset</span>
              <input
                type="number"
                step="0.01"
                value={haloOuterStartOffset}
                onChange={(event) => onHaloOuterStartOffsetChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Outer End Offset</span>
              <input
                type="number"
                step="0.01"
                value={haloOuterEndOffset}
                onChange={(event) => onHaloOuterEndOffsetChange(Number(event.target.value))}
              />
            </label>
          </details>
          <details className="settings-accordion">
            <summary>Particles</summary>
            <label className="settings-row">
              <span>Base Size</span>
              <input
                type="number"
                step="0.001"
                value={particleBaseSize}
                onChange={(event) => onParticleBaseSizeChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Active Size</span>
              <input
                type="number"
                step="0.001"
                value={particleActiveSize}
                onChange={(event) => onParticleActiveSizeChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Blob Width</span>
              <input
                type="number"
                step="0.01"
                value={blobScaleX}
                onChange={(event) => onBlobScaleXChange(Number(event.target.value))}
              />
            </label>
            <label className="settings-row">
              <span>Blob Height</span>
              <input
                type="number"
                step="0.01"
                value={blobScaleY}
                onChange={(event) => onBlobScaleYChange(Number(event.target.value))}
              />
            </label>
          </details>
          <button
            className={`settings-save ${hasDirtyChanges ? "is-dirty" : "is-saved"}`}
            type="button"
            onClick={onSave}
          >
            Save
          </button>
          <button className="settings-reset" type="button" onClick={onReset}>
            Reset Defaults
          </button>
          <button className="settings-export" type="button" onClick={onExport}>
            Export
          </button>
        </div>
      )}
    </>
  );
};

export default SettingsMenu;
