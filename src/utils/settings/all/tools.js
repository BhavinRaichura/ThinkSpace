import { AiOutlineLine } from "react-icons/ai";
import {
  BsPencil,
  BsPencilFill,
  BsEraser,
  BsEraserFill
} from "react-icons/bs";

import {
  MdOutlineRectangle,
  MdRectangle,
  MdOutlineCircle,
  MdCircle,
  MdDelete,
  MdDeleteForever,
} from "react-icons/md";

import { HiCursorClick, HiCursorClick as HiCursorClickFill } from "react-icons/hi";

const tools = [
  {
    id: 1,
    name: "Select",
    icon: <HiCursorClick className="m-auto" />,
    iconFill: <HiCursorClickFill className="m-auto text-indigo-900" />,
    configs: [],
  },
  {
    id: 0,
    name: "Pen",
    icon: <BsPencil className="m-auto" />,
    iconFill: <BsPencilFill className="m-auto text-indigo-900" />,
    configs: [
      "width",
      "colors"
    ],
  },
  {
    id: 2,
    name: "Line",
    icon: <AiOutlineLine className="m-auto" />,
    iconFill: <AiOutlineLine className="m-auto text-indigo-900" />,
    configs: [
      "width",
      "colors"
    ],
  },
  {
    id: 3,
    name: "Rectangle",
    icon: <MdOutlineRectangle className="m-auto" />,
    iconFill: <MdRectangle className="m-auto text-indigo-900" />,
    configs: [
      "width",
      "colors",
      "background",
      "fill"
    ],
  },
  {
    id: 4,
    name: "Circle",
    icon: <MdOutlineCircle className="m-auto" />,
    iconFill: <MdCircle className="m-auto text-indigo-900" />,
    configs: [
      "width",
      "colors",
      "background",
      "fill"
    ],
  },
  {
    id: 5,
    name: "Eraser",
    icon: <BsEraser className="m-auto" />,
    iconFill: <BsEraserFill className="m-auto text-indigo-900" />,
    configs: [],
  },
  {
    id: 6,
    name: "Delete",
    icon: <MdDelete className="m-auto" />,
    iconFill: <MdDeleteForever className="m-auto text-red-700" />,
    configs: [],
  },
];

export default tools;
