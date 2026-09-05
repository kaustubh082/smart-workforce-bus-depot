import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS } from '../mock/data';

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

    const login = useCallback(async (email, password) => {
        // TODO: Replace with API call — POST /api/auth/login
        const found = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        );
        if (!found) {
            throw new Error('Invalid email or password');
        }
        const { password: _, ...safeUser } = found; // strip password before storing
        setUser(safeUser);
        localStorage.setItem('depot_user', JSON.stringify(safeUser));
        return safeUser;
    }, []);

    const signup = useCallback(async ({ name, email, password, role }) => {
        // TODO: Replace with API call — POST /api/auth/signup
        const exists = MOCK_USERS.find((u) => u.email === email);
        if (exists) throw new Error('Email already registered');
        const newUser = {
            id: String(Date.now()),
            name,
            email,
            role: role || 'driver',
            employeeId: 'TEMP-' + Math.floor(Math.random() * 1000),
            depot: 'Central Bus Depot, Pune',
            joinedDate: new Date().toISOString().split('T')[0],
            avatar: null,
        };
        setUser(newUser);
        localStorage.setItem('depot_user', JSON.stringify(newUser));
        return newUser;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('depot_user');
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
