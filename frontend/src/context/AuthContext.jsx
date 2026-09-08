import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Persist session across page refreshes
        try {
            const saved = localStorage.getItem('depot_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const login = useCallback(async (identifier, password) => {
        const { user: safeUser, token } = await api('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) });
        setUser(safeUser);
        localStorage.setItem('depot_user', JSON.stringify(safeUser));
        localStorage.setItem('depot_token', token);
        return safeUser;
    }, []);

    const signup = useCallback(async ({ name, email, employeeId, mobile, password, confirmPassword, role }) => {
        const { user: newUser, token } = await api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, employeeId, phone: mobile, password, confirmPassword, role }) });
        setUser(newUser);
        localStorage.setItem('depot_user', JSON.stringify(newUser));
        localStorage.setItem('depot_token', token);
        return newUser;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('depot_user');
        localStorage.removeItem('depot_token');
    }, []);

    const isManager = user?.role === 'manager';
    const isDriver = user?.role === 'driver';
    const isConductor = user?.role === 'conductor';

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isManager, isDriver, isConductor }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
