import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import '../styles/ContactMessages.css';
import { AlignCenter } from 'react-bootstrap-icons';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/contact/reply/${selectedMessage.id}`, {
        email: selectedMessage.email,
        replyMessage: replyText
      });
      
      alert('Reply sent successfully!');
      setReplyText('');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = messages.filter(m => !m.replied).length;

  const getInitials = (email) => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    const parts = namePart.split(/[._-]/).filter(Boolean);
    if (parts.length === 0) return namePart.substring(0,2).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0,2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="contact-messages-container">
      <div className="messages-header">
        <h2 style={{color:"black",textAlign:"center"}}>Contact Messages</h2>
        <span className="badge">{unreadCount} Unread</span>
      </div>

      <div className="messages-content modern-grid">
        <div className="messages-list modern-list">
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message-item modern-item ${!message.replied ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'active' : ''}`}
                onClick={() => setSelectedMessage(message)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedMessage(message); }}
              >
                <div className="avatar" aria-hidden>
                  <span className="avatar-initials">{getInitials(message.email)}</span>
                  {!message.replied && <span className="unread-dot" />}
                </div>

                <div className="message-body">
                  <div className="message-top">
                    <strong className="message-sender">{message.email}</strong>
                    <small className="message-date">{new Date(message.createdAt).toLocaleString()}</small>
                  </div>
                  <p className="message-preview modern-preview">{message.message.length > 80 ? message.message.substring(0, 80) + '...' : message.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="message-detail modern-detail">
          {selectedMessage ? (
            <>
              <div className="detail-header">
                <h3>Message Details</h3>
                
                <button className="btn-close" onClick={() => setSelectedMessage(null)}>×</button>
              </div>

              <div className="detail-content modern-detail-content">
                <div className="detail-field">
                  <label>Message</label>
                  <p className="message-text">{selectedMessage.message}</p>
                </div>

                {selectedMessage.replied && (
                  <div className="replied-info">
                    {/* <span className="replied-badge">✓ Replied</span> */}
                    {selectedMessage.replyMessage && (
                      <div className="reply-text">
                        <label style={{fontWeight:"bold"}}>Replied message:</label>
                        <p className="reply-content">{selectedMessage.replyMessage}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="reply-section">
                  <label>Reply Again:</label>
                  <textarea
                    className="reply-textarea"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={5}
                  />
                  <div className="reply-actions">
                    <button
                      className="btn-send-reply primary"
                      onClick={handleReply}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection modern-no-selection">
              <p>Select a message to view details and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
                    