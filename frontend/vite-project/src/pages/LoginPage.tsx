import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { role, login, isLoading } = useAuth();
    const navigate = useNavigate();

    // Zaten giriş yapmışsa yönlendir
    if (role === "ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const success = await login(username, password);
        if (success) {
            navigate("/admin");
        } else {
            setError("Kullanıcı adı veya şifre hatalı");
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
                    Admin Girişi
                </h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        marginBottom: '1rem',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
                            Kullanıcı Adı:
                        </label>
                        <input
                            type="text"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '1rem'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
                            Şifre:
                        </label>
                        <input
                            type="password"
                            placeholder="123456"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '1rem'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '5px',
                    borderLeft: '4px solid #667eea'
                }}>
                    <p style={{ margin: '0.25rem 0', fontWeight: '600', color: '#333' }}>
                        Demo Bilgileri:
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                        Kullanıcı Adı: admin
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                        Şifre: 123456
                    </p>
                </div>
            </div>
        </div>
    );
}