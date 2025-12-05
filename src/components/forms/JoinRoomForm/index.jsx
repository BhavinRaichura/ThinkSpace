import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from '../../../styles/form.module.css'

const NoRoomsAvailable = ({ rooms }) => {
  return (
    <div className={styles.noRoomsContainer}>
      <p className={styles.noRoomsText}>No available rooms to join.</p>
      <p className={styles.noRoomsSubText}>Please create a new room to get started.</p>
    </div>
  )
}

const JoinRoomForm = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    let availableRooms = localStorage.getItem(`rooms`);
    const today = Date.now();
    const VALID_THRESHOLD_TIME = 7 * 24 * 60 * 60 * 1000; // 7 * 24 hours in milliseconds

    if (availableRooms) {
      try {
        availableRooms = JSON.parse(availableRooms);
        // console.log("Available rooms from localStorage:", availableRooms);
        const all = Object.keys(availableRooms);
        const validRooms = all?.filter(roomKey => {
          const roomDetails = localStorage.getItem(`room-${roomKey}`);
          if (!roomDetails) return false;

          const lastUpdatedTime = JSON.parse(roomDetails)?.updatedAt;
          if (!lastUpdatedTime || (today - lastUpdatedTime) > VALID_THRESHOLD_TIME) {
            localStorage.removeItem(`room-${roomKey}`);
            return false;
          }
          //// console.log({roomKey, "d":availableRooms[ke], timeDiff: today - lastUpdatedTime});

          availableRooms[roomKey].updatedAt = lastUpdatedTime;
          // Keep rooms that are less than 24 hours old
          return true;
        });
        setRooms(validRooms);

        // Update localStorage to only keep valid rooms
        const updatedRoomsData = validRooms.reduce((acc, roomKey) => {
          acc[roomKey] = availableRooms[roomKey];
          return acc;
        }, {});
        localStorage.setItem('rooms', JSON.stringify(updatedRoomsData));
      } catch (err) {
        console.error("Error parsing available rooms:", err);
        setRooms([]);
      }
    }
  }, [])



  const handleSubmit = (e) => {
    e.preventDefault()
    if (!roomId) return;
    navigate('/room/' + roomId)
  }

  return (
    <form className={""} onSubmit={handleSubmit}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Join Room</h2>
        {rooms.length > 0 ? (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="roomId" className='block text-sm font-light py-1'>Select Room ID</label>
              <select
                name="roomId"
                id="roomId"
                className={styles.selectField}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              >
                <option value="" disabled>Select a room</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
              onClick={handleSubmit}
            >
              Join Room
            </button>
          </>
        ) : (
          <NoRoomsAvailable rooms={rooms} />
        )}
      </div>
    </form>
  )
}

export default JoinRoomForm