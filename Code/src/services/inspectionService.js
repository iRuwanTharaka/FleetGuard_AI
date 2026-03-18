import api from '../api/api';

export const inspectionService = {

  create: (body) => api.post('/inspections', body).then(r => r.data),

  getAll:  (filters={}) => api.get('/inspections', { params: filters }).then(r => r.data),

  getMine: (page=1)     => api.get('/inspections/my', { params:{page} }).then(r => r.data),

  getOne:  (id)         => api.get(`/inspections/${id}`).then(r => r.data),

  complete:(id)         => api.post(`/inspections/${id}/complete`).then(r => r.data),

  // Upload a single photo — photoFile is a File/Blob, photoType is e.g. 'front'
  uploadPhoto: (inspectionId, photoFile, photoType) => {
    const form = new FormData();
    form.append('photo', photoFile);
    form.append('photo_type', photoType);
    return api.post(`/photos/upload/${inspectionId}`, form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then(r => r.data);
  },

  // Upload all 8 photos in one shot
  // photosArr = [File, File, ...], typesArr = ['front','rear','left','right',...]
  uploadBatch: (inspectionId, photosArr, typesArr) => {
    const form = new FormData();
    photosArr.forEach(f => form.append('photos', f));
    form.append('photo_types', JSON.stringify(typesArr));
    return api.post(`/photos/upload-batch/${inspectionId}`, form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then(r => r.data);
  },

  // Upload signature — blob from canvas.toBlob()
  uploadSignature: (inspectionId, blob, signerType) => {
    const form = new FormData();
    form.append('signature', blob, `sig_${signerType}.png`);
    form.append('signer_type', signerType);
    return api.post(`/photos/signature/${inspectionId}`, form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then(r => r.data);
  },

  getPhotos: (inspectionId) => api.get(`/photos/${inspectionId}`).then(r => r.data),

  analyzeWithAI: (inspectionId) => api.post(`/inspections/${inspectionId}/analyze`).then(r => r.data),

  generatePdf: (inspectionId) =>
    api.post(`/inspections/${inspectionId}/generate-pdf`).then(r => r.data),

  getPdfUrl: (inspectionId) => {
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
    return `${base}/inspections/${inspectionId}/pdf`;
  },

  reviewInspection: (inspectionId, reviewStatus, notes = '') =>
    api.post(`/inspections/${inspectionId}/review`, { review_status: reviewStatus, notes }).then(r => r.data),
};
