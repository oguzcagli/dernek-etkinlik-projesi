import { useEffect, useState, useRef } from "react";
import { useCallback } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useSearchParams } from "react-router-dom";
import type { Haber } from "../models/Haber";
import { fetchHaberler, searchHaberler } from "../api/haberApi";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Slider, { type Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

// Özel "geri" oku
function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        left: 3,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        bgcolor: "rgba(0,0,0,0.7)",
        color: "#b5a174", // Altın renk
        "&:hover": {
          bgcolor: "rgba(0,0,0,0.9)",
          color: "#d4c49a" // Hover'da daha açık altın
        },
        width: 48,
        height: 48,
      }}
    >
      <ChevronLeft fontSize="large" />
    </IconButton>
  );
}

// Özel "ileri" oku
function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        right: 3,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        bgcolor: "rgba(0,0,0,0.7)",
        color: "#b5a174", // Altın renk
        "&:hover": {
          bgcolor: "rgba(0,0,0,0.9)",
          color: "#d4c49a" // Hover'da daha açık altın
        },
        width: 48,
        height: 48,
      }}
    >
      <ChevronRight fontSize="large" />
    </IconButton>
  );
}

// localStorage helper fonksiyonları
const CLICK_COUNTS_KEY = 'haber_click_counts';

const loadClickCounts = (): Record<number, number> => {
  try {
    const saved = localStorage.getItem(CLICK_COUNTS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Tıklama sayıları yüklenirken hata:', error);
    return {};
  }
};

const saveClickCounts = (clickCounts: Record<number, number>) => {
  try {
    localStorage.setItem(CLICK_COUNTS_KEY, JSON.stringify(clickCounts));
  } catch (error) {
    console.error('Tıklama sayıları kaydedilirken hata:', error);
  }
};

export function HaberlerPage() {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Haber | null>(null);
  const [clickCounts, setClickCounts] = useState<Record<number, number>>({});
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [searchParams] = useSearchParams();

  // Slider referansları
  const mainRef = useRef<Slider>(null);
  const thumbRef = useRef<Slider>(null);
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);

  // Sayfa yüklendiğinde tıklama sayılarını localStorage'dan al
  useEffect(() => {
    const savedClickCounts = loadClickCounts();
    setClickCounts(savedClickCounts);
  }, []);

  // Backend'den haberleri çek
  useEffect(() => {
    const loadHaberler = async () => {
      try {
        setLoading(true);
        setError(null);

        const searchQuery = searchParams.get('q');
        let data: Haber[];

        if (searchQuery) {
          data = await searchHaberler(searchQuery);
        } else {
          data = await fetchHaberler();
        }

        setHaberler(data);
      } catch (err) {
        console.error('Haberler yüklenirken hata:', err);
        setError('Haberler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    loadHaberler();
  }, [searchParams]);

  const loadHaberlerSilent = async () => {

    try {
      const searchQuery = searchParams.get('q');
      let data: Haber[];

      if (searchQuery) {
        data = await searchHaberler(searchQuery);
      } else {
        data = await fetchHaberler();
      }

      console.log("WebSocket ile haberler güncellendi", data.length);
      setHaberler(data);
    } catch (err) {
      console.error('Haberler yüklenirken hata:', err);

    }

  }

  const handleWebSocketMessage = useCallback(() => {
    console.log('WebSocket mesajı alındı - Kullanıcı sayfası yenileniyor...');
    setTimeout(() => {
      loadHaberlerSilent();
    }, 500);
  }, [searchParams]);
  useWebSocket('haberler', handleWebSocketMessage);



  useEffect(() => {
    if (mainRef.current && thumbRef.current) {
      setNav1(mainRef.current);
      setNav2(thumbRef.current);
    }
  }, [haberler]);

  const handleOpen = (haber: Haber) => {
    setSelected(haber);
    setOpen(true);

    // Tıklama sayısını artır ve localStorage'a kaydet
    const newClickCounts = { ...clickCounts, [haber.id]: (clickCounts[haber.id] || 0) + 1 };
    setClickCounts(newClickCounts);
    saveClickCounts(newClickCounts);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
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
  if (haberler.length === 0) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '60vh' }}>
          <Alert severity="info" sx={{ bgcolor: 'info.main', color: 'white' }}>
            {searchParams.get('q') ? 'Arama kriterlerinize uygun haber bulunamadı.' : 'Henüz hiç haber eklenmemiş.'}
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  const recent = haberler.slice(-5);
  const popular = [...haberler].sort((a, b) => (clickCounts[b.id] || 0) - (clickCounts[a.id] || 0)).slice(0, 6);

  const mainSettings: Settings = {
    asNavFor: nav2!,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    fade: true,
  };

  const thumbSettings: Settings = {
    asNavFor: nav1!,
    slidesToShow: Math.min(4, recent.length),
    swipeToSlide: true,
    focusOnSelect: true,
    arrows: false,
    infinite: recent.length > 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, recent.length),
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(2, recent.length),
        }
      }
    ]
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        px={{ xs: 2, md: 2 }}
        py={{ xs: 4, md: 4 }}
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary'
        }}
      >
        {/* Arama sonucu mesajı */}
        {searchParams.get('q') && (
          <Alert
            severity="info"
            sx={{ mb: 3, bgcolor: '#b5a174', color: 'black' }}
          >
            "{searchParams.get('q')}" için {haberler.length} haber bulundu.
          </Alert>
        )}

        {/* Ana Container - İki Sütun */}
        {recent.length > 0 && (
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
            {/* Sol Taraf - Slider'lar */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#white' // Başlık altın renk
                }}
              >
                Son Dakika Haberleri
              </Typography>

              {/* Ana Slider */}
              <Box sx={{ position: "relative", mb: 2 }}>
                <Slider {...mainSettings} ref={mainRef}>
                  {recent.map(h => (
                    <Box key={h.id} position="relative">
                      <CardMedia
                        component="img"
                        image={h.resimYolu ? `http://localhost:8080/${h.resimYolu}` : exampleImage}
                        alt={h.konu}
                        sx={{
                          width: "100%",
                          height: 400,
                          objectFit: "cover",
                          cursor: "pointer",
                          borderRadius: 2
                        }}
                        onClick={() => handleOpen(h)}
                      />
                      <Box
                        position="absolute"
                        bottom={16}
                        left={16}
                        color="white"
                        bgcolor="rgba(0,0,0,0.8)"
                        p={2}
                        borderRadius={1}
                        sx={{
                          backdropFilter: 'blur(8px)',
                          maxWidth: '80%',
                          border: '1px solid rgba(181, 161, 116, 0.3)' // Altın border
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold">{h.konu}</Typography>
                        <Typography variant="body2">
                          {h.icerik.length > 100 ? `${h.icerik.substring(0, 100)}...` : h.icerik}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Slider>
              </Box>

              {/* Thumbnail Slider */}
              {recent.length > 1 && (
                <Box>
                  <Slider {...thumbSettings} ref={thumbRef}>
                    {recent.map(h => (
                      <Box key={h.id} px={0.5}>
                        <CardMedia
                          component="img"
                          image={h.resimYolu ? `http://localhost:8080/${h.resimYolu}` : exampleImage}
                          alt={h.konu}
                          sx={{
                            width: '80%',
                            height: 80,
                            objectFit: "cover",
                            cursor: "pointer",
                            borderRadius: 1,
                            opacity: 0.8,
                            border: '2px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              opacity: 1,
                              borderColor: '#b5a174' // Hover'da altın border
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Slider>
                </Box>
              )}
            </Box>

            {/* Sağ Taraf - En Çok Tıklanan Haberler */}
            {popular.length > 0 && (
              <Box sx={{ width: 400, flexShrink: 0 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: 'white' // Başlık altın renk
                  }}
                >
                  En Çok Tıklanan Haberler
                </Typography>

                <Box
                  sx={{
                    height: 500,
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(181, 161, 116, 0.5)', // Altın scrollbar
                      borderRadius: '3px',
                      '&:hover': {
                        background: 'rgba(181, 161, 116, 0.7)',
                      },
                    },
                  }}
                >
                  <Stack spacing={2}>
                    {popular.map(h => (
                      <Card
                        key={h.id}
                        sx={{
                          display: "flex",
                          bgcolor: 'background.paper',
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "none",
                            boxShadow: '0 4px 12px rgba(181, 161, 116, 0.3)' // Altın glow
                          },
                          cursor: "pointer",
                          height: 130,
                          flexShrink: 0,
                          border: '1px solid rgba(181, 161, 116, 0.1)' // Çok hafif altın border
                        }}
                        onClick={() => handleOpen(h)}
                      >
                        <CardMedia
                          component="img"
                          image={h.resimYolu ? `http://localhost:8080/${h.resimYolu}` : exampleImage}
                          alt={h.konu}
                          sx={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            flexShrink: 0
                          }}
                        />
                        <CardContent sx={{
                          flex: 1,
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start'
                        }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: 'text.primary',
                              fontWeight: 'bold',
                              mb: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {h.konu}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {h.icerik}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Bölümler arası ayırıcı */}
        {recent.length > 0 && (
          <Box my={6}>
            <Divider sx={{ borderColor: "rgba(181, 161, 116, 0.2)" }} />
          </Box>
        )}

        {/* Filtre Butonları */}
        <Box textAlign="center" mb={4}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant={sortBy === "recent" ? "contained" : "outlined"}
              onClick={() => setSortBy("recent")}
              sx={{
                ...(sortBy === "recent"
                  ? {
                    bgcolor: '#b5a174',
                    color: 'black',
                    '&:hover': { bgcolor: '#d4c49a' }
                  }
                  : {
                    borderColor: '#b5a174',
                    color: '#b5a174',
                    '&:hover': {
                      borderColor: '#d4c49a',
                      bgcolor: 'rgba(181, 161, 116, 0.1)'
                    }
                  }
                )
              }}
            >
              <b>Son Eklenen</b>
            </Button>
            <Button
              variant={sortBy === "popular" ? "contained" : "outlined"}
              onClick={() => setSortBy("popular")}
              sx={{
                ...(sortBy === "popular"
                  ? {
                    bgcolor: '#b5a174',
                    color: 'black',
                    '&:hover': { bgcolor: '#d4c49a' }
                  }
                  : {
                    borderColor: '#b5a174',
                    color: '#b5a174',
                    '&:hover': {
                      borderColor: '#d4c49a',
                      bgcolor: 'rgba(181, 161, 116, 0.1)'
                    }
                  }
                )
              }}
            >
              <b>En Çok Tıklanan</b>
            </Button>
          </Stack>
        </Box>

        {/* Alt Grid Bölümü - FlexBox ile */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center'
          }}
        >
          {/* Filtrelenmiş haberleri göster */}
          {(sortBy === "recent"
            ? [...haberler].sort((a, b) => b.id - a.id) // Son eklenen: En yeni başta
            : [...haberler].sort((a, b) => (clickCounts[b.id] || 0) - (clickCounts[a.id] || 0)) // En çok tıklanan: En popüler başta
          ).map(h => (
            <Box
              key={h.id}
              sx={{
                width: { xs: '100%', sm: '45%', md: '22%' },
                minWidth: '280px',
                maxWidth: '300px'
              }}
            >
              <Card
                sx={{
                  height: 350,
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(181, 161, 116, 0.1)',
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: '0 8px 24px rgba(181, 161, 116, 0.2)', // Altın glow
                    borderColor: 'rgba(181, 161, 116, 0.3)'
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={h.resimYolu ? `http://localhost:8080/${h.resimYolu}` : exampleImage}
                  alt={h.konu}
                  sx={{
                    height: 180,
                    objectFit: "cover",
                    cursor: "pointer"
                  }}
                  onClick={() => handleOpen(h)}
                />
                <CardContent sx={{ flexGrow: 1, p: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: "clamp(0.8rem,1.5vw,1rem)",
                      color: 'text.primary'
                    }}
                  >
                    {h.konu}
                  </Typography>
                  {/* Tıklama sayısını göster (en çok tıklanan modunda) */}
                  {sortBy === "popular" && clickCounts[h.id] > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#b5a174', // Altın renk
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        display: 'block',
                        mt: 0.5
                      }}
                    >

                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleOpen(h)}
                    sx={{
                      color: '#b5a174',
                      '&:hover': {
                        bgcolor: 'rgba(181, 161, 116, 0.1)'
                      }
                    }}
                  >
                    <b>Haberi Oku</b>
                  </Button>
                  {h.haberLinki && (
                    <Button
                      size="small"
                      href={h.haberLinki}
                      target="_blank"
                      sx={{
                        color: '#d4c49a',
                        '&:hover': {
                          bgcolor: 'rgba(212, 196, 154, 0.1)'
                        }
                      }}
                    >
                      <b>Kaynak</b>
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Box>
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
              border: '1px solid rgba(181, 161, 116, 0.2)'
            }
          }}
        >
          <DialogTitle sx={{
            color: 'text.primary',
            borderBottom: '1px solid rgba(181, 161, 116, 0.2)',
            pb: 2,
            mb: 0
          }}>
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
                  src={`http://localhost:8080/${selected.resimYolu}`}
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
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block' }}>
                📅 Yayınlanma Tarihi: {new Date(selected.gecerlilikTarihi).toLocaleDateString('tr-TR')}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(181, 161, 116, 0.2)' }}>
            {selected?.haberLinki && (
              <Button
                href={selected.haberLinki}
                target="_blank"
                sx={{
                  color: '#d4c49a',
                  '&:hover': {
                    bgcolor: 'rgba(212, 196, 154, 0.1)'
                  }
                }}
              >
                <b>Kaynak Linki</b>
              </Button>
            )}
            <Button
              onClick={handleClose}
              sx={{
                color: '#b5a174',
                '&:hover': {
                  bgcolor: 'rgba(181, 161, 116, 0.1)'
                }
              }}
            >
              <b>Kapat</b>
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}