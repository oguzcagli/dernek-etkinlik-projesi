import { useState, useEffect } from "react";
import type { Haber } from "../models/Haber";
import { fetchHaberler, createHaberWithImage, updateHaberWithImage, deleteHaber } from "../api/haberApi";
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
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings,
  Article as ArticleIcon,
  Link as LinkIcon,
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

interface HaberFormData {
  konu: string;
  icerik: string;
  gecerlilikTarihi: string;
  haberLinki: string;
  kategori: number; // EKLENEN ALAN
  resim?: File;
}

// Kategori listesi - Backend'den gelebilir
const kategoriler = [
  { id: 1, ad: "Genel" },
  { id: 2, ad: "Spor" },
  { id: 3, ad: "Kültür" },
  { id: 4, ad: "Eğitim" },
  { id: 5, ad: "Teknoloji" },
];

export function AdminHaberPage() {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingHaber, setEditingHaber] = useState<Haber | null>(null);
  const [deletingHaber, setDeletingHaber] = useState<Haber | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success'
  });

  // Form state - kategori field'i eklendi
  const [formData, setFormData] = useState<HaberFormData>({
    konu: '',
    icerik: '',
    gecerlilikTarihi: '',
    haberLinki: '',
    kategori: 1, // Default kategori
    resim: undefined
  });

  // Load haberler
  const loadHaberler = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/haberler/admin");
      const apiResponse = await res.json();
      const data = apiResponse.data || [];
      console.log("dataaaa" + data)
      setHaberler(data);
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error);
      showSnackbar('Haberler yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHaberler();
  }, []);

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Dialog functions
  const openCreateDialog = () => {
    setEditingHaber(null);
    setFormData({
      konu: '',
      icerik: '',
      gecerlilikTarihi: '',
      haberLinki: '',
      kategori: 1, // Default kategori
      resim: undefined
    });
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEditDialog = (haber: Haber) => {
    setEditingHaber(haber);
    setFormData({
      konu: haber.konu,
      icerik: haber.icerik,
      gecerlilikTarihi: haber.gecerlilikTarihi ? haber.gecerlilikTarihi.split('T')[0] : '',
      haberLinki: haber.haberLinki || '',
      kategori: haber.kategori?.id || 1, // Haber'in kategori ID'sini kullan
      resim: undefined
    });
    // Mevcut resmi göster
    if (haber.resimYolu) {
      setImagePreview(`http://localhost:8080/${haber.resimYolu}`);
    } else {
      setImagePreview(null);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingHaber(null);
    setImagePreview(null);
  };

  const openDeleteDialog = (haber: Haber) => {
    setDeletingHaber(haber);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingHaber(null);
  };

  // Form handlers
  const handleInputChange = (field: keyof Omit<HaberFormData, 'resim'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'kategori' ? Number(e.target.value) : e.target.value
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

  const getImageSrc = (haber: Haber) => {
    if (haber.resimYolu) {
      return `http://localhost:8080/${haber.resimYolu}`;
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

      // Seçilen kategori ID'sine göre kategori objesini bul
      const secilenKategori = kategoriler.find(k => k.id === formData.kategori);

      if (!secilenKategori) {
        showSnackbar('Geçersiz kategori seçimi', 'error');
        return;
      }

      // Backend'e gönderilecek data - seçilen kategori object olarak
      const haberData = {
        konu: formData.konu.trim(),
        icerik: formData.icerik.trim(),
        gecerlilikTarihi: formData.gecerlilikTarihi ? `${formData.gecerlilikTarihi}T23:59:59` : undefined,
        haberLinki: formData.haberLinki.trim() || undefined,
        kategori: secilenKategori // Seçilen kategori objesi
      };

      console.log('Gönderilen data:', haberData); // Debug için

      if (editingHaber) {
        await updateHaberWithImage(editingHaber.id, haberData, formData.resim);
        showSnackbar('Haber başarıyla güncellendi', 'success');
      } else {
        await createHaberWithImage(haberData, formData.resim);
        showSnackbar('Haber başarıyla oluşturuldu', 'success');
      }

      await loadHaberler();
      closeDialog();
    } catch (error) {
      console.error('Haber kaydedilirken hata:', error);
      showSnackbar('Haber kaydedilirken hata oluştu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingHaber) return;

    try {
      setSubmitting(true);
      await deleteHaber(deletingHaber.id);
      showSnackbar('Haber başarıyla silindi', 'success');
      await loadHaberler();
      closeDeleteDialog();
    } catch (error) {
      console.error('Haber silinirken hata:', error);
      showSnackbar('Haber silinirken hata oluştu', 'error');
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

  const getKategoriAdi = (kategoriId: number) => {
    const kategori = kategoriler.find(k => k.id === kategoriId);
    return kategori ? kategori.ad : 'Bilinmiyor';
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
                  Haber Yönetimi
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Haberler oluşturun, düzenleyin ve yönetin
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Chip
                label={`${haberler.length} haber`}
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
        ) : haberler.length === 0 ? (
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <ArticleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                  Henüz hiç haber eklenmemiş
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateDialog}
                  sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 'bold' }}
                >
                  İlk Haberi Ekle
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.900' }}>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Resim</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Konu</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>İçerik</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Kategori</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Yayınlanma Tarihi</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Link</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }} align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {haberler.map((haber) => (
                  <TableRow key={haber.id} sx={{ '&:hover': { bgcolor: 'grey.900' } }}>

                    <TableCell>
                      {haber.resimYolu ? (
                        <Avatar
                          src={getImageSrc(haber)!}
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
                        {haber.konu}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', maxWidth: 300 }}>
                      <Typography variant="body2" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {haber.icerik}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      <Chip
                        label={haber.kategori?.ad || 'Bilinmiyor'}
                        size="small"
                        sx={{ bgcolor: 'primary.main', color: 'black' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      <Typography variant="body2">
                        {formatDate(haber.gecerlilikTarihi)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {haber.haberLinki ? (
                        <Tooltip title={haber.haberLinki}>
                          <IconButton
                            size="small"
                            href={haber.haberLinki}
                            target="_blank"
                            sx={{ color: 'primary.main' }}
                          >
                            <LinkIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                          Yok
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Düzenle">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(haber)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(haber)}
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
            {/* HTML nested header problemi çözüldü */}
            <Box sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
              {editingHaber ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Haber Konusu"
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
                label="Haber İçeriği"
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

              {/* KATEGORİ FIELD'I EKLENDİ */}
              <TextField
                select
                fullWidth
                label="Kategori"
                value={formData.kategori}
                onChange={handleInputChange('kategori')}
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
              >
                {kategoriler.map((kategori) => (
                  <MenuItem key={kategori.id} value={kategori.id}>
                    {kategori.ad}
                  </MenuItem>
                ))}
              </TextField>

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
              <TextField
                fullWidth
                label="Haber Linki (Opsiyonel)"
                value={formData.haberLinki}
                onChange={handleInputChange('haberLinki')}
                placeholder="https://..."
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
                  Haber Resmi
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
              {submitting ? 'Kaydediliyor...' : (editingHaber ? 'Güncelle' : 'Oluştur')}
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
            <Box sx={{ fontWeight: 'bold', color: 'error.main', fontSize: '1.25rem' }}>
              Haberi Sil
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              "<strong>{deletingHaber?.konu}</strong>" başlıklı haberi silmek istediğinizden emin misiniz?
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