import React, { useEffect, useState, useRef } from "react";
import { get, getRooms, getUsers } from "../../services/apiService";
import socketService from "../../services/socketService";
import Sidebar from "../../components/Sidebars/Sidebar";
import dp1 from "../../assets/dp1.jpg";
import { Search, ShieldUser, Inbox, Trophy } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const HIGHLIGHT_DURATION = 1200;

const ChatPage = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
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
        if (res && Array.isArray(res.rooms)) setRooms(res.rooms);
        else if (Array.isArray(res)) setRooms(res);
        else if (Array.isArray(res?.data)) setRooms(res.data);
      } catch {
        setRooms([{ name: "general" }]);
      }
    };
    fetchRooms();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        if (res && Array.isArray(res.users)) setUsers(res.users);
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
        if (res?.data?.messages) setMessages(res.data.messages);
        else if (res?.messages) setMessages(res.messages);
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
      setHighlightedMsgIds((ids) => [...ids, msg._id || `msg-${Date.now()}`]);

      setTimeout(() => {
        setHighlightedMsgIds((ids) =>
          ids.filter((id) => id !== (msg._id || `msg-${Date.now()}`))
        );
      }, HIGHLIGHT_DURATION);
    };

    const handleTyping = ({ user: typingUser, isTyping }) => {
      if (!typingUser || typingUser._id === user?._id) return;
      setTypingUsers((prev) => {
        const name = typingUser.fullName || typingUser.email;
        if (isTyping) return prev.includes(name) ? prev : [...prev, name];
        return prev.filter((u) => u !== name);
      });
    };

    socketService.on("new-message", handleNewMessage);
    socketService.on("typing", handleTyping);

    return () => {
      socketService.off("new-message", handleNewMessage);
      socketService.off("typing", handleTyping);
      socketService.leaveRoom(selectedRoom);
      socketService.disconnect();
    };
  }, [selectedRoom, token, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedRoom]);

  // Handle input typing
  const handleInputChange = (e) => {
    setInput(e.target.value);
    socketService.setTyping(selectedRoom, true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketService.setTyping(selectedRoom, false);
    }, 1200);
  };

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    socketService.sendMessage({
      room: selectedRoom,
      user: user?._id,
      message: input,
    });
    setInput("");
    setSending(false);
    socketService.setTyping(selectedRoom, false);
  };

  // Create room (Admin only)
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomDesc.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/rooms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newRoomName,
            description: newRoomDesc,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create room");
      setRooms((prev) => [...prev, data]);
      setSelectedRoom(data.name);
      setNewRoomName("");
      setNewRoomDesc("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Rooms + Chat */}
        <div className="flex flex-1 p-6 gap-6">
          {/* Left Panel (Rooms + Users) */}
          <div className="w-64 bg-gray-50 p-4 border rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-700 mb-2">Rooms</h3>
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li key={room._id || room.name}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded ${selectedRoom === room.name
                        ? "bg-green-100 border border-green-400"
                        : "hover:bg-gray-100 border"
                      }`}
                    onClick={() => setSelectedRoom(room.name)}
                  >
                    {room.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Admin room creation */}
            {user?.role === "admin" && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Create Room</h4>
                <form onSubmit={handleCreateRoom} className="space-y-2">
                  <input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Room Name"
                    className="w-full border p-2 rounded"
                  />
                  <textarea
                    value={newRoomDesc}
                    onChange={(e) => setNewRoomDesc(e.target.value)}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    Create
                  </button>
                </form>
              </div>
            )}

            <h3 className="font-bold text-gray-700 mt-6 mb-2">Users</h3>
            <ul className="space-y-2">
              {users
                .filter((u) => u._id !== user?._id)
                .map((u) => (
                  <li key={u._id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded ${selectedRoom === `dm-${user._id}-${u._id}` ||
                          selectedRoom === `dm-${u._id}-${user._id}`
                          ? "bg-green-100 border border-green-400"
                          : "hover:bg-gray-100 border"
                        }`}
                      onClick={() => {
                        const roomName =
                          user._id < u._id
                            ? `dm-${user._id}-${u._id}`
                            : `dm-${u._id}-${user._id}`;
                        setSelectedRoom(roomName);
                      }}
                    >
                      {u.fullName || u.email}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-4">
              💬 Chat Room: {selectedRoom}
            </h2>
            <div className="flex-1 border rounded-lg p-4 bg-gray-50 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`mb-2 p-2 rounded ${highlightedMsgIds.includes(msg._id || idx)
                      ? "bg-yellow-100"
                      : ""
                    }`}
                >
                  <b>
                    {msg.user?.username ||
                      msg.sender?.username ||
                      msg.sender?.fullName ||
                      "Anonymous"}
                  </b>
                  : {msg.message}
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <p className="text-sm text-gray-500 italic mt-1">
                {typingUsers.join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </p>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="flex mt-4">
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 border rounded px-3 py-2"
                disabled={sending}
              />
              <button
                type="submit"
                className="ml-2 bg-green-500 text-white px-4 rounded hover:bg-green-600"
                disabled={!input.trim() || sending}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
