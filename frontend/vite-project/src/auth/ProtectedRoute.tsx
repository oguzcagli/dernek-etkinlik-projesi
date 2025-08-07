// src/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Props {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin }: Props) {
    const { role, isLoading } = useAuth();

    // Yükleniyor durumunda
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div>Yükleniyor...</div>
            </div>
        );
    }

    // Giriş yapmamışsa login'e yönlendir
    if (!role) {
        return <Navigate to="/admin/login" replace />;
    }

    // Admin gerekli ama kullanıcı admin değilse
    if (requireAdmin && role !== "ADMIN") {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}