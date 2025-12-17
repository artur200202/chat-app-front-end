import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { messageAPI } from '../services/api';

const ChatRoom = ({ room, user }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (room) {
      console.log('Room changed to:', room);
      setIsLoading(true);
      setMessages([]); 
      loadMessages();
      const interval = setInterval(loadMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [room?.id]);

  const loadMessages = async () => {
    if (!room) return;
    
    try {
      console.log('Loading messages for room:', room.id);
      const data = await messageAPI.getAll(room.id);
      console.log('Loaded messages:', data);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    console.log('Attempting to send message:', content);
    console.log('User:', user);
    console.log('Room:', room);
    
    try {
      await messageAPI.create({
        content,
        user_id: user.id,
        room_id: room.id,
      });
      console.log('Message created successfully');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message: ' + error.message);
      throw error;
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      await messageAPI.update(messageId, { content: newContent });
      await loadMessages();
    } catch (error) {
      console.error('Failed to edit message:', error);
      alert('Failed to edit message: ' + error.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageAPI.delete(messageId);
      await loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message: ' + error.message);
    }
  };

  if (!room) {
    return <div className="chat-room no-room-selected">Select a room to start chatting</div>;
  }

  if (isLoading) {
    return <div className="chat-room loading">Loading messages...</div>;
  }

  return (
    <div className="chat-room">
      <MessageList 
        messages={messages} 
        currentUser={user}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;