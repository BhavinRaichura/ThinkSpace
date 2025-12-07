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
    
    const availableOperations = operationsRef.current.reduce((acc, op) => {
      acc[op.id] = op.isDeleted ? null : op;
      return acc;
    }, {});
    
    availableOperations && Object.values(availableOperations).filter(e => e).forEach((el) => drawElement(rc, el));

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
    const availableOperations = operationsRef.current.reduce((acc, op) => {
      acc[op.id] = op.isDeleted ? null : op;
      return acc;
    }, {});

    const ops = Object.values(availableOperations || {}).filter(e => e);

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
        const [x1, y1, x2, y2] = el.data;
        const threshold = 6;
        if (x >= x1-threshold && x <= x2+threshold && y1+threshold >= y && y1-threshold<=y) {
          return el;
        } else if (x >= x1-threshold && x <= x2+threshold && y2+4 >= y && y2-4<=y) {
          return el;
        } else if (y >= y1-threshold && y <= y2+threshold && x1+threshold >= x && x1-threshold<=x) {
          return el;
        } else if (y >= y1-threshold && y <= y2+threshold && x2+threshold>= x && x2-threshold<=x) {
          return el;
        }
      }

      // Circle
      if (el.tool === "Circle") {
        // check the point p(x,y) is near the ellipse boundary
        const [x1, y1, x2, y2] = el.data;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = Math.abs((x2 - x1) / 2);
        const ry = Math.abs((y2 - y1) / 2);
        const distX = x - cx;
        const distY = y - cy;
        const value = ((distX * distX) / (rx * rx)) + ((distY * distY) / (ry * ry));
        const boundary = 1;
        const threshold = 0.2; // Adjust this value for sensitivity
        
        if (Math.abs(value - boundary) < threshold) {
          return el;
        }
      }

      // Line
      if (el.tool === "Line") {
        const [x1, y1, x2, y2] = el.data;
        const threshold = 6;
        
        // Calculate distance from point to line segment
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;

        if (param < 0) {
          xx = x1;
          yy = y1;
        } else if (param > 1) {
          xx = x2;
          yy = y2;
        } else {
          xx = x1 + param * C;
          yy = y1 + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;
        const distance = Math.hypot(dx, dy);

        if (distance < threshold) {
          return el;
        }
      }
    }

    return null;
  }
  // -----------------------------------------------------
  // DELETE SELECTED ELEMENT
  // -----------------------------------------------------
  function eraserElement(x, y) {
    // find the topmost element under the (x, y) point
    const result = hitTest(x, y);
    // mark it as deleted
    if (result && settingsRef.current.tool === "Eraser") {
      const entry = JSON.parse(JSON.stringify(result));
      entry.isDeleted = true;
      operationsRef.current.push(entry);
      redrawCanvas();
    }
  }

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

    if (tool === "Pen") {
      pathRef.current = [[x, y]];
    } else if(tool === "Eraser") {
      eraserElement(x, y);
    } else {
      pathRef.current = [x, y, x, y];
    }

    redrawCanvas();
  }

  function handlePointerMove(x, y) {
    if (!drawingRef.current) return;
    const tool = settingsRef.current.tool;

    if (tool === "Pen") {
      pathRef.current.push([x, y]);
    } else if(tool === "Eraser") {
      eraserElement(x, y);
    }  else {
      pathRef.current[2] = x;
      pathRef.current[3] = y;
    }

    redrawCanvas();
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;

    drawingRef.current = false;
    if(settingsRef.current.tool === "Eraser") {
      return;
    }

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
