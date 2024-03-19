import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'


import { FaUserAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";



import styles from '../../../styles/form.module.css'

const JoinRoomForm = () => {
  const [username, setUsername] = useState("")
  const [roomId, setRoomId] = useState("")
  const navigate = useNavigate()

  

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username || !roomId) return;
    navigate('/room/'+roomId)
  }

  return (
    <form className={styles.formBody} onSubmit={handleSubmit}>
      <div className={styles.formContainer}>
        <h2>Join a Room</h2>

        <div className={styles.inputContainer}>
          <FaUserAlt className={styles.inputIcon} />
          <input 
            className={styles.inputField} 
            type="text" 
            name="" 
            id="" 
            placeholder='Name'  
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputContainer}>
          <FaKey className={styles.inputIcon} />
          <input 
            className={styles.inputField} 
            type="text" 
            name="" 
            id="" 
            placeholder='Put Your Room Id'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
        </div>
        <button
          className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          data-ripple-light="true"
        >
          Join
        </button>
      </div>
    </form>
  )
}

export default JoinRoomForm