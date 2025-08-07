// src/auth/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Role = "ADMIN" | "USER" | null;

interface AuthContextType {
    role: Role;
    token: string | null;
    username: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<Role>(null);
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sayfa yenilendiğinde auth durumunu koru
    useEffect(() => {
        const savedToken = localStorage.getItem('dernek_auth_token');
        const savedRole = localStorage.getItem('dernek_auth_role');
        const savedUsername = localStorage.getItem('dernek_auth_username');

        if (savedToken && savedRole && savedUsername) {
            setToken(savedToken);
            setRole(savedRole as Role);
            setUsername(savedUsername);
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                setIsLoading(false);
                return false;
            }

            const data = await response.json();

            // Backend'den gelen data: { token, username, role, type }
            setToken(data.token);
            setRole(data.role); // "ADMIN" veya "USER"
            setUsername(data.username);

            // localStorage'a kaydet
            localStorage.setItem('dernek_auth_token', data.token);
            localStorage.setItem('dernek_auth_role', data.role);
            localStorage.setItem('dernek_auth_username', data.username);

            setIsLoading(false);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            return false;
        }
    };

    const logout = () => {
        setRole(null);
        setToken(null);
        setUsername(null);
        localStorage.removeItem('dernek_auth_token');
        localStorage.removeItem('dernek_auth_role');
        localStorage.removeItem('dernek_auth_username');
    };

    return (
        <AuthContext.Provider value={{ role, token, username, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}