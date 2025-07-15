    import React, { createContext, useState, useEffect } from 'react';

    // Create context
    export const AuthContext = createContext();

    // Provider component
    export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);     // store username or user object
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, load user/token from localStorage if available
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('username');

        if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        }
        setLoading(false);
    }, []);

    // Login function: save token and user info
    const login = (token, username) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setToken(token);
        setUser(username);
    };

    // Logout function: clear everything
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
    );
    }
