import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { Play, Upload, FileText, Video, Eye, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const sdgGoals = [
  {
    code: '1',
    title: 'No Poverty',
    description: 'We strengthen livelihoods through savings, access to fair credit, and community-led economic support.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#E5243B" />
        <text x="8" y="18" fontSize="14" fontFamily="Inter, sans-serif" fill="#fff" fontWeight="700">1</text>
        <g fill="#fff">
          <path d="M24 28c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z" />
          <path d="M36 28c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z" />
          <path d="M19 44c0-3 3-5 6-5h14c3 0 6 2 6 5v4H19v-4z" />
        </g>
      </svg>
    ),
    accent: 'from-green-600/20 to-emerald-500/15 text-green-100 border-green-400/30',
  },
  {
    code: '3',
    title: 'Good Health',
    description: 'We promote wellness, resilience, and practical support that helps families thrive with dignity.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#4C9F38" />
        <text x="8" y="18" fontSize="14" fontFamily="Inter, sans-serif" fill="#fff" fontWeight="700">3</text>
        <path d="M18 34c0-8 6-14 14-14s14 6 14 14c0 7-5 12-12 14v4h-4v-4c-7-2-12-7-12-14z" fill="#fff" />
        <path d="M20 44h24" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    accent: 'from-emerald-600/20 to-lime-500/15 text-green-100 border-emerald-400/30',
  },
  {
    code: '5',
    title: 'Gender Equality',
    description: 'We center inclusion and equal opportunity so every voice can shape the future of the community.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#CE107C" />
        <text x="8" y="18" fontSize="14" fontFamily="Inter, sans-serif" fill="#fff" fontWeight="700">5</text>
        <circle cx="32" cy="30" r="10" fill="none" stroke="#fff" strokeWidth="4" />
        <path d="M32 40v14" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 50h16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    accent: 'from-green-700/20 to-emerald-500/15 text-green-100 border-green-400/30',
  },
  {
    code: '10',
    title: 'Reduced Inequality',
    description: 'We work to ensure fair access to opportunity, resources, and support for underserved members.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#A21942" />
        <text x="8" y="18" fontSize="14" fontFamily="Inter, sans-serif" fill="#fff" fontWeight="700">10</text>
        <line x1="18" y1="32" x2="46" y2="32" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <line x1="18" y1="42" x2="46" y2="42" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </svg>
    ),
    accent: 'from-green-800/20 to-emerald-500/15 text-green-100 border-green-400/30',
  },
  {
    code: '11',
    title: 'Sustainable Communities',
    description: 'We build safer, stronger neighborhoods by investing in practical, locally rooted solutions.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#F26C21" />
        <text x="8" y="18" fontSize="14" fontFamily="Inter, sans-serif" fill="#fff" fontWeight="700">11</text>
        <rect x="22" y="30" width="8" height="18" rx="2" fill="#fff" />
        <rect x="34" y="26" width="8" height="22" rx="2" fill="#fff" />
        <rect x="46" y="34" width="6" height="14" rx="2" fill="#fff" />
        <rect x="18" y="44" width="28" height="6" rx="3" fill="#fff" />
      </svg>
    ),
    accent: 'from-emerald-700/20 to-green-500/15 text-green-100 border-emerald-400/30',
  },
  {
    code: '13',
    title: 'Climate Action',
    description: 'We support regenerative practices and sustainability that protect land, livelihoods, and future generations.',
    icon: (
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#3F7E44" />
        <text x="8" y="18" fontSize="14" fontFamily="Inter, sans-serif" fill="#fff" fontWeight="700">13</text>
        <circle cx="34" cy="36" r="12" fill="none" stroke="#fff" strokeWidth="4" />
        <path d="M34 24c0 6-6 10-6 14s4 6 8 6 6-4 6-6-6-8-8-14z" fill="#fff" />
      </svg>
    ),
    accent: 'from-green-500/20 to-lime-500/15 text-green-100 border-green-400/30',
  },
];

