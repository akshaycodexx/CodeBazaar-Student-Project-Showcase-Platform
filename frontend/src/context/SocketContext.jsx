import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initialize Socket
    useEffect(() => {
        // Check if user is logged in (from local storage or api check, but here we rely on the component using this to be protected or we check an auth token)
        // For simplicity, we connect; auth happens via "join" event usually after login.
        const newSocket = io(API_URL);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    // Check Auth & Join Room
    useEffect(() => {
        if (!socket) return;

        const checkAuth = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/check-auth-status`, { withCredentials: true });
                if (res.data.isLoggedIn && res.data.user) {
                    socket.emit("join", res.data.user._id);
                    fetchNotifications(); // Initial fetch
                }
            } catch (e) { console.log("Socket: Not logged in"); }
        };
        checkAuth();

        // Listen for notifications
        socket.on("notification", (notif) => {
            setNotifications(prev => [notif, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast(notif.message, {
                icon: '🔔',
                duration: 4000,
                position: 'top-right'
            });
        });

        return () => {
            socket.off("notification");
        };
    }, [socket]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/notifications`, { withCredentials: true });
            if (Array.isArray(res.data)) {
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.read).length);
            } else {
                setNotifications([]);
            }
        } catch (err) {
            console.error("Fetch notif failed", err);
            setNotifications([]);
        }
    };

    const markRead = async () => {
        try {
            await axios.put(`${API_URL}/api/notifications/read`, {}, { withCredentials: true });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) { }
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, markRead }}>
            {children}
        </SocketContext.Provider>
    );
};
