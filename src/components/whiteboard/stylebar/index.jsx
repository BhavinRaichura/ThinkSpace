import React, { useState } from "react";
import toolConfig from "../../../utils/settings/all/config";

import settingActions from "../../../utils/settings/actions";

import { IoIosColorPalette } from "react-icons/io";

const Stylebar = ({ settings, settingsDispatcher }) => {
  const [show, setShow] = useState(0);

  
    return (
      <div className=" max-w-max m-auto">
        <button className=" md:hidden" onClick={() => setShow((e) => !e)}><IoIosColorPalette className={"w-10 h-10 m-auto bg-white hover:bg-gray-300 p-2 border rounded-md " + (show ? " bg-gray-200 ": "")} /></button>
          <div className={" min-w-max max-md:w-full p-5 max-md:fixed max-md:bottom-20 max-md:left-0  " + (show ? " " : "max-md:hidden") }>
            <div className="flex flex-col  bg-white justify-around border p-4 rounded-lg shadow-lg gap-5 ">
              <div className="" title="color">
                <h1 className=" py-2 text-base font-normal">Color </h1>
                <div className="flex flex-wrap  gap-0.5 items-center ">
                  {toolConfig.colors.data.map((color, key) => {
                    return (
                      <button
                        key={key}
                        className={`w-7 h-7 p-0.5 border list-none rounded-md ${
                          color === settings.color
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
              </div>

              <div className="" title="Background">
                <h1 className=" py-2 text-base font-normal">Background</h1>
                <div className="flex flex-wrap  gap-0.5 items-center ">
                  {toolConfig.background.data.map((color, key) => {
                    return (
                      <button
                        key={key}
                        className={`w-7 h-7 p-0.5 border list-none rounded-md ${
                          color === settings.background
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
              </div>

              <div title="Size">
                <h1 className=" py-2 text-base font-normal">Size</h1>
                <div className="flex flex-wrap  gap-0.5 items-center">
                  {toolConfig.width.data.map((width, key) => {
                    return (
                      <button
                        key={key}
                        className={`w-7 h-7 p-0.5 border list-none rounded-md ${
                          width === settings.strokeWidth
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
              </div>

              <div className="" title="Stroke Fill">
                <h1 className=" py-2 text-base font-normal">Stroke Fill</h1>
                <select
                  className=" px-4 py-2"
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

                  {toolConfig.fill.data.map((fillVal, key) => {
                    return (
                      <option key={key} value={fillVal}>
                        <span className=" text-sm text-gray-900">
                          {fillVal}
                        </span>
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        
      </div>
    );
  

 
  
};

export default Stylebar;
