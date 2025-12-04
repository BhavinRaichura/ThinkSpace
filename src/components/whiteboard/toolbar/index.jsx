import React, { useEffect, useState } from "react";
import settingActions from "../../../utils/settings/actions";
import tools from "../../../utils/settings/all/tools";

const Toolbar = ({ settings, settingsDispatcher, deleteSelected }) => {
  const [activeToolId, setActiveToolId] = useState(0);

  useEffect(() => {
    const keyPressHandler = (e) => {
      let idx = e.keyCode - 49;

      if (idx >= 0 && idx < tools.length) {
        const tool = tools[idx];
        
        if (tool.name === "Delete") {
          deleteSelected();
          return;
        }

        setActiveToolId(tool.id);
        settingsDispatcher({
          type: settingActions.CHANGE_TOOL,
          payload: tool.name,
        });
      }
    };

    document.addEventListener("keypress", keyPressHandler);
    return () => document.removeEventListener("keypress", keyPressHandler);
  }, [settingsDispatcher, deleteSelected]);

  return (
    <div className="z-50 w-max shadow-lg m-auto rounded-lg h-14 p-2">
      <div className="flex gap-2 h-full items-center">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`w-10 h-10 border bg-white rounded-lg ${
              activeToolId === tool.id ? "border-indigo-900" : ""
            }`}
            title={tool.name}
            onClick={() => {
              if (tool.name === "Delete") {
                deleteSelected();
              } else {
                setActiveToolId(tool.id);
                settingsDispatcher({
                  type: settingActions.CHANGE_TOOL,
                  payload: tool.name,
                });
              }
            }}
          >
            {activeToolId === tool.id ? tool.iconFill : tool.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