const partnerLogos = [
  { name: 'UNDP', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/UNDP_logo.svg' },
  { name: 'UN Women', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/UN_Women_logo.svg' },
  { name: 'WHO', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/WHO_logo.svg' },
  { name: 'World Bank', src: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/World_Bank_logo.svg' },
  { name: 'FAO', src: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FAO_logo.svg' },
  { name: 'UNICEF', src: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/UNICEF_logo.svg' },
];

const NewsletterPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [newsletters, setNewsletters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'newspaper',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const isPublishedItem = (item) => {
    const value = item?.published;
    return value === true || value === 'true' || value === 1 || value === '1';
  };

  const normalizeItem = (item) => ({
    ...item,
    type: item?.type || 'newspaper',
    published: isPublishedItem(item),
    published_date: item?.published_date || item?.created || new Date().toISOString(),
  });

  const fetchContent = async () => {
    try {
      const newsletterRecords = await pb.collection('newsletters').getFullList({
        sort: '-published_date',
        $autoCancel: false
      });

      const normalizedItems = (newsletterRecords || []).map(normalizeItem);
      const publishedItems = normalizedItems.filter((item) => item.published);
      const pdfs = publishedItems.filter((item) => item.type !== 'video');
      const vids = publishedItems.filter((item) => item.type === 'video');

      setNewsletters(pdfs);
      setVideos(vids);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('type', uploadForm.type);
      formData.append('file', uploadForm.file);
      formData.append('published', 'true');
      formData.append('published_date', new Date().toISOString().split('T')[0]);

      await pb.collection('newsletters').create(formData, { $autoCancel: false });

      toast.success('Content uploaded successfully!');
      setShowUploadModal(false);
      setUploadForm({ title: '', description: '', type: 'newspaper', file: null });
      fetchContent();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload content');
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = (item) => {
    const url = pb.files.getUrl(item, item.file);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Newsletter - HACRO Labs</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Newsletter & Media</h1>
              <p className="text-muted-foreground">Stay updated with our latest news, reports, and videos</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Content</span>
              </button>
            )}
          </div>

          {/* Newsletters Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Newsletters & Reports</h2>
            {newsletters.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-border bg-card/70">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No newsletters available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsletters.map((item) => (
                  <div key={item.id} className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-400/50 hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.type === 'newspaper' ? 'Newspaper' : 'Report'} • {new Date(item.published_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedPdf(item)}
                        className="btn-primary flex items-center space-x-2 flex-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => downloadFile(item)}
                        className="btn-outline flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <section className="mb-12 overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-green-600">Our commitment</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                  We serve our community through the SDGs
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  Every program we build is rooted in dignity, health, inclusion, fair work, reduced inequality, resilient communities, and climate care.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sdgGoals.map((goal) => (
                <div
                  key={goal.code}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:bg-green-50 hover:shadow-md"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                    {goal.icon}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">SDG {goal.code}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{goal.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{goal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 text-center">
              <p className="text-3xl font-extrabold uppercase tracking-[0.35em] text-green-700 sm:text-4xl">Our Partners</p>
              <h3 className="mt-2 text-lg font-medium leading-snug text-slate-700 sm:text-xl">Working together with leading organizations to create lasting impact</h3>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 py-4">
              <div className="flex w-max animate-[marquee_18s_linear_infinite] items-center gap-8 px-4">
                {[...partnerLogos, ...partnerLogos].map((partner, index) => (
                  <div key={`${partner.name}-${index}`} className="flex h-16 min-w-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
                    <img src={partner.src} alt={partner.name} className="max-h-10 w-full object-contain opacity-80" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Videos Section */}
          {videos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-card rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center space-x-3 mb-4">
                      <Video className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-foreground">{video.title}</h3>
                        {video.description && (
                          <p className="text-sm text-muted-foreground">{video.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadFile(video)}
                        className="btn-secondary flex items-center space-x-2 flex-1"
                      >
                        <Play className="w-4 h-4" />
                        <span>Play</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* PDF Viewer Modal */}
        {selectedPdf && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-foreground">{selectedPdf.title}</h3>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
                <Document
                  file={pb.files.getUrl(selectedPdf, selectedPdf.file)}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex justify-center"
                >
                  <HTMLFlipBook
                    width={500}
                    height={700}
                    size="stretch"
                    minWidth={300}
                    maxWidth={800}
                    minHeight={400}
                    maxHeight={1000}
                    showCover={true}
                    mobileScrollSupport={true}
                    className="mx-auto"
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <div key={index} className="bg-white shadow-lg">
                        <Page
                          pageNumber={index + 1}
                          width={500}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </Document>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-foreground">Upload Content</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleFileUpload} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="newspaper">Newspaper</option>
                    <option value="report">Report</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">File</label>
                  <input
                    type="file"
                    accept={uploadForm.type === 'video' ? 'video/*' : '.pdf'}
                    onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    {uploading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </>
  );
};

export default NewsletterPage;
