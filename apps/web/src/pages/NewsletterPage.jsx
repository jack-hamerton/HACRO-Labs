import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { Play, Upload, FileText, Video, Eye, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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

  const fetchContent = async () => {
    try {
      const newsletterRecords = await pb.collection('newsletters').getFullList({
        filter: 'published = true',
        sort: '-published_date',
        $autoCancel: false
      });

      const pdfs = newsletterRecords.filter(item => item.type !== 'video');
      const vids = newsletterRecords.filter(item => item.type === 'video');

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
      formData.append('published', true);
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

          {/* Newsletters Section */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Newsletters & Reports</h2>
            {newsletters.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No newsletters available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsletters.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="w-8 h-8 text-primary" />
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
        </div>

          <div className="mt-12 rounded-3xl border border-border bg-card p-8 shadow-sm" id="terms">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Effective Date</p>
                <h2 className="text-3xl font-bold text-foreground">Terms & Conditions</h2>
                <p className="text-sm text-muted-foreground mt-1">Effective June 14, 2026 | Version 1.0</p>
              </div>
            </div>

            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <section>
                <h3 className="text-lg font-semibold text-foreground">1. Acceptance</h3>
                <p>By using the Hacro Labs application, you agree to these Terms & Conditions and to the automated account and loan-processing behaviors implemented in the app’s backend hooks. You consent to electronic notifications, automatic calculations, and automated record updates relating to your account, savings, loans, penalties, and collateral.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">2. Account Responsibility</h3>
                <p>You are responsible for providing accurate personal, contact, and financial information and for keeping your savings and account details up to date so that automated processes can operate correctly.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">3. Automated Processing & Consent</h3>
                <p>Hacro Labs may run automated scripts and scheduled jobs that evaluate loans, apply interest, calculate penalties, create notifications, and update records. These processes include overdue checks, monthly interest distribution, penalty calculations, default handling, guarantor automation, and other backend automations implemented in the PocketBase hook files.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">4. Loan Repayments and Defaults</h3>
                <p>Loans are subject to the app’s grace period, overdue policies, and default rules. When a loan becomes overdue, notifications are sent to the borrower and, when applicable, to group members. After repeated overdue notifications, loans may be marked as defaulted and automated recovery actions may be triggered.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">5. Recovery, Deductions, and Order of Priority</h3>
                <p>For individual loans (IL), the system will first recover outstanding balances from the borrower’s savings and available bonuses. If the balance remains, group interest penalties or other group-based recovery mechanisms may apply.</p>
                <p>For group loans (GIL), the system will first use borrower savings. If savings are insufficient, eligible group members may be charged proportionally from their interest balances or savings. Remaining balances may then be subject to guarantor collateral rules.</p>
                <p>You authorize Hacro Labs to deduct funds from your savings, interest balances, and other on-platform balances as needed to recover outstanding loan balances and penalties.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">6. Guarantors & Collateral</h3>
                <p>Members who accept to act as guarantors acknowledge a collateral commitment. Guarantor offers remain pending until acknowledged. Collateral remains flagged until disbursement or default events. When a loan is recovered successfully, collateral may be returned to guarantors’ savings and marked as completed.</p>
                <p>If a GIL loan remains unpaid after borrower and group deductions, guarantor collateral may be consumed or handled according to the obligation rules defined by the app’s backend logic.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">7. Penalties & Interest</h3>
                <p>Late repayment penalties may be applied automatically based on the app’s penalty calculation rules. Monthly savings interest may also be calculated and credited automatically through scheduled distribution processes.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">8. Fees & Insurance</h3>
                <p>The app may automatically collect insurance fees, administrative fees, bonuses, and other charges according to its backend fee collection and account history logic.</p>
                <p className="mt-2">Registration fee: a one-time fee of KES 50 is payable via M-Pesa at account creation to cover account setup and record processing. By creating an account you agree to pay this non-refundable registration fee through the payment flow presented during registration.</p>
                <p className="mt-2">Membership fee: to become a full member and access member-only benefits, a membership fee of KES 500 is required and is payable through the member account payment portal. Members are expected to complete this payment after account creation as directed in the app.</p>
                <p className="mt-2">Automated collection for unpaid membership fees: if the KES 500 membership fee is not paid within 12 months from the account creation date, you authorize Hacro Labs to recover the unpaid membership fee automatically by deducting available interest credited to your account (e.g., monthly interest earned on savings via the app). If interest balances are insufficient, further automated recovery actions may follow according to the recovery and deduction rules described elsewhere in these Terms.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">9. Notifications & Records</h3>
                <p>The app generates in-app notifications for overdue loans, penalties, collateral acknowledgments, loan approvals, disbursements, repayments, collateral returns, and other events. Transaction history records are created automatically for audit and member transparency.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">10. Admin Actions & Review</h3>
                <p>Some actions require admin review, such as loan disbursement and approval workflows. Authorized admins may review loan status, change records, and trigger manual processes as permitted by their roles.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">11. Fraud Detection & Rejection</h3>
                <p>The system may run automated fraud checks and reject or flag suspicious transactions, guarantor applications, or loan requests. Accounts may be suspended or blocked pending investigation if fraud is suspected.</p>
              </section>

              <section id="privacy">
                <h3 className="text-lg font-semibold text-foreground">12. Data Use & Privacy</h3>
                <p>By using the app, you agree that Hacro Labs may process personal and financial data necessary for loan operations, notifications, fraud checks, and record-keeping. Data is processed in accordance with the app’s Privacy Policy.
                  Hacro Labs is committed to protecting your privacy in accordance with the Kenya Data Protection Act. We collect Personal Information (name, email and  contact), Financial Data (M-Pesa records sent to the app, savings, loan history) 
                  to be used for service delivery, security and fraud prevention, communication, and regulatory compliance. We do not sell your data; it is shared solely for service functionality within your specific group or chama as required by law. To ensure a Digital Safe Harbor, we implement encryption, strict access control, and  Under the law, you retain the right to access, 
                  correct, or request the deletion of your data, subject to our legal and financial retention requirements.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">13. Disputes & Corrections</h3>
                <p>If you dispute an automated deduction or record, contact support promptly via the app or at info@hacrolabs.com. Hacro Labs will review logs and records and respond according to its dispute procedures. Automated actions may be reversible only where the system rules allow.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">14. Limitations of Liability & Indemnity</h3>
                <p>Hacro Labs is not liable for indirect losses arising from automated deductions except as required by law. Users agree to indemnify Hacro Labs for misuse of the service or fraudulent activity attributable to them.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">15. Changes to These Terms</h3>
                <p>Hacro Labs may update these Terms & Conditions and the behavior of backend automations. Material changes will be communicated by notification, and continued use of the service after notification constitutes acceptance.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground">16. Contact & Support</h3>
                <p>For questions, disputes, or information about automated hooks and their effects, contact support via the app or at info@hacrolabs.com.</p>
              </section>
            </div>
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

      </div>
    </>
  );
};

export default NewsletterPage;
