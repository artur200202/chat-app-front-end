import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      setIsSending(true);
      try {
        await onSendMessage(message);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div className="message-input">
      <form className="message-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          autoFocus
          disabled={isSending || disabled}
        />
        <button type="submit" disabled={!message.trim() || isSending || disabled}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;