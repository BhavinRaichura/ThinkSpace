import { useEffect } from 'react'

import Whiteboard from '../components/whiteboard'

const RoomPage = (props) => {
  function cleanupOldRooms() {
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("room-")) {
        try {
          const item = JSON.parse(localStorage.getItem(key));

          // Old format fallback (without timestamps)
          if (!item.updatedAt) {
            localStorage.removeItem(key);
            continue;
          }

          const age = now - item.updatedAt;

          if (age > ONE_MONTH) {
            localStorage.removeItem(key);
          }
        } catch (err) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  useEffect(() => {
    cleanupOldRooms();
  }, []);

  return (
    <div>
      <Whiteboard />
    </div>
  )
}

export default RoomPage;