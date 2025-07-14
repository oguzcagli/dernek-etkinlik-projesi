import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Duyuru } from "../models/Duyuru";
import { fetchDuyurular, searchDuyurular } from "../api/duyuruApi";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import exampleImage from "../assets/example.jpg";

// Koyu tema - Altın tonlarıyla uyumlu
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b5a174', // Logo rengi - altın/bronz ton
    },
    secondary: {
      main: '#d4c49a', // Daha açık altın ton
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

export function DuyurularPage() {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Duyuru | null>(null);
  const [searchParams] = useSearchParams();

  // Backend'den duyuruları çek
  useEffect(() => {
    const loadDuyurular = async () => {
      try {
        setLoading(true);
        setError(null);

        const searchQuery = searchParams.get('q');
        let data: Duyuru[];

        if (searchQuery) {
          data = await searchDuyurular(searchQuery);
        } else {
          data = await fetchDuyurular();
        }

        data = data.sort((a, b) => new Date(b.createdTime || 0).getTime() - new Date(a.createdTime || 0).getTime());

        setDuyurular(data);
      } catch (err) {
        console.error('Duyurular yüklenirken hata:', err);
        setError('Duyurular yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    loadDuyurular();
  }, [searchParams]);

  const handleOpen = (duyuru: Duyuru) => {
    setSelected(duyuru);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  // Resim göster - eğer resimYolu varsa kullan, yoksa varsayılan
  const getImageSrc = (duyuru: Duyuru) => {
    if (duyuru.resimYolu) {
      return `http://localhost:8080/${duyuru.resimYolu}`;
    }
    return exampleImage;
  };

  // Loading durumu
  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            bgcolor: 'background.default'
          }}
        >
          <CircularProgress size={60} sx={{ color: '#b5a174' }} />
        </Box>
      </ThemeProvider>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '60vh' }}>
          <Alert severity="error" sx={{ bgcolor: 'error.main', color: 'white' }}>
            {error}
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  // Veri yoksa
  if (duyurular.length === 0) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '60vh' }}>
          <Alert severity="info" sx={{ bgcolor: '#b5a174', color: 'black' }}>
            {searchParams.get('q') ? 'Arama kriterlerinize uygun duyuru bulunamadı.' : 'Henüz hiç duyuru eklenmemiş.'}
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary',
          p: 4
        }}
      >
        {/* Başlık */}
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            textAlign: 'center',
            color: '#b5a174', // Altın renk başlık
            fontWeight: 'bold'
          }}
        >

        </Typography>

        {/* Arama sonucu mesajı */}
        {searchParams.get('q') && (
          <Alert
            severity="info"
            sx={{ mb: 3, bgcolor: '#b5a174', color: 'black' }}
          >
            "{searchParams.get('q')}" için {duyurular.length} duyuru bulundu.
          </Alert>
        )}

        {/* Duyurular List - Alt Alta */}
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          {duyurular.map(d => (
            <Card
              key={d.id}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(181, 161, 116, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(181, 161, 116, 0.5)',
                  boxShadow: '0 4px 16px rgba(181, 161, 116, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => handleOpen(d)}
            >
              <Box
                sx={{
                  display: 'flex',
                  height: { xs: 'auto', sm: 250 },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}
              >
                {/* Sol taraf - Resim (Kare) */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: 160 },
                    height: { xs: 200, sm: 200 },
                    flexShrink: 0,
                    position: 'relative'
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getImageSrc(d)}
                    alt={d.konu}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {/* Chip'ler sol üstte */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      display: 'flex',
                      gap: 0.5
                    }}
                  >
                    <Chip
                      label="DUYURU"
                      size="small"
                      sx={{
                        bgcolor: '#b5a174', // Altın renk
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }}
                    />
                    {d.resimYolu && (
                      <Chip
                        icon={<ImageIcon sx={{ fontSize: '14px !important' }} />}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Sağ taraf - İçerik */}
                <CardContent
                  sx={{
                    flex: 1,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    {/* Başlık */}
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 'bold',
                        mb: 2,
                        lineHeight: 1.3
                      }}
                    >
                      {d.konu}
                    </Typography>

                    {/* Açıklama */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 4, sm: 3 },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {d.icerik}
                    </Typography>
                  </Box>

                  {/* Alt kısım - Tarih ve Buton */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2,
                      pt: 2,
                      borderTop: '1px solid rgba(181, 161, 116, 0.2)'
                    }}
                  >
                    {/* Tarih */}
                    {d.gecerlilikTarihi && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.85rem'
                        }}
                      >
                        {new Date(d.gecerlilikTarihi).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    )}

                    {/* Detay Butonu */}
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#b5a174',
                        color: '#b5a174',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: '#b5a174',
                          color: 'black',
                          borderColor: '#b5a174'
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(d);
                      }}
                    >
                      Detayları Gör
                    </Button>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Detay Popup */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderRadius: 2,
              border: '1px solid rgba(181, 161, 116, 0.3)'
            }
          }}
        >
          <DialogTitle sx={{
            borderBottom: '1px solid rgba(181, 161, 116, 0.2)',
            pb: 2,
            mb: 0
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label="DUYURU"
                size="small"
                sx={{
                  bgcolor: '#b5a174',
                  color: 'black',
                  fontWeight: 'bold'
                }}
              />
              {selected?.resimYolu && (
                <Chip
                  icon={<ImageIcon />}
                  label="Resimli"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#b5a174',
                    color: '#b5a174'
                  }}
                />
              )}
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#b5a174', // Altın renk başlık
                lineHeight: 1.3,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              {selected?.konu}
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            {selected?.resimYolu && (
              <Box sx={{ mb: 3 }}>
                <img
                  src={getImageSrc(selected)}
                  alt={selected.konu}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid rgba(181, 161, 116, 0.2)'
                  }}
                />
              </Box>
            )}
            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                lineHeight: 1.8,
                whiteSpace: 'pre-line', // Satır sonlarını koru
                fontSize: '1.1rem'
              }}
            >
              {selected?.icerik}
            </Typography>
            {selected?.gecerlilikTarihi && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  mt: 3,
                  display: 'block',
                  fontSize: '0.9rem'
                }}
              >
                📅 Yayınlanma Tarihi: {new Date(selected.gecerlilikTarihi).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{
            p: 3,
            borderTop: '1px solid rgba(181, 161, 116, 0.2)'
          }}>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                bgcolor: '#b5a174',
                color: 'black',
                fontWeight: 'bold',
                px: 4,
                '&:hover': {
                  bgcolor: '#d4c49a'
                }
              }}
            >
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}