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
import { AiOutlineClear } from "react-icons/ai";

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
    default:
      return state;
  }
};

const Whiteboard = () => {
  const { roomId } = useParams();

  const [settings, settingsDispatcher] = useReducer(reducer, initialSettings);

  // optimized refs for operations (no re-render on drawing)
  const operationsRef = useRef([]);
  const historyRef = useRef([]);

  // only used to re-render UI if needed
  const [, setVersion] = useState(0);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // Load existing room data
 // Whiteboard.jsx (or wherever you load from localStorage)
useEffect(() => {
  const raw = localStorage.getItem(`room-${roomId}`);
  if (!raw) {
    operationsRef.current = [];
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    // If you used { updatedAt, data } format
    if (parsed && Array.isArray(parsed.data)) {
      operationsRef.current = parsed.data;
    } else if (Array.isArray(parsed)) {
      // old format: stored array directly
      operationsRef.current = parsed;
    } else {
      // corrupted / unexpected format: reset to empty array
      console.warn("Unexpected room data format — resetting operations for", roomId, parsed);
      operationsRef.current = [];
      localStorage.removeItem(`room-${roomId}`);
    }
  } catch (err) {
    console.error("Failed parsing localStorage for room:", roomId, err);
    operationsRef.current = [];
    localStorage.removeItem(`room-${roomId}`);
  }
}, [roomId]);


  const deleteSelected = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.deleteSelected?.();
  }, []);


  // Save changes (only when operations change)
  const saveState = useCallback(() => {
    if(operationsRef.current === null || !Array.isArray(operationsRef.current)) return;
    localStorage.setItem(
      `room-${roomId}`,
      JSON.stringify({
        updatedAt: Date.now(),
        data: operationsRef.current || [],
      })
    );
  }, [roomId]);

  // Used by Canvas to notify about updates
  const pushOperation = useCallback(
    (op) => {
      operationsRef.current.push(op);
      saveState();
      setVersion((v) => v + 1); // re-render Toolbar/Stylebar if needed
    },
    [saveState]
  );

  const undoHandler = useCallback(() => {
    if (operationsRef.current.length === 0) return;

    const last = operationsRef.current.pop();
    historyRef.current.push(last);

    saveState();
    setVersion((v) => v + 1); // only Toolbar/Stylebar update
  }, [saveState]);

  const redoHandler = useCallback(() => {
    if (historyRef.current.length === 0) return;

    const last = historyRef.current.pop();
    operationsRef.current.push(last);

    saveState();
    setVersion((v) => v + 1);
  }, [saveState]);

  const clearHandler = useCallback(() => {
    if (operationsRef.current.length === 0) return;

    historyRef.current.push(...operationsRef.current);
    operationsRef.current = [];

    saveState();
    setVersion((v) => v + 1);
  }, [saveState]);

  // keyboard shortcuts
  useEffect(() => {
    function handleUndoRedo(e) {
      if (e.ctrlKey && e.key === "z") undoHandler();
      else if (e.ctrlKey && e.key === "y") redoHandler();
    }
    document.addEventListener("keydown", handleUndoRedo);
    return () => document.removeEventListener("keydown", handleUndoRedo);
  }, [undoHandler, redoHandler]);

  return (
    <div>
      <Canvas
        settings={settings}
        operationsRef={operationsRef}
        pushOperation={pushOperation}
        canvasRef={canvasRef}
        ctxRef={ctxRef}
      />

      {/* TOOLBAR */}
      <div className="fixed top-5 items-center w-full">
        <Toolbar
          settings={settings}
          settingsDispatcher={settingsDispatcher}
          deleteSelected={deleteSelected}
        />

      </div>

      {/* STYLEBAR + UNDO/REDO */}
      <div className="fixed grid grid-flow-row max-md:grid-flow-col grid-cols-3 
          max-md:w-full md:top-20 max-md:bottom-5 p-2">

        <div className="col-span-3 max-md:col-span-1">
          <Stylebar settings={settings} settingsDispatcher={settingsDispatcher} />
        </div>

        <div className="col-span-3 max-md:col-span-2 flex justify-around z-0">
          <button onClick={undoHandler}>
            <LuUndo2 className="w-10 h-10 p-2 bg-white border rounded-md" />
          </button>

          <button onClick={clearHandler}>
            <AiOutlineClear className="w-10 h-10 p-2 bg-white border rounded-md" />
          </button>

          <button onClick={redoHandler}>
            <LuRedo2 className="w-10 h-10 p-2 bg-white border rounded-md" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
