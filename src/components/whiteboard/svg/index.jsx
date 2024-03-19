import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import rough from "roughjs";

const Svg = ({ canvasRef, ctxRef, settings, operations, setOperations }) => {
  const [drawing, setDrawing] = useState(0);
  const [path, setPath] = useState([]);
  const [drawStarted, setDrawStarted] = useState(0);

  const draw = useCallback(
    ({ tool, color, strokeWidth, background, strokeFill, data }) => {
      const svg = canvasRef.current;
      const rc = rough.svg(canvasRef.current);
      let ele;
      if (tool === "Pen") {
        ele = rc.linearPath(data, {
          stroke: color,
          strokeWidth: strokeWidth,
          roughness: 0.3,
        });
      } else if (tool === "Rectangle") {
        ele = rc.rectangle(...data, {
          stroke: color,
          strokeWidth: strokeWidth,
          roughness: 0.3,
          fill: background,
          fillStyle: strokeFill,
        });
      } else if (tool === "Circle") {
        let cr = data;
        ele = rc.ellipse(
          (cr[2] + cr[0]) / 2,
          (cr[3] + cr[1]) / 2,
          cr[2] - cr[0],
          cr[3] - cr[1],
          {
            stroke: color,
            strokeWidth: strokeWidth,
            roughness: 0.3,
            fill: background,
            fillStyle: strokeFill,
          }
        );
      } else if (tool === "Eraser") {
        ele = rc.linearPath(data, {
          stroke: "#ffffff",
          strokeWidth: 50,
          roughness: 0.3,
        });
      } else if (tool === "Line") {
        ele = rc.line(...data, {
          stroke: color,
          strokeWidth: strokeWidth,
          roughness: 0.3,
        });
      }

      svg.appendChild(ele);
    },
    [canvasRef]
  );

  function handlePathChange(x, y, tool) {
    // clear whiteboard
    const svg = canvasRef.current;
    if (drawStarted) svg.removeChild(svg.children[svg.children.length - 1]);
    else setDrawStarted(1);

    if (tool === "Pen" || tool === "Eraser") {
      setPath((e) => [...e, [x, y]]);
      draw({ ...settings, data: path });
    } else if (tool === "Rectangle") {
      setPath((e) => {
        let arr = e;
        if (arr.length < 2) {
          arr[0] = x;
          arr[1] = y;
        } else {
          arr[2] = x - arr[0];
          arr[3] = y - arr[1];
          draw({ ...settings, data: arr });
        }
        return arr;
      });
    } else if (tool === "Circle" || tool === "Line") {
      setPath((e) => {
        let arr = e;
        if (arr.length < 2) {
          arr[0] = x;
          arr[1] = y;
        } else {
          arr[2] = x;
          arr[3] = y;
          draw({ ...settings, data: arr });
        }
        return arr;
      });
    }
  }

  useLayoutEffect(() => {
    function removeAllChild() {
      let svg = canvasRef.current;
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
    }
    removeAllChild();
    operations.forEach((element) => {
      draw(element);
    });
  }, [operations, canvasRef, draw]);

  

  // mouse event handlers
  const handleMouseDown = (e) => {
    const { layerX, layerY } = e.nativeEvent;
    setDrawing(1);
    handlePathChange(layerX, layerY, settings.tool);
  };
  const handleMouseMove = (e) => {
    if (drawing) {
      const { layerX, layerY } = e.nativeEvent;
      handlePathChange(layerX, layerY, settings.tool);
    }
  };
  const handleMouseUp = (e) => {
    const { layerX, layerY } = e.nativeEvent;
    setDrawing(0);
    handlePathChange(layerX, layerY, settings.tool);
    setOperations((prevOp) => [
      ...prevOp,
      {
        tool: settings.tool,
        data: path,
        color: settings.color,
        strokeWidth: settings.strokeWidth,
        strokeFill: settings.strokeFill,
        fillStyle: "",
        background: settings.background,
      },
    ]);
    setPath([]);
    setDrawStarted(0);
  };

  // touch events handler
  const handleTouchStart = (e) => {
    e.preventDefault();
    const { pageX, pageY } = e.targetTouches[0];
    setDrawing(1);
    handlePathChange(pageX, pageY, settings.tool);
  };
  const handleTouchMove = (e) => {
    if (drawing) {
      e.preventDefault();
      const { pageX, pageY } = e.targetTouches[0];
      handlePathChange(pageX, pageY, settings.tool);
    }
  };
  const handleTouchEnd = (e) => {
    if (drawing) {
      setDrawing(0);
      setOperations((prevOp) => [
        ...prevOp,
        {
          tool: settings.tool,
          data: path,
          color: settings.color,
          strokeWidth: settings.strokeWidth,
          strokeFill: settings.strokeFill,
          fillStyle: "",
          background: settings.background,
        },
      ]);
      setPath([]);
      setDrawStarted(0);
    }
  };

  return (
    <svg
      ref={canvasRef}
      className={
        " z-20 bg-white  " +
        (settings.tool === "Eraser" ? " cursor-grabbing" : "cursor-crosshair")
      }
      id="myCanvas"
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    ></svg>
  );
};

export default Svg;
