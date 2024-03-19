import React, { useEffect, useState } from "react";
import settingActions from '../../../utils/settings/actions'

import tools from "../../../utils/settings/all/tools";


const Toolbar = ({ settings, settingsDispatcher}) => {
  const [activeToolId, setActiveToolId] = useState(1);

  useEffect(()=>{
    // Set the active tool by keypress
    const keyPressHandler =(e)=>{
      let keyCode = e.keyCode-49
      if(keyCode>=0 && keyCode<5) {
        setActiveToolId(keyCode+1)
        settingsDispatcher({type:settingActions.CHANGE_TOOL, payload:tools[keyCode].name})
      }
    }
    document.addEventListener("keypress", keyPressHandler )
    return (()=>document.removeEventListener('keypress', keyPressHandler))
  },[settingsDispatcher])

  return (
    <div className=" z-50  w-max bg-white shadow-lg m-auto rounded-lg h-14 p-2 box-border">
      <div className="flex gap-2 h-full items-center">
        {tools.map((tool, key) => (
            <button key={key} 
                className={`w-10 h-10 border bg-slate-800 rounded-lg hover:bg-gray-100 ${activeToolId===tool.id ? " border-indigo-900" : ""} `}
                type="button" 
                title={tool.name}
                onClick={()=>{
                  setActiveToolId(tool.id)
                  settingsDispatcher({type:settingActions.CHANGE_TOOL, payload:tool.name})
                }}
            >
              {activeToolId===tool.id ? tool.iconFill : tool.icon}
            </button>
          
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
