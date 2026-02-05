import { useState } from "react";
import { ChromePicker } from "react-color";
import * as Popover from "@radix-ui/react-popover";

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
  const [openColorField, setOpenColorField] = useState(null);

  const handleToggleColor = (path) => {
    setOpenColorField((prev) => (prev === path ? null : path));
  };

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
              {section.fields.map((field) => {
                if (field.type === "color") {
                  const colorValue = getValue(settings, field.path);
                  const isOpen = openColorField === field.path;

                  return (
                    <label
                      className="settings-row settings-color-row"
                      key={field.path}
                    >
                      <span>{field.label}</span>
                      <Popover.Root
                        open={isOpen}
                        onOpenChange={(nextOpen) =>
                          setOpenColorField(nextOpen ? field.path : null)
                        }
                      >
                        <Popover.Trigger asChild>
                          <button
                            className="settings-color-swatch"
                            style={{ backgroundColor: colorValue }}
                            type="button"
                            aria-label={`${field.label} color`}
                            onClick={() => handleToggleColor(field.path)}
                          />
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Content
                            className="settings-color-popover"
                            side="bottom"
                            sideOffset={8}
                            align="end"
                          >
                            <ChromePicker
                              color={colorValue}
                              onChange={(color) =>
                                onChange(field.path, color.hex)
                              }
                            />
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    </label>
                  );
                }

                return (
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
                );
              })}
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
