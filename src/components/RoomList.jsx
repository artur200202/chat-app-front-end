import React, { useState, useEffect } from 'react';
import { roomAPI } from '../services/api';

const RoomList = ({ currentRoom, onRoomSelect, onRoomDeleted }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomAPI.getAll();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      const newRoom = await roomAPI.create({
        name: newRoomName,
        description: newRoomDescription,
      });
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setNewRoomDescription('');
    } catch (error) {
      alert(error.message || 'Failed to create room');
    }
  };

  const handleDeleteRoom = async (roomId, e) => {
    e.stopPropagation(); 
    
    if (window.confirm('Are you sure you want to delete this room? All messages in this room will be deleted.')) {
      try {
        await roomAPI.delete(roomId);
        setRooms(rooms.filter(room => room.id !== roomId));
        if (currentRoom?.id === roomId) {
          onRoomDeleted();
        }
      } catch (error) {
        alert(error.message || 'Failed to delete room');
      }
    }
  };

  if (isLoading) {
    return <div className="room-list loading">Loading rooms...</div>;
  }

  return (
    <div className="room-list">
      <h2>Chat Rooms</h2>
      <ul className="room-list-items">
        {rooms.map((room) => (
          <li
            key={room.id}
            className={`room-item ${currentRoom?.id === room.id ? 'active' : ''}`}
            onClick={() => onRoomSelect(room)}
          >
            <div className="room-item-content">
              <div className="room-item-text">
                <h3>{room.name}</h3>
                {room.description && <p>{room.description}</p>}
              </div>
              <button
                className="delete-room-btn"
                onClick={(e) => handleDeleteRoom(room.id, e)}
                title="Delete room"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form className="create-room-form" onSubmit={handleCreateRoom}>
        <h3>Create New Room</h3>
        <input
          type="text"
          placeholder="Room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newRoomDescription}
          onChange={(e) => setNewRoomDescription(e.target.value)}
        />
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default RoomList;