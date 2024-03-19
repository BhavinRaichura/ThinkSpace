
import { AiOutlineLine } from "react-icons/ai";
import {
  BsPencil,
  BsPencilFill,
  BsEraser,
  BsEraserFill,
  BsBrush,
  BsBrushFill,
  
} from "react-icons/bs";

import { 
    MdOutlineRectangle,
    MdRectangle,
    MdOutlineCircle,
    MdCircle
} from "react-icons/md";



const tools = [
    { id: 1, name: "Pen",         icon: <BsPencil  className=" m-auto  "/>, iconFill: <BsPencilFill  className=" m-auto   text-indigo-900"/> },
    { id: 2, name: "Line",        icon: <AiOutlineLine className=" m-auto  " />, iconFill:<AiOutlineLine className=" m-auto   text-indigo-900"/> },
    { id: 3, name: "Rectangle",   icon: <MdOutlineRectangle className=" m-auto  " />, iconFill:<MdRectangle className=" m-auto   text-indigo-900"/> },
    { id: 4, name: "Circle",      icon: <MdOutlineCircle className=" m-auto  " />, iconFill:<MdCircle className=" m-auto   text-indigo-900"/> },
    { id: 5, name: "Eraser",      icon: <BsEraser className=" m-auto  " />, iconFill:<BsEraserFill className=" m-auto   text-indigo-900"/> }, 
    
];

export default tools