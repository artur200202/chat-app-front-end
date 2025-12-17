import React, { useEffect, useRef, useState } from 'react';

const MessageList = ({ messages, currentUser, onEditMessage, onDeleteMessage }) => {
  const messagesEndRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStartEdit = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (messageId) => {
    if (editContent.trim()) {
      await onEditMessage(messageId, editContent);
      setEditingMessageId(null);
      setEditContent('');
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await onDeleteMessage(messageId);
    }
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">No messages yet. Start the conversation!</div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.author?.id === currentUser?.id ? 'own-message' : ''
            }`}
          >
            <div className="message-header">
              <span className="message-author">
                {message.author?.username || 'Unknown User'}
              </span>
              <span className="message-time">{formatTime(message.created_at)}</span>
              {message.author?.id === currentUser?.id && (
                <div className="message-actions">
                  {editingMessageId !== message.id && (
                    <>
                      <button
                        className="message-action-btn edit-btn"
                        onClick={() => handleStartEdit(message)}
                        title="Edit message"
                      >
                        Edit
                      </button>
                      <button
                        className="message-action-btn delete-btn"
                        onClick={() => handleDelete(message.id)}
                        title="Delete message"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {editingMessageId === message.id ? (
              <div className="message-edit-form">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(message.id);
                    }
                  }}
                  autoFocus
                />
                <div className="message-edit-actions">
                  <button
                    className="save-edit-btn"
                    onClick={() => handleSaveEdit(message.id)}
                  >
                    Save
                  </button>
                  <button className="cancel-edit-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="message-content">{message.content}</div>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;