import React, { useEffect, useState } from "react";
import toolsConfigurationList from "../../../utils/settings/all/config";
import tools from "../../../utils/settings/all/tools";

import settingActions from "../../../utils/settings/actions";

import { IoIosColorPalette } from "react-icons/io";

const ToolName = ({ children }) => {
  return (
    <div className=" text-start text-xs font-sm text-gray-600 py-1 italic">
      {children}
    </div>
  );
};

const Stylebar = ({ settings, settingsDispatcher }) => {
  const [show, setShow] = useState(0);
  const [config, setConfig] = useState([]);
  // console.log("settings in stylebar", settings);


  useEffect(() => {
    const tool = tools.find(t => t.name === settings.tool);
    setConfig(tool?.configs || []);
    // console.log("config updated to", tool);
  }, [settings.tool]);

  if (!config?.length) return null;
  return (
    <div className=" max-w-max m-0 ">
      <button className=" md:hidden" onClick={() => setShow((e) => !e)}><IoIosColorPalette className={"w-10 h-10 m-auto bg-white hover:bg-gray-300 p-2 border rounded-md " + (show ? " bg-gray-200 " : "")} /></button>
      <div className={" left-2 min-w-max max-md:min-w-max  max-md:fixed max-md:bottom-20 max-md:left-0  " + (show ? " " : "max-md:hidden")}>
        <div className="flex flex-col  bg-white justify-around border p-4 rounded-lg shadow-lg gap-2 ">
          {config?.includes("colors") &&
            (<div className="" title="color">
              <ToolName>{toolsConfigurationList.colors.name}</ToolName>
              <div className="flex flex-wrap  gap-0.5 items-center ">
                {toolsConfigurationList.colors.data.map((color, key) => {
                  return (
                    <button
                      key={key}
                      className={`w-7 h-7 p-0.5 border list-none rounded-md ${color === settings.color
                        ? "  border-indigo-900  "
                        : " "
                        }`}
                      onClick={() =>
                        settingsDispatcher({
                          type: settingActions.CHANGE_COLOR,
                          payload: color,
                        })
                      }
                    >
                      <div
                        style={{ backgroundColor: color }}
                        className="w-full h-full rounded-md"
                      ></div>
                    </button>
                  );
                })}

                <div className="w-8 h-8 mx-2 p-0.5 border list-none rounded-md ">
                  <input
                    type="color"
                    name="color"
                    id=""
                    value={settings.color}
                    onChange={(e) =>
                      settingsDispatcher({
                        type: settingActions.CHANGE_COLOR,
                        payload: e.target.value,
                      })
                    }
                    className="w-full h-full rounded-md cursor-pointer"
                  />
                </div>

              </div>
            </div>)
          }

          {config?.includes("background") &&
            (<div className="" title="Background">
              <ToolName>{toolsConfigurationList.background.name}</ToolName>
              <div className="flex flex-wrap  gap-0.5 items-center ">
                {toolsConfigurationList.background.data.map((color, key) => {
                  return (
                    <button
                      key={key}
                      className={`w-7 h-7 p-0.5 border list-none rounded-md ${color === settings.background
                        ? "  border-indigo-900  "
                        : " "
                        }`}
                      onClick={() =>
                        settingsDispatcher({
                          type: settingActions.CHANGE_BACKGROUND,
                          payload: color,
                        })
                      }
                    >
                      <div
                        style={{ backgroundColor: color }}
                        className="w-full h-full rounded-md"
                      ></div>
                    </button>
                  );
                })}

                <div className="w-8 h-8 mx-2 p-0.5 border list-none rounded-md ">
                  <input
                    type="color"
                    name="background-color"
                    id=""
                    value={settings.background}
                    onChange={(e) =>
                      settingsDispatcher({
                        type: settingActions.CHANGE_BACKGROUND,
                        payload: e.target.value,
                      })
                    }
                    className="w-full h-full rounded-md cursor-pointer"
                  />
                </div>

              </div>
            </div>)
          }

          {config?.includes("width") &&
            (<div title="Size">
              <ToolName>{toolsConfigurationList.width.name}</ToolName>
              <div className="flex flex-wrap  gap-0.5 items-center">
                {toolsConfigurationList.width.data.map((width, key) => {
                  return (
                    <button
                      key={key}
                      className={`w-7 h-7 p-0.5 border list-none rounded-md ${width === settings.strokeWidth
                        ? "  border-indigo-900  "
                        : " "
                        }`}
                      onClick={() =>
                        settingsDispatcher({
                          type: settingActions.CHNAGE_STROKE_WIDTH,
                          payload: width,
                        })
                      }
                    >
                      <div
                        style={{ width: "10px", height: width }}
                        className=" bg-black  m-auto items-center"
                      ></div>
                    </button>
                  );
                })}
              </div>
            </div>)
          }

          {config?.includes("fill") &&
            (<div className="" title="Stroke Fill">
              <ToolName>{toolsConfigurationList.fill.name}</ToolName>
              <select
                className=" px-4 py-2  selectField"
                name="strokefill"
                id=""
                onChange={(e) =>
                  settingsDispatcher({
                    type: settingActions.CHANGE_STROKE_FILL,
                    payload: e.target.value,
                  })
                }
              >
                <option value="">No Stroke</option>

                {toolsConfigurationList.fill.data.map((fillVal, key) => {
                  return (
                    <option key={key} value={fillVal} className=" text-sm text-gray-900">

                      {fillVal}

                    </option>
                  );
                })}
              </select>
            </div>)
          }

        </div>
      </div>
    </div>
  );
};

export default React.memo(Stylebar);
