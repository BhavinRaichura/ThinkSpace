import React, { useEffect, useState,useRef } from 'react'
/*
const Cursor = () => {

  
  const pointerRef = useRef(null)

  useEffect(()=>{
    document.addEventListener("mousemove", mouseMove )

    function mouseMove (e){
      const {clientX, clientY} = e
      // console.log(clientX, " ", clientY)
      if(pointerRef && pointerRef.current){
      
        pointerRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
      }
      //console.log(pointerRef.current)
    }
    return ()=>document.removeEventListener("mousemove",mouseMove)

  }, [])


  return (
    <div ref={pointerRef.current}  className=' absolute rounded-full border-2 bg-green-400 transition-all' style={{ width:"30px", height:"30px", left:"10px", right:"10px" }}></div>
  )
}
export default Cursor
*/