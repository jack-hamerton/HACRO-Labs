import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Document, Page, pdfjs } from 'react-pdf';
import { Upload, FileText, Edit2, Trash2, CheckCircle, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const AdminNewsletterPage = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'newspaper',
    published: true,
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const items = await pb.collection('newsletters').getFullList({ sort: '-published_date', $autoCancel: false });
      setNewsletters(items);
    } catch (err) {
      console.error('Failed to load newsletters', err);
      toast.error('Could not load newsletters');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'newspaper',
      published: true,
      file: null,
    });
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'newspaper',
      published: !!item.published,
      file: null,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, file: files[0] || null }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!editingItem && !formData.file) {
      toast.error('Please upload a file for the newsletter');
      return;
    }

    setUploading(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description.trim());
      payload.append('type', formData.type);
      payload.append('published', formData.published ? 'true' : 'false');
      payload.append('published_date', new Date().toISOString().split('T')[0]);
      if (formData.file) {
        payload.append('file', formData.file);
      }

      if (editingItem) {
        await pb.collection('newsletters').update(editingItem.id, payload, { $autoCancel: false });
        toast.success('Newsletter updated successfully');
      } else {
        await pb.collection('newsletters').create(payload, { $autoCancel: false });
        toast.success('Newsletter created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchNewsletters();
    } catch (err) {
      console.error('Save error', err);
      toast.error('Unable to save newsletter');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this newsletter item?')) return;
    try {
      await pb.collection('newsletters').delete(item.id, { $autoCancel: false });
      toast.success('Newsletter deleted');
      fetchNewsletters();
    } catch (err) {
      console.error('Delete error', err);
      toast.error('Failed to delete newsletter');
    }
  };

  const handlePreview = (item) => {
    if (item.type === 'newspaper') {
      setPreviewPdf(item);
      setPageNumber(1);
    } else {
      const url = pb.files.getUrl(item, item.file);
      window.open(url, '_blank');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <AdminLayout>
      <Helmet><title>Newsletter Management - Hacro Labs</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Newsletter Management</h2>
            <p className="text-slate-500 mt-1">Upload, update, and publish newsletter content for the public newsletter page.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Add Newsletter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading newsletter items…</div>
          ) : newsletters.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
              No newsletter items yet. Create one to publish updates.
            </div>
          ) : (
            newsletters.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.type === 'video' ? 'Video' : 'Newsletter'}</p>
                    <h3 className="text-xl font-semibold text-slate-900 mt-2">{item.title}</h3>
                    {item.description && <p className="mt-2 text-slate-600">{item.description}</p>}
                    <p className="mt-3 text-xs text-slate-500">Published: {item.published_date ? new Date(item.published_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handlePreview(item)} className="btn-outline flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button onClick={() => openEditModal(item)} className="btn-secondary flex items-center gap-2">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDelete(item)} className="btn-destructive flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-3xl w-full rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{editingItem ? 'Edit Newsletter' : 'Create Newsletter'}</h3>
                <p className="text-sm text-slate-500">Publish or update content that shows on the public newsletter page.</p>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input min-h-[120px]"
                    rows="4"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="form-label">Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="form-input">
                      <option value="newspaper">Newspaper</option>
                      <option value="video">Video</option>
                      <option value="report">Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Published</label>
                    <div className="mt-2 flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" name="published" checked={formData.published} onChange={handleInputChange} className="form-checkbox" />
                        Publish now
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">File</label>
                    <input type="file" name="file" onChange={handleInputChange} className="form-input" accept="application/pdf,video/*" />
                    {editingItem && !formData.file && (
                      <p className="text-xs text-slate-500 mt-2">Uploading a new file is optional when editing.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-outline">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Saving…' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{previewPdf.title}</h3>
                <p className="text-sm text-slate-500">PDF Preview</p>
              </div>
              <button onClick={() => setPreviewPdf(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[80vh]">
              <Document
                file={pb.files.getUrl(previewPdf, previewPdf.file)}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex justify-center"
              >
                {Array.from(new Array(numPages || 1), (el, index) => (
                  <Page key={index} pageNumber={index + 1} width={700} renderTextLayer={false} renderAnnotationLayer={false} />
                ))}
              </Document>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminNewsletterPage;
