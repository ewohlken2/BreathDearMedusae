import { useState } from "react";

const getValue = (source, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], source);

const SettingsMenu = ({
  settings,
  schema,
  onChange,
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
          {schema.map((section, index) => (
            <details
              className="settings-accordion"
              key={section.id}
              open={index === 0}
            >
              <summary>{section.label}</summary>
              {section.fields.map((field) => (
                <label className="settings-row" key={field.path}>
                  <span>{field.label}</span>
                  <input
                    type="number"
                    step={field.step}
                    value={getValue(settings, field.path)}
                    onChange={(event) =>
                      onChange(field.path, Number(event.target.value))
                    }
                  />
                </label>
              ))}
            </details>
          ))}
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
