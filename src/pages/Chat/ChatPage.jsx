import React, { useEffect, useState, useRef } from 'react';
import { get, getRooms, getUsers } from '../../services/apiService';
import socketService from '../../services/socketService';
// import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebars/Sidebar';
import dp1 from "../../assets/dp1.jpg";
import { Search, ShieldUser, Inbox, Trophy } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

const HIGHLIGHT_DURATION = 1200;


const ChatPage = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [sending, setSending] = useState(false);
  const [highlightedMsgIds, setHighlightedMsgIds] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  let typingTimeout = useRef();

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms();
        if (res && Array.isArray(res.rooms)) {
          setRooms(res.rooms);
        } else if (res && Array.isArray(res)) {
          setRooms(res);
        } else if (res && Array.isArray(res.data)) {
          setRooms(res.data);
        }
      } catch {
        setRooms([{ name: 'general' }]);
      }
    };
    fetchRooms();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        if (res && Array.isArray(res.users)) {
          setUsers(res.users);
        }
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await get(`/chats/messages/${selectedRoom}`);
        if (res?.data?.messages) {
          setMessages(res.data.messages);
        } else if (res?.messages) {
          setMessages(res.messages);
        }
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [selectedRoom]);

  // WebSocket setup
  useEffect(() => {
    socketService.connect(token);
    socketService.joinRoom(selectedRoom);

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      setHighlightedMsgIds((ids) => [...ids, msg._id || prev.length]);
      setTimeout(() => {
        setHighlightedMsgIds((ids) => ids.filter(id => id !== (msg._id || prev.length)));
      }, HIGHLIGHT_DURATION);
    };

    const handleTyping = ({ user: typingUser, isTyping }) => {
      if (!typingUser || typingUser._id === user?._id) return;
      setTypingUsers((prev) => {
        if (isTyping) {
          if (!prev.includes(typingUser.fullName || typingUser.email)) {
            return [...prev, typingUser.fullName || typingUser.email];
          }
        } else {
          return prev.filter(u => u !== (typingUser.fullName || typingUser.email));
        }
        return prev;
      });
    };

    socketService.on('new-message', handleNewMessage);
    socketService.on('typing', handleTyping);

    return () => {
      socketService.off('new-message', handleNewMessage);
      socketService.off('typing', handleTyping);
      socketService.leaveRoom(selectedRoom);
      socketService.disconnect();
    };
  }, [selectedRoom, token, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input when room changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedRoom]);

  // Typing indicator emission
  const handleInputChange = (e) => {
    setInput(e.target.value);
    socketService.setTyping(selectedRoom, true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketService.setTyping(selectedRoom, false);
    }, 1200);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    socketService.sendMessage({
      room: selectedRoom,
      user: user?._id,
      message: input,
    });
    setInput('');
    setSending(false);
    socketService.setTyping(selectedRoom, false);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomDesc.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRoomName,
          description: newRoomDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room');
      setRooms((prev) => [...prev, data]);
      setSelectedRoom(data.name);
      setNewRoomName('');
      setNewRoomDesc('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <img src={dp1} alt="Logo" className="w-10 h-10 rounded-full" />
            <span className="font-bold text-xl">
              <span style={{ color: "#1db954" }}>Digital</span>{" "}
              <span className="font-normal">Pathsala</span>
            </span>
          </div>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Inbox />
            <ShieldUser />
            <Trophy />
            <button className="p-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <Sidebar />
      <div style={{ width: 240, marginRight: 24 }}>
        <h3>Rooms</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {rooms.map((room) => (
            <li key={room._id || room.name}>
              <button
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  margin: '4px 0',
                  background: selectedRoom === room.name ? '#e0e0e0' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedRoom(room.name)}
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>

        {user?.role === 'admin' && (
          <div style={{ marginTop: 24 }}>
            <h4>Create New Room</h4>
            <form onSubmit={handleCreateRoom}>
              <input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room Name"
                style={{ width: '100%', marginBottom: 6, padding: 6 }}
              />
              <textarea
                value={newRoomDesc}
                onChange={(e) => setNewRoomDesc(e.target.value)}
                placeholder="Description"
                style={{ width: '100%', marginBottom: 6, padding: 6 }}
              />
              <button type="submit" style={{ padding: '6px 12px' }}>
                Create
              </button>
            </form>
          </div>
        )}

        <h3 style={{ marginTop: 32 }}>Users</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.filter(u => u._id !== user?._id).map((u) => (
            <li key={u._id}>
              <button
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  margin: '4px 0',
                  background: selectedRoom === `dm-${user._id}-${u._id}` || selectedRoom === `dm-${u._id}-${user._id}` ? '#e0e0e0' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const roomName = user._id < u._id ? `dm-${user._id}-${u._id}` : `dm-${u._id}-${user._id}`;
                  setSelectedRoom(roomName);
                }}
              >
                {u.fullName || u.email}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <h2>💬 Chat Room: {selectedRoom}</h2>
        <div
          style={{
            border: '1px solid #ccc',
            height: 400,
            overflowY: 'auto',
            padding: 10,
            borderRadius: 8,
            background: '#f9f9f9',
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={highlightedMsgIds.includes(msg._id || idx) ? 'highlight-msg' : ''}
              style={{ margin: '10px 0', transition: 'background 0.5s' }}
            >
              <b>{msg.user?.username || msg.sender?.username || msg.sender?.fullName || 'Anonymous'}:</b> {msg.message}
              <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>
                {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div style={{ color: '#888', fontStyle: 'italic', margin: '4px 0 0 8px' }}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        <form onSubmit={handleSend} style={{ display: 'flex', marginTop: 10 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            style={{ flex: 1, padding: 8, borderRadius: 4 }}
            disabled={sending}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', marginLeft: 8 }}
            disabled={!input.trim() || sending}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
      <style>{`
        .highlight-msg {
          background: #ffeaa7;
          border-radius: 6px;
          transition: background 0.5s;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
