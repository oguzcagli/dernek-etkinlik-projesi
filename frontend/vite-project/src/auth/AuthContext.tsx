// src/auth/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Role = "admin" | null;

interface AuthContextType {
    role: Role;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

// Admin credentials - production'da backend'den gelir
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "dernek123"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<Role>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sayfa yenilendiğinde auth durumunu koru
    useEffect(() => {
        const savedRole = localStorage.getItem('dernek_auth_role');
        if (savedRole === 'admin') {
            setRole('admin');
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            setRole('admin');
            localStorage.setItem('dernek_auth_role', 'admin');
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const logout = () => {
        setRole(null);
        localStorage.removeItem('dernek_auth_role');
    };

    return (
        <AuthContext.Provider value={{ role, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}