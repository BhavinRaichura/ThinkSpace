import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";

import Toolbar from "./toolbar";
import Stylebar from "./stylebar";
import Canvas from "./canvas";

import initialSettings from "../../utils/settings/state";
import settingActions from "../../utils/settings/actions";

import { LuUndo2, LuRedo2 } from "react-icons/lu";
import Svg from "./svg";

const reducer = (state, action) => {
  switch (action.type) {
    case settingActions.CHANGE_TOOL:
      return { ...state, tool: action.payload };
    case settingActions.CHANGE_COLOR:
      return { ...state, color: action.payload };
    case settingActions.CHANGE_BACKGROUND:
      return { ...state, background: action.payload };
    case settingActions.CHANGE_STROKE_FILL:
      return { ...state, strokeFill: action.payload };
    case settingActions.CHNAGE_STROKE_WIDTH:
      return { ...state, strokeWidth: action.payload };
    case action.CHNAGE_STROKE_STYLE:
      return { ...state, strokeStyle: action.payload };
    default:
      return state;
  }
};

const Whiteboard = () => {
  const { roomId } = useParams();
  const [settings, settingsDispatcher] = useReducer(reducer, initialSettings);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const boardRef = useRef(null);
  const [operations, setOperations] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem(`room-${roomId}`);
    if (!data) return;
    const parsedData = JSON.parse(data);
    setOperations(parsedData);
    /*return () => {
      //localStorage.removeItem(`room-${roomId}`);
    };*/
  }, []);

  useEffect(() => {
    if (operations.length > 0)
      localStorage.setItem(`room-${roomId}`, JSON.stringify(operations));
    //return ()=>localStorage.setItem(`room-${roomId}`, JSON.stringify(operations));
  }, [operations, roomId]);

  const undoHandler = useCallback(() => {
    if (operations.length > 0) {
      let lastAction = JSON.parse(
        JSON.stringify(operations[operations.length - 1])
      );
      setHistory((prev) => [...prev, lastAction]);
      setOperations((prev) => prev.slice(0, prev.length - 1));
    }
  }, [operations]);

  const redoHandler = useCallback(() => {
    if (history.length > 0) {
      let lastAction = JSON.parse(JSON.stringify(history[history.length - 1]));
      setOperations((prev) => [...prev, lastAction]);
      setHistory((prev) => prev.slice(0, prev.length - 1));
    }
  }, [history]);

  useEffect(() => {
    const handleUndoRedo = (event) => {
      if (event.ctrlKey && event.keyCode === 90) {
        undoHandler();
      } else if (event.ctrlKey && event.keyCode === 89) {
        redoHandler();
      }
    };
    document.addEventListener("keyup", handleUndoRedo);
    return () => document.removeEventListener("keyup", handleUndoRedo);
  }, [undoHandler, redoHandler]);

  return (
    <div ref={boardRef} className="">
      {/*<Svg
        settings={settings}
        operations={operations}
        setOperations={setOperations}
        canvasRef={canvasRef}
        ctxRef={ctxRef}
      />*/}
      <Canvas 
      
        settings={settings}
        operations={operations}
        setOperations={setOperations}
        canvasRef={canvasRef}
        ctxRef={ctxRef}
      />
      <div className="fixed top-5 w-screen  ">
        <Toolbar settings={settings} settingsDispatcher={settingsDispatcher} />
      </div>
      <div className="  fixed grid grid-flow-row max-md:grid-flow-col grid-cols-3 max-md:backdrop-blur-md max-md:w-full md:top-20 max-md:bottom-5 p-2  max-md:justify-around">
        <div className="  col-span-3 max-md:col-span-1">
          <Stylebar
            settings={settings}
            settingsDispatcher={settingsDispatcher}
          />
        </div>

        <div className=" col-span-3 max-md:col-span-2 flex justify-around">
          <button onClick={undoHandler} type="button" className="  ">
            <LuUndo2
              className={
                "w-10 h-10 m-auto p-2 border bg-white rounded-md hover:bg-gray-300 active:bg-gray-400 "
              }
            />
          </button>
          <button onClick={redoHandler} type="button" className="">
            <LuRedo2
              className={
                "w-10 h-10 p-2 m-auto border bg-white rounded-md hover:bg-gray-300 active:bg-gray-400 "
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
