
import { useState, useEffect, useCallback } from "react";
import type { Duyuru } from "../models/Duyuru";
import { fetchAllDuyurular, createDuyuruWithImage, updateDuyuruWithImage, deleteDuyuru } from "../api/duyuruApi";
import { useWebSocket } from "../hooks/useWebSocket";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
  Chip,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  Snackbar,
  Tooltip,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings,
  Campaign as CampaignIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

// Dark theme for admin panel - Altın tonlu
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b5a174', // Altın renk
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

interface DuyuruFormData {
  konu: string;
  icerik: string;
  gecerlilikTarihi: string;
  resim?: File;
}

export function AdminDuyuruPage() {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDuyuru, setEditingDuyuru] = useState<Duyuru | null>(null);
  const [deletingDuyuru, setDeletingDuyuru] = useState<Duyuru | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success'
  });

  // Form state
  const [formData, setFormData] = useState<DuyuruFormData>({
    konu: '',
    icerik: '',
    gecerlilikTarihi: '',
    resim: undefined
  });

  // Load duyurular
  const loadDuyurular = async () => {
    try {
      setLoading(true);
      const data = await fetchAllDuyurular();
      setDuyurular(data);
    } catch (error) {
      console.error('Duyurular yüklenirken hata:', error);
      showSnackbar('Duyurular yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };


  const loadDuyurularSilent = async () => {

    try {
      const data = await fetchAllDuyurular();
      console.log("WebSocket ile Duyurular Güncellendi", data.length);
      setDuyurular(data);
    } catch (err) {
      console.error('Duyurular Güncellenemedi', err);
    }
  };

  const handleWebSocketMessage = useCallback(() => {
    console.log('WebSocket mesajı alındı - Duyurular Güncelleniyor...');
    setTimeout(() => {
      loadDuyurularSilent();
    }, 500);
  }, []);

  useWebSocket('duyurular', handleWebSocketMessage);

  useEffect(() => {
    loadDuyurular();
  }, []);

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Dialog functions
  const openCreateDialog = () => {
    setEditingDuyuru(null);
    setFormData({
      konu: '',
      icerik: '',
      gecerlilikTarihi: '',
      resim: undefined
    });
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEditDialog = (duyuru: Duyuru) => {
    setEditingDuyuru(duyuru);
    setFormData({
      konu: duyuru.konu,
      icerik: duyuru.icerik,
      gecerlilikTarihi: duyuru.gecerlilikTarihi ? duyuru.gecerlilikTarihi.split('T')[0] : '',
      resim: undefined
    });
    // Mevcut resmi göster
    if (duyuru.resimYolu) {
      setImagePreview(`http://localhost:8080/${duyuru.resimYolu}`);
    } else {
      setImagePreview(null);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingDuyuru(null);
    setImagePreview(null);
  };

  const openDeleteDialog = (duyuru: Duyuru) => {
    setDeletingDuyuru(duyuru);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingDuyuru(null);
  };

  // Form handlers
  const handleInputChange = (field: keyof Omit<DuyuruFormData, 'resim'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resim: file }));

      // Resim önizlemesi oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, resim: undefined }));
    setImagePreview(null);
  };

  const getImageSrc = (duyuru: Duyuru) => {
    if (duyuru.resimYolu) {
      return `http://localhost:8080/${duyuru.resimYolu}`;
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!formData.konu.trim() || !formData.icerik.trim()) {
      showSnackbar('Konu ve içerik alanları zorunludur', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const duyuruData = {
        konu: formData.konu.trim(),
        icerik: formData.icerik.trim(),
        gecerlilikTarihi: formData.gecerlilikTarihi ? `${formData.gecerlilikTarihi}T23:59:59` : undefined
      };

      if (editingDuyuru) {
        await updateDuyuruWithImage(editingDuyuru.id, duyuruData, formData.resim);
        showSnackbar('Duyuru başarıyla güncellendi', 'success');
      } else {
        await createDuyuruWithImage(duyuruData, formData.resim);
        showSnackbar('Duyuru başarıyla oluşturuldu', 'success');
      }

      await loadDuyurular();
      closeDialog();
    } catch (error) {
      console.error('Duyuru kaydedilirken hata:', error);
      showSnackbar('Duyuru kaydedilirken hata oluştu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingDuyuru) return;

    try {
      setSubmitting(true);
      await deleteDuyuru(deletingDuyuru.id);
      showSnackbar('Duyuru başarıyla silindi', 'success');
      await loadDuyurular();
      closeDeleteDialog();
    } catch (error) {
      console.error('Duyuru silinirken hata:', error);
      showSnackbar('Duyuru silinirken hata oluştu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Tarih yok';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3
        }}
      >
        {/* Header */}
        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AdminPanelSettings sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Duyuru Yönetimi
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Duyurular oluşturun, düzenleyin ve yönetin
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Chip
                label={`${duyurular.length} duyuru`}
                color="primary"
                variant="outlined"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#b5a174' }} />
          </Box>
        ) : duyurular.length === 0 ? (
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CampaignIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                  Henüz hiç duyuru eklenmemiş
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateDialog}
                  sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 'bold' }}
                >
                  İlk Duyuruyu Ekle
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.900' }}>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Resim</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Konu</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>İçerik</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Yayınlanma Tarihi</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }} align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {duyurular.map((duyuru) => (
                  <TableRow key={duyuru.id} sx={{ '&:hover': { bgcolor: 'grey.900' } }}>
                    <TableCell sx={{ color: 'text.primary' }}>{duyuru.id}</TableCell>
                    <TableCell>
                      {duyuru.resimYolu ? (
                        <Avatar
                          src={getImageSrc(duyuru)!}
                          variant="rounded"
                          sx={{ width: 60, height: 40 }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 60,
                            height: 40,
                            bgcolor: 'grey.700',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <ImageIcon sx={{ color: 'grey.500', fontSize: 20 }} />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary', maxWidth: 200 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {duyuru.konu}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', maxWidth: 300 }}>
                      <Typography variant="body2" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {duyuru.icerik}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      <Typography variant="body2">
                        {formatDate(duyuru.gecerlilikTarihi)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Düzenle">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(duyuru)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(duyuru)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'primary.main',
            color: 'black',
            '&:hover': {
              bgcolor: 'secondary.main',
            },
          }}
          onClick={openCreateDialog}
        >
          <AddIcon />
        </Fab>

        {/* Create/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={closeDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'background.paper',
              color: 'text.primary'
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {editingDuyuru ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Duyuru Konusu"
                value={formData.konu}
                onChange={handleInputChange('konu')}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'grey.600' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                  '& .MuiInputBase-input': { color: 'text.primary' },
                }}
              />
              <TextField
                fullWidth
                label="Duyuru İçeriği"
                value={formData.icerik}
                onChange={handleInputChange('icerik')}
                multiline
                rows={4}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'grey.600' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                  '& .MuiInputBase-input': { color: 'text.primary' },
                }}
              />
              <TextField
                fullWidth
                label="Yayınlanma Tarihi"
                type="date"
                value={formData.gecerlilikTarihi}
                onChange={handleInputChange('gecerlilikTarihi')}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'grey.600' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                  '& .MuiInputBase-input': { color: 'text.primary' },
                }}
              />

              {/* Resim Yükleme Alanı */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 2 }}>
                  Duyuru Resmi (Opsiyonel)
                </Typography>

                {imagePreview ? (
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imagePreview}
                      alt="Önizleme"
                      style={{
                        width: '100%',
                        maxWidth: '300px',
                        height: 'auto',
                        borderRadius: '8px',
                        border: '2px solid #333'
                      }}
                    />
                    <IconButton
                      onClick={removeImage}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                        width: 32,
                        height: 32
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{
                      borderColor: 'grey.600',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(181, 161, 116, 0.1)'
                      },
                      height: 56,
                      borderStyle: 'dashed'
                    }}
                    fullWidth
                  >
                    Resim Seç
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={closeDialog}
              variant="outlined"
              sx={{ borderColor: 'grey.600', color: 'text.primary' }}
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : null}
              sx={{
                bgcolor: 'primary.main',
                color: 'black',
                fontWeight: 'bold',
                '&:hover': { bgcolor: 'secondary.main' }
              }}
            >
              {submitting ? 'Kaydediliyor...' : (editingDuyuru ? 'Güncelle' : 'Oluştur')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          PaperProps={{
            sx: {
              bgcolor: 'background.paper',
              color: 'text.primary'
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              Duyuruyu Sil
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              "<strong>{deletingDuyuru?.konu}</strong>" başlıklı duyuruyu silmek istediğinizden emin misiniz?
            </Typography>
            <Alert severity="warning" sx={{ mt: 2, bgcolor: 'warning.main', color: 'black' }}>
              Bu işlem geri alınamaz!
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={closeDeleteDialog}
              variant="outlined"
              sx={{ borderColor: 'grey.600', color: 'text.primary' }}
            >
              İptal
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : <DeleteIcon />}
              sx={{
                bgcolor: 'error.main',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { bgcolor: 'error.dark' }
              }}
            >
              {submitting ? 'Siliniyor...' : 'Sil'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={snackbar.type}
            onClose={handleCloseSnackbar}
            sx={{
              bgcolor: snackbar.type === 'success' ? 'success.main' : 'error.main',
              color: 'white'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}