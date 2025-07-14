import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, TextField, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import logo from "./assets/dernek_logo.png";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { HaberlerPage } from "./pages/HaberlerPage";
import { DuyurularPage } from "./pages/DuyurularPage";
import { AdminHaberPage } from "./pages/AdminHaberPage";
import { AdminDuyuruPage } from "./pages/AdminDuyuruPage";

// Global koyu tema - Altın tonlarıyla
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b5a174', // Logo rengi
    },
    secondary: {
      main: '#d4c49a', // Açık altın
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

function Nav() {
  const { role, logout } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/haberler?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <AppBar position="fixed" elevation={4} sx={{ bgcolor: "#000" }}>
      <Toolbar
        disableGutters
        sx={{
          px: { xs: 1, sm: 2, md: 20 },
          height: { xs: 64, sm: 100, md: 100 },
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/haberler"
          sx={{
            display: "block",
            height: { xs: 40, sm: 60, md: 70 },
            width: "auto",
            mr: 4,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Dernek Etkinlik Logo"
            sx={{ height: "100%", width: "auto" }}
          />
        </Box>

        {/* Ortalanmış Arama */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "space-around" }}>
          <TextField
            size="small"
            placeholder="Haber ara…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={onSearch}
            sx={{
              bgcolor: "black",
              borderRadius: 1,
              width: { xs: 140, sm: 220, md: 270 },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#555',
                },
                '&:hover fieldset': {
                  borderColor: '#b5a174', // Altın renk hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#b5a174', // Altın renk focus
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#b0b0b0',
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Menü - Altın hover efektleriyle */}
        <Button
          component={Link}
          to="/haberler"
          sx={{
            color: "#fff",
            transition: 'color 0.3s ease',
            '&:hover': {
              color: '#b5a174', // Altın renk hover

            }
          }}
        >
          <b>HABERLER</b>
        </Button>
        <Button
          component={Link}
          to="/duyurular"
          sx={{
            color: "#fff",
            ml: 2,
            transition: 'color 0.3s ease',
            '&:hover': {
              color: '#b5a174', // Altın renk hover
              backgroundColor: 'rgba(181, 161, 116, 0.1)' // Hafif altın arka plan
            }
          }}
        >
          <b>DUYURULAR</b>
        </Button>
        {role === "admin" && (
          <>
            <Button
              component={Link}
              to="/admin/haberler"
              sx={{
                color: "#fff",
                ml: 2,
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#d4c49a', // Açık altın renk admin butonları için
                  backgroundColor: 'rgba(212, 196, 154, 0.1)'
                }
              }}
            >
              <b>Admin Haber Paneli</b>
            </Button>
            <Button
              component={Link}
              to="/admin/duyurular"
              sx={{
                color: "#fff",
                ml: 2,
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#d4c49a', // Açık altın renk admin butonları için
                  backgroundColor: 'rgba(212, 196, 154, 0.1)'
                }
              }}
            >
              <b>Admin Duyuru Paneli</b>
            </Button>
          </>
        )}
        {role && (
          <Button
            onClick={logout}
            sx={{
              color: "#fff",
              ml: 2,
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#ff6b6b', // Çıkış butonu için kırmızımsı hover
                backgroundColor: 'rgba(255, 107, 107, 0.1)'
              }
            }}
          >
            Çıkış
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  // Global body ve html styling
  useEffect(() => {
    // Body ve html elementlerini siyah yap
    document.body.style.backgroundColor = '#121212';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.backgroundColor = '#121212';

    // Root elementini de siyah yap
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.backgroundColor = '#121212';
      rootElement.style.minHeight = '100vh';
    }

    // Cleanup function
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.backgroundColor = '';
      if (rootElement) {
        rootElement.style.backgroundColor = '';
        rootElement.style.minHeight = '';
      }
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <BrowserRouter>
          <Box sx={{ bgcolor: '#121212', minHeight: '100vh' }}>
            <Nav />
            <Box
              component="main"
              sx={{
                pt: { xs: 6, sm: 8, md: 12 },
                bgcolor: '#121212',
                minHeight: '100vh'
              }}
            >
              <Container
                maxWidth="lg"
                sx={{
                  bgcolor: '#121212',
                  minHeight: '100vh',
                  py: 0
                }}
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/haberler" replace />} />
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/haberler" element={<HaberlerPage />} />
                  <Route path="/duyurular" element={<DuyurularPage />} />
                  <Route
                    path="/admin/haberler"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminHaberPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/duyurular"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDuyuruPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Container>
            </Box>
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}