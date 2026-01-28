import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, User } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Chat = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const targetUserId = searchParams.get('userId');

    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch current user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/me`, { withCredentials: true });
                setCurrentUser(res.data);
            } catch (e) {
                toast.error("Please login to chat");
                navigate('/signin');
            }
        };
        fetchUser();
    }, []);

    // Fetch conversations
    useEffect(() => {
        fetchConversations();
    }, []);

    // Initialize chat from URL param
    useEffect(() => {
        if (targetUserId && currentUser) {
            // Check if user is already in conversations, if not fetch their details
            const existing = conversations.find(u => u._id === targetUserId);
            if (existing) {
                setSelectedUser(existing);
            } else {
                // Fetch user details to start new chat
                axios.get(`${API_URL}/api/user/${targetUserId}`)
                    .then(res => {
                        setSelectedUser(res.data);
                        // Add to temp conversations list if not there
                        // setConversations(prev => [res.data, ...prev]); 
                    })
                    .catch(err => console.error("User not found"));
            }
        }
    }, [targetUserId, conversations, currentUser]);

    // Fetch messages when selected user changes
    useEffect(() => {
        if (!selectedUser) return;
        fetchMessages(selectedUser._id);

        // Simple polling for new messages every 3 seconds
        const interval = setInterval(() => fetchMessages(selectedUser._id, true), 3000);
        return () => clearInterval(interval);
    }, [selectedUser]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/chat/conversations`, { withCredentials: true });
            setConversations(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch conversations");
        }
    };

    const fetchMessages = async (userId, background = false) => {
        try {
            const res = await axios.get(`${API_URL}/api/chat/${userId}`, { withCredentials: true });
            if (background) {
                // Only update if length changed to avoid jitter/re-renders? React diffs okay.
                // Logic: setMessages(res.data)
                // Better check if new message
                setMessages(prev => {
                    if (prev.length !== res.data.length) return res.data;
                    return prev;
                });
            } else {
                setMessages(res.data);
            }
        } catch (err) {
            if (!background) toast.error("Failed to load messages");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await axios.post(`${API_URL}/api/chat/send`, {
                receiverId: selectedUser._id,
                text: newMessage
            }, { withCredentials: true });

            setMessages([...messages, res.data]);
            setNewMessage("");

            // Refresh conversations list if first message
            if (!conversations.find(c => c._id === selectedUser._id)) {
                fetchConversations();
            }
        } catch (err) {
            toast.error("Failed to send message");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Chat...</div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-neutral-50 flex max-w-screen-xl mx-auto border-x border-neutral-200 shadow-sm mt-4">

            {/* Sidebar List */}
            <div className={`w-full md:w-1/3 bg-white border-r border-neutral-200 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                    <h2 className="text-xl font-bold text-neutral-800">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="p-4 text-neutral-500 text-center">No conversations yet.</p>
                    ) : (
                        conversations.map(u => (
                            <div
                                key={u._id}
                                onClick={() => setSelectedUser(u)}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-neutral-50 transition-colors ${selectedUser?._id === u._id ? 'bg-indigo-50 border-r-4 border-primary' : ''}`}
                            >
                                <img src={u.profilePicture || "/default-avatar.png"} alt={u.username} className="w-12 h-12 rounded-full object-cover border border-neutral-200" />
                                <div>
                                    <h4 className="font-bold text-neutral-900">{u.fullName || u.username}</h4>
                                    <p className="text-xs text-neutral-500 truncate w-40">Click to chat</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`w-full md:w-2/3 flex flex-col bg-white ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-neutral-200 flex items-center gap-3 shadow-sm z-10">
                            <button onClick={() => setSelectedUser(null)} className="md:hidden text-neutral-500 mr-2">← Back</button>
                            <img src={selectedUser.profilePicture || "/default-avatar.png"} alt={selectedUser.username} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="font-bold text-neutral-900">{selectedUser.fullName || selectedUser.username}</h3>
                                {selectedUser.companyName && <span className="text-xs text-neutral-500">{selectedUser.companyName}</span>}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
                            {messages.map((msg, i) => {
                                const isMe = msg.sender._id === currentUser?._id || msg.sender === currentUser?._id;
                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-none'}`}>
                                            <p>{msg.text}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-neutral-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-neutral-200">
                            <div className="flex gap-2 relative">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="w-full bg-neutral-100 border-0 rounded-full px-5 py-3 focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50">
                        <User className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
