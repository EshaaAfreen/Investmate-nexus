import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../components/Chat/Chat.css';

// Ensure this matches your backend URL
const ENDPOINT = import.meta.env.VITE_API_URL;

export const Chat = () => {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef();
  const scrollRef = useRef();

  // Socket Connection
  useEffect(() => {
    // Strip '/api' from the end of the URL if present to get the base server URL
    const socketUrl = ENDPOINT.replace(/\/api\/?$/, '');
    socket.current = io(socketUrl);
    if (user) {
      socket.current.emit('join_room', user._id);
    }
    return () => socket.current.disconnect();
  }, [user]);

  // Fetch Contacts & Handle Message/History Only logic
  useEffect(() => {
    if (user) {
      fetchContactsAndInit();
    }
  }, [user, targetUserId]);

  const fetchContactsAndInit = async () => {
    try {
      // 1. Fetch existing contacts (msg history)
      const res = await axios.get(`${ENDPOINT}/chat/contacts/${user._id}`);
      let allContacts = res.data;

      // 2. If targetUserId is present (from "Message" button), handle new chat
      if (targetUserId) {
        const existingContact = allContacts.find(c => c._id === targetUserId);

        if (existingContact) {
          setCurrentChat(existingContact);
        } else {
          // Fetch target user details manually
          try {
            const userRes = await axios.get(`${ENDPOINT}/users/${targetUserId}`, {
              headers: { Authorization: `Bearer ${token}` } // assuming token needed
            });
            const newUser = userRes.data;
            // Temporarily add to contacts list UI
            allContacts = [...allContacts, newUser];
            setCurrentChat(newUser);
          } catch (err) {
            console.error("Error fetching target user", err);
          }
        }
      }

      setContacts(allContacts);

    } catch (err) {
      console.log(err);
    }
  };

  // Fetch Messages when chat selected
  useEffect(() => {
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on('receive_message', (message) => {
      // Add to messages if chat is open with that person
      if (
        currentChat &&
        (message.sender === currentChat._id || message.sender === user._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }

      // Refresh contacts list to show new conversations
      fetchContactsAndInit();
    });

    return () => socket.current.off('receive_message');
  }, [currentChat, user, contacts]); // Added contacts dependency if needed, but fetchContactsAndInit uses refs/state internally? No, need to be careful with deps.
  // Actually, fetchContactsAndInit is defined inside component, so it changes on render. 
  // Better to just call it. But wait, if I add it to deps, it might loop.
  // user and targetUserId are deps of fetchContactsAndInit.
  // Let's safe-guard it.

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessages = async () => {
    try {
      const res = await axios.get(
        `${ENDPOINT}/chat/history/${user._id}/${currentChat._id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage) return;

    // Get Idea ID from URL if present
    const ideaContextId = searchParams.get('userId') ? null : searchParams.get('ideaId');
    // Wait, the previous logic was ?userId=... but the user wants to chat WITH owner.
    // So logic: ?userId=OWNER_ID&ideaId=IDEA_ID
    const currentIdeaId = searchParams.get('ideaId');

    const messageData = {
      sender: user._id,
      receiver: currentChat._id,
      message: newMessage,
      ideaId: currentIdeaId || undefined
    };

    // Emit to socket
    socket.current.emit('send_message', messageData);

    // Optimistically update UI
    setMessages((prev) => [...prev, { ...messageData, createdAt: Date.now() }]);
    setNewMessage('');

    // If sending first message, refresh contacts to ensure they stay in list
    if (messages.length === 0) {
      // Optional: Trigger re-fetch or rely on next page load
    }
  };

  return (
    <div className="chat-container">
      <div className="contacts-list">
        <div className="contacts-header">Conversations</div>
        {contacts.length === 0 && <div className="p-3 text-muted small">No conversations yet.</div>}
        {contacts.map((c) => (
          <div
            key={c._id}
            className={`contact-item ${currentChat?._id === c._id ? 'active' : ''
              }`}
            onClick={() => setCurrentChat(c)}
          >
            <div className="contact-avatar">{c.name.charAt(0)}</div>
            <div className="contact-info">
              <h4>{c.name}</h4>
              <p>{c.activeRole}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-box">
        {currentChat ? (
          <>
            <div className="chat-header">
              {currentChat.name} <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#888' }}>({currentChat.activeRole})</span>
            </div>
            <div className="chat-messages">
              {messages.map((m, index) => (
                <div
                  key={index}
                  ref={index === messages.length - 1 ? scrollRef : null}
                  className={`message ${m.sender === user._id ? 'sent' : 'received'
                    }`}
                >
                  <p>{m.message}</p>
                  <div className="message-time">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
            <form className="chat-input-area" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            Open a conversation to start a chat.
          </div>
        )}
      </div>
    </div>
  );
};
