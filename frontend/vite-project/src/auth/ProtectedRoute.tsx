// src/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Props {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin }: Props) {
    const { role } = useAuth();

    if (requireAdmin && role !== "admin") {
        return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
}
