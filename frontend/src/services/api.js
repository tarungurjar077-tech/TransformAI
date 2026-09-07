const API_BASE = '/api';

export const api = {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload/file`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Failed to upload document');
    }
    return res.json();
  },

  async uploadText(title, text) {
    const res = await fetch(`${API_BASE}/upload/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Text upload failed' }));
      throw new Error(err.detail || 'Failed to submit text');
    }
    return res.json();
  },

  async analyze(docId, text = null) {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_id: docId, text }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
      throw new Error(err.detail || 'Failed to analyze document');
    }
    return res.json();
  },

  async getTransformMeta() {
    const res = await fetch(`${API_BASE}/transform/meta`);
    if (!res.ok) throw new Error('Failed to load transformation metadata');
    return res.json();
  },

  async transformSingle(docId, transformationType, tone = 'balanced', apiKey = null, persona = 'executive', length = 'standard') {
    const res = await fetch(`${API_BASE}/transform/single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc_id: docId,
        transformation_type: transformationType,
        tone,
        api_key: apiKey || null,
        persona,
        length
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Transformation failed' }));
      throw new Error(err.detail || 'Failed to generate transformation');
    }
    return res.json();
  },

  async transformBatch(docId, types = null, tone = 'balanced', apiKey = null, persona = 'executive', length = 'standard') {
    const res = await fetch(`${API_BASE}/transform/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc_id: docId,
        types: types || null,
        tone,
        api_key: apiKey || null,
        persona,
        length
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Batch transformation failed' }));
      throw new Error(err.detail || 'Failed to run batch transformations');
    }
    return res.json();
  },

  async saveTransform(docId, transformationType, content) {
    const res = await fetch(`${API_BASE}/transform/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc_id: docId,
        transformation_type: transformationType,
        content,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Save failed' }));
      throw new Error(err.detail || 'Failed to save changes');
    }
    return res.json();
  },

  async getHistory() {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to load document history');
    return res.json();
  },

  async getHistoryDetail(docId) {
    const res = await fetch(`${API_BASE}/history/${docId}`);
    if (!res.ok) throw new Error('Failed to load document details');
    return res.json();
  },

  async deleteHistoryItem(docId) {
    const res = await fetch(`${API_BASE}/history/${docId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  },

  getPackDownloadUrl(docId) {
    return `${API_BASE}/download/pack/${docId}`;
  },

  getSingleDownloadUrl(docId, type) {
    return `${API_BASE}/download/single/${docId}/${type}`;
  }
};
