import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import rough from 'roughjs'

const generator  = rough.generator()


const Canvas = ({canvasRef, ctxRef, settings, operations, setOperations}) => {

  const [drawing, setDrawing ] = useState(0);
  const [path, setPath ] = useState([]);

  const draw = useCallback(({tool, color, strokeWidth, background, strokeFill, data})=>{
    const roughCanvas = rough.canvas(canvasRef.current)
    if(tool==="Pen"){
      roughCanvas.linearPath(data,{stroke:color, strokeWidth:strokeWidth, roughness:0.5, })
    } else if(tool==="Rectangle"){
      roughCanvas.draw(
        generator.rectangle(...data,{stroke:color, strokeWidth:strokeWidth, roughness:0.5,  fill: background, fillStyle:strokeFill })
      )
    } else if(tool==="Circle"){
      let cr = data
      roughCanvas.draw(
        generator.ellipse( (cr[2]+cr[0])/2, (cr[3]+cr[1])/2, cr[2]-cr[0], cr[3]-cr[1],{stroke:color, strokeWidth:strokeWidth, roughness:0.5,  fill: background, fillStyle:strokeFill })
      )
    } else if(tool==="Eraser"){
      roughCanvas.linearPath(data,{stroke:"#ffffff", strokeWidth:50, roughness:0.5, })
    } else if(tool==="Line"){
      roughCanvas.draw(
        generator.line(...data,{stroke:color, strokeWidth:strokeWidth, roughness:0.5, })
      )
    }
  },[canvasRef])

  function handlePathChange(x,y,tool){
    // clear whiteboard
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white"
    ctx.clearRect(0,0,canvas.width,canvas.height);

    console.log("ctx: ", canvas)

    // render previous elements
    operations.forEach((element)=>{
      draw(element)
    })
    // setting current element's path    
    if(tool==="Pen"){
      setPath((e)=> [...e ,[x, y]])
      draw({...settings, data:path})
    } else if(tool==="Rectangle"){
      setPath((e)=> {
        let arr = e;
        if(arr.length<2){
          arr[0]=x;
          arr[1]=y;
        }else{
          arr[2] = (x-arr[0])
          arr[3] = (y-arr[1])
          draw({...settings, data:arr})
        }
        return arr
      })
    } else if(tool==="Circle"){
      setPath((e)=> {
        let arr = e;
        if(arr.length<2){
          arr[0]=x;
          arr[1]=y;
        }else{
          arr[2] = x
          arr[3] = y
          draw({...settings, data:arr})
        }
        return arr
      })
    } else if(tool==="Eraser"){
      setPath((e)=> [...e ,[x, y]])
      draw({...settings, data:path})
    } else if(tool==="Line"){
      setPath((e)=> {
        let arr = e;
        if(arr.length<2){
          arr[0]=x;
          arr[1]=y;
        }else{
          arr[2] = x
          arr[3] = y
          draw({...settings, data:arr})
        }
        //console.log("chnage line: ")
        return arr
      })
    }
  }

  useEffect(()=>{
    let canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    ctx.fillRect = "white"
    ctx.clearRect(0,0,canvas.width,canvas.height);
  },[])

  useLayoutEffect(()=>{
    draw({tool:settings.tool, data:path, ...settings});
  },[path,draw,settings])
  
  useLayoutEffect(()=>{
    // clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white"
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // render elements
    operations.forEach((element)=>{
      draw(element)
    })
    
  }, [operations,canvasRef,draw]);

  


  // mouse event handlers
  const handleMouseDown = (e) => {
    const {layerX, layerY} = e.nativeEvent;
    setDrawing(1);
    handlePathChange(layerX, layerY, settings.tool)
  }
  const handleMouseMove = (e) =>{
    if(drawing){
      const {layerX, layerY} = e.nativeEvent;
      handlePathChange(layerX, layerY, settings.tool)
    }
  }
  const handleMouseUp = (e) =>{
    const  {layerX, layerY} = e.nativeEvent;
    setDrawing(0)
    handlePathChange(layerX, layerY, settings.tool)
    setOperations(prevOp => [...prevOp, {"tool": settings.tool, "data":path,  "color":settings.color, strokeWidth:settings.strokeWidth, strokeFill:settings.strokeFill, fillStyle:"", background:settings.background }] )
    setPath([])
  }


  

  // touch events handler
  const handleTouchStart = (e) => {
    e.preventDefault()
    const {pageX, pageY} = e.targetTouches[0];
    setDrawing(1);
    handlePathChange(pageX, pageY, settings.tool)
  }
  const handleTouchMove = (e) =>{
    if(drawing){
      e.preventDefault()
      const {pageX, pageY} = e.targetTouches[0];
      handlePathChange(pageX, pageY, settings.tool)
    }
  }
  const handleTouchEnd = (e) =>{
    if(drawing){
      setDrawing(0)
      setOperations(prevOp => [...prevOp, {"tool": settings.tool, "data":path,  "color":settings.color, strokeWidth:settings.strokeWidth, strokeFill:settings.strokeFill, fillStyle:"", background:settings.background }] )
      setPath([])
    }
  }
  
  return (
    
    <canvas  
    ref={canvasRef} 
      className={' z-20 bg-white  cursor-crosshair' } 
      id="myCanvas" 
      width={window.innerWidth}
      height={window.innerHeight}


      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove ={handleMouseMove}
      
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      
      >
    </canvas>
    
  )
}

export default Canvas