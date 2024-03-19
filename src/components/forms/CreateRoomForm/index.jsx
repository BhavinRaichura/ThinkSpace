import React, { useState,  useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

import { FaUserAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa";



import styles from '../../../styles/form.module.css'
import { generateRoomId } from '../../../utils/room/roomIdGenerator';

const CreateRoomForm = () => {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()
  const [newRoomId, setNewRoomId] = useState('')

  useEffect(()=>{
    setNewRoomId(generateRoomId());
  },[])
  

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username || !newRoomId) return;
    navigate('/room/'+newRoomId)
  }
  return (
    <form className={styles.formBody} onSubmit={handleSubmit}>
      <div className={styles.formContainer}>
        <h2>Create a Room</h2>
        <div className={styles.inputContainer}>
          <FaUserAlt className={styles.inputIcon} />
          <input className={styles.inputField} type="text" onChange={e=>setUsername(e.target.value)} name="" id="" placeholder='Name'/>
        </div>
        <div className={styles.inputContainer}>
          <FaKey className={styles.inputIcon} />
          <input className={styles.inputField} type="text" name="" id="" placeholder='Generate room key' value={newRoomId}  disabled/>
        </div>
        <button
          className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          data-ripple-light="true"
        >
          Create Room
        </button>
      </div>
    </form>
  )
}

export default CreateRoomForm