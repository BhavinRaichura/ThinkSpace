import React, { useEffect, useRef } from "react";
import rough from "roughjs";
import { v4 as uuidv4 } from "uuid";




const generator = rough.generator();

export default function Canvas({
  canvasRef,
  ctxRef,
  settings,
  operationsRef,
  pushOperation,
}) {

  // // console.log("Canvas render");
  const drawingRef = useRef(false);
  const pathRef = useRef([]);
  const settingsRef = useRef(settings);
  const selectedRef = useRef(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    canvasRef.current.deleteSelected = deleteSelected;
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    if (!operationsRef.current) operationsRef.current = [];

    redrawCanvas();
  }, [operationsRef.current.length]);

  // -----------------------------------------------------
  // DRAW SINGLE SHAPE
  // -----------------------------------------------------
  function drawElement(rc, element) {
    const { tool, color, strokeWidth, background, strokeFill, data } = element;

    if (tool === "Pen") {
      rc.linearPath(data, {
        stroke: color,
        strokeWidth,
        roughness: 0.01,
      });
    } else if (tool === "Rectangle") {
      const [x1, y1, x2, y2] = data;
      const w = x2 - x1;
      const h = y2 - y1;
      rc.draw(
        generator.rectangle(x1, y1, w, h, {
          stroke: color,
          strokeWidth,
          fill: background,
          fillStyle: strokeFill,
          roughness: 0.01,
        })
      );
    } else if (tool === "Circle") {
      const [x1, y1, x2, y2] = data;
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const w = x2 - x1;
      const h = y2 - y1;

      rc.draw(
        generator.ellipse(cx, cy, w, h, {
          stroke: color,
          strokeWidth,
          fill: background,
          fillStyle: strokeFill,
          roughness: 0.01,
        })
      );
    } else if (tool === "Line") {
      rc.draw(
        generator.line(...data, {
          stroke: color,
          strokeWidth,
          roughness: 0.01,
        })
      );
    } else if (tool === "Eraser") {
      rc.linearPath(data, {
        stroke: "#ffffff",
        strokeWidth: 50,
        roughness: 0.01,
      });
    }
  }

  // -----------------------------------------------------
  // REDRAW CANVAS
  // -----------------------------------------------------
  function redrawCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const rc = rough.canvas(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    operationsRef.current && operationsRef.current.forEach((el) => drawElement(rc, el));

    // preview
    if (drawingRef.current && pathRef.current.length > 0) {
      drawElement(rc, {
        ...settingsRef.current,
        data: pathRef.current,
      });
    }

    // Highlight selected shape
    if (selectedRef.current) drawSelectionOutline(selectedRef.current);
  }

  // -----------------------------------------------------
  // DRAW SELECTION OUTLINE
  // -----------------------------------------------------
  function drawSelectionOutline(el) {
    const ctx = ctxRef.current;

    ctx.save();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1.5;

    if (el.tool === "Rectangle") {
      const [x1, y1, x2, y2] = el.data;
      ctx.strokeRect(x1 - 8, y1 - 8, x2 - x1 + 16, y2 - y1 + 16);
    }

    if (el.tool === "Circle") {
      const [x1, y1, x2, y2] = el.data;
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const rx = Math.abs((x2 - x1) / 2) + 8;
      const ry = Math.abs((y2 - y1) / 2) + 8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (el.tool === "Line") {
      const [x1, y1, x2, y2] = el.data;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    if (el.tool === "Pen") {
      ctx.beginPath();
      el.data.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    ctx.restore();
  }

  // -----------------------------------------------------
  // HIT TEST (detect clicked element)
  // -----------------------------------------------------
  function hitTest(x, y) {
    const ops = operationsRef.current;

    for (let i = ops.length - 1; i >= 0; i--) {
      const el = ops[i];

      // Pen: check nearby points
      if (el.tool === "Pen") {
        for (let [px, py] of el.data) {
          if (Math.hypot(px - x, py - y) < 6) return el;
        }
      }

      // Rectangle
      if (el.tool === "Rectangle") {
        const [x1, y1, w, h] = el.data;
        // // console.log("rect", el);
        if (x >= x1 && x <= x1 + w && y >= y1 && y <= y1 + h) {
          return el;
        }
      }

      // Circle
      if (el.tool === "Circle") {
        const [x1, y1, x2, y2] = el.data;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = Math.abs((x2 - x1) / 2);
        const ry = Math.abs((y2 - y1) / 2);

        const dx = (x - cx) ** 2 / (rx ** 2);
        const dy = (y - cy) ** 2 / (ry ** 2);
        if (dx + dy <= 1) return el;
      }

      // Line
      if (el.tool === "Line") {
        const [x1, y1, x2, y2] = el.data;

        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = dot / lenSq;

        if (param >= 0 && param <= 1) {
          const xx = x1 + param * C;
          const yy = y1 + param * D;
          if (Math.hypot(x - xx, y - yy) < 6) return el;
        }
      }
    }

    return null;
  }
  // -----------------------------------------------------
  // DELETE SELECTED ELEMENT
  // -----------------------------------------------------
  function deleteSelected() {
    if (!selectedRef.current) return;

    const id = selectedRef.current.id;

    operationsRef.current = operationsRef.current.filter(
      (el) => el.id !== id
    );

    selectedRef.current = null;
    redrawCanvas();
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // -----------------------------------------------------
  // MOUSE EVENTS
  // -----------------------------------------------------
  // const handleMouseDown = (e) => {
  //   const { layerX, layerY } = e.nativeEvent;

  //   // SELECT tool
  //   if (settingsRef.current.tool === "Select") {
  //     selectedRef.current = hitTest(layerX, layerY);
  //     redrawCanvas();
  //     return;
  //   }

  //   drawingRef.current = true;
  //   selectedRef.current = null;

  //   if (
  //     settingsRef.current.tool === "Pen" ||
  //     settingsRef.current.tool === "Eraser"
  //   ) {
  //     pathRef.current = [[layerX, layerY]];
  //   } else {
  //     pathRef.current = [layerX, layerY, layerX, layerY];
  //   }

  //   redrawCanvas();
  // };

  // const handleMouseMove = (e) => {
  //   if (!drawingRef.current) return;

  //   const { layerX, layerY } = e.nativeEvent;
  //   const tool = settingsRef.current.tool;

  //   if (tool === "Pen" || tool === "Eraser") {
  //     pathRef.current.push([layerX, layerY]);
  //   } else {
  //     pathRef.current[2] = layerX;
  //     pathRef.current[3] = layerY;
  //   }

  //   redrawCanvas();
  // };

  // const handleMouseUp = () => {
  //   if (!drawingRef.current) return;
  //   drawingRef.current = false;

  //   pushOperation({
  //     id: uuidv4(),
  //     tool: settingsRef.current.tool,
  //     data: [...pathRef.current],
  //     color: settingsRef.current.color,
  //     strokeWidth: settingsRef.current.strokeWidth,
  //     strokeFill: settingsRef.current.strokeFill,
  //     background: settingsRef.current.background,
  //   });

  //   pathRef.current = [];
  //   redrawCanvas();
  // };

  // -----------------------------------------------------
  // TOUCH EVENTS
  // -----------------------------------------------------

  function getTouchPos(canvas, touchEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  }

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length > 1) return; // ignore multi-touch

    const pos = getTouchPos(canvasRef.current, e);
    handlePointerDown(pos.x, pos.y);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length > 1) return;

    const pos = getTouchPos(canvasRef.current, e);
    handlePointerMove(pos.x, pos.y);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handlePointerUp();
  };

  function handlePointerDown(x, y) {
    const tool = settingsRef.current.tool;

    if (tool === "Select") {
      selectedRef.current = hitTest(x, y);
      redrawCanvas();
      return;
    }

    selectedRef.current = null;
    drawingRef.current = true;

    if (tool === "Pen" || tool === "Eraser") {
      pathRef.current = [[x, y]];
    } else {
      pathRef.current = [x, y, x, y];
    }

    redrawCanvas();
  }

  function handlePointerMove(x, y) {
    if (!drawingRef.current) return;
    const tool = settingsRef.current.tool;

    if (tool === "Pen" || tool === "Eraser") {
      pathRef.current.push([x, y]);
    } else {
      pathRef.current[2] = x;
      pathRef.current[3] = y;
    }

    redrawCanvas();
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;

    drawingRef.current = false;

    pushOperation({
      id: uuidv4(),
      tool: settingsRef.current.tool,
      data: [...pathRef.current],
      color: settingsRef.current.color,
      strokeWidth: settingsRef.current.strokeWidth,
      strokeFill: settingsRef.current.strokeFill,
      background: settingsRef.current.background,
    });

    pathRef.current = [];
    redrawCanvas();
  }

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={(e) => handlePointerDown(e.nativeEvent.layerX, e.nativeEvent.layerY)}
      onMouseMove={(e) => handlePointerMove(e.nativeEvent.layerX, e.nativeEvent.layerY)}
      onMouseUp={handlePointerUp}

      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}

      className="touch-none cursor-crosshair"  
    />

  );
}
