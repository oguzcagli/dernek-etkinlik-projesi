import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    AdminPanelSettings,
    Login as LoginIcon
} from "@mui/icons-material";

// Dark theme for admin panel
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#b5a174',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
});

export function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { role, login, isLoading } = useAuth();
    const navigate = useNavigate();

    // Zaten giriş yapmışsa admin paneline yönlendir
    if (role === "admin") {
        return <Navigate to="/admin/haberler" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Kullanıcı adı ve şifre gereklidir.");
            return;
        }

        const success = await login(username, password);

        if (success) {
            navigate("/admin/haberler");
        } else {
            setError("Geçersiz kullanıcı adı veya şifre.");
            setPassword(""); // Şifreyi temizle
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                }}
            >
                <Card
                    sx={{
                        maxWidth: 400,
                        width: "100%",
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        mt: "-20vh",
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        {/* Header */}
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <AdminPanelSettings
                                sx={{
                                    fontSize: 48,
                                    color: "primary.main",
                                    mb: 2
                                }}
                            />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: "bold",
                                    color: "text.primary",
                                    mb: 1
                                }}
                            >
                                Admin Paneli
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                            >
                                Dernek yönetim sistemine giriş yapın
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    bgcolor: 'error.main',
                                    color: 'white'
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* Login Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Kullanıcı Adı"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                disabled={isLoading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'grey.600',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'text.primary',
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Şifre"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'grey.600',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'text.primary',
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    bgcolor: "primary.main",
                                    color: "black",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    '&:hover': {
                                        bgcolor: "primary.dark",
                                    },
                                    '&:disabled': {
                                        bgcolor: "grey.600",
                                        color: "grey.400",
                                    },
                                }}
                            >
                                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                            </Button>
                        </Box>

                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
}