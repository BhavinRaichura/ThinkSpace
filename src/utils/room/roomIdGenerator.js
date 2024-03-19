export function generateRoomId() {
    let roomId = '';
    const characters = '0123456789ASDFGHJKLQWERTYUIOPZXCVBNM';
    const length = characters.length;
    
    for (let i = 0; i < 6; i++) {
      roomId += characters.charAt(Math.floor(Math.random() * length));
    }
    
    return roomId;
  }
  