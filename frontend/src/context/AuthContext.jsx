import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContextObject = createContext({
    user: null,
    isLoggedIn: false,
    login: async () => { },
    logout: async () => { },
    isLoading: true,
});

function AuthContext({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/check-auth-status`, { withCredentials: true });
                if (response.data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUser(response.data.user);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                setIsLoggedIn(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            await axios.post(`${API_URL}/api/signin`, { email, password }, { withCredentials: true });
            const response = await axios.get(`${API_URL}/api/check-auth-status`, { withCredentials: true });
            setIsLoggedIn(true);
            setUser(response.data.user);
            navigate('/'); // Navigate to home
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
            setIsLoggedIn(false);
            setUser(null);
            navigate('/signin');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContextObject.Provider value={{ user, isLoggedIn, login, logout, isLoading }}>
            {children}
        </AuthContextObject.Provider>
    );
}

export { AuthContextObject };
export default AuthContext;
