import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, Search, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminPaymentManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const records = await pb.collection('payments').getFullList({
        sort: '-payment_date',
        expand: 'member_id',
        $autoCancel: false,
      });
      setPayments(records);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = (payment) => {
    if (payment.acknowledgment_file) {
      const fileUrl = pb.files.getUrl(payment, payment.acknowledgment_file);
      window.open(fileUrl, '_blank');
    } else {
      toast.error('No acknowledgment file attached to this payment');
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const memberName = payment.expand?.member_id 
      ? `${payment.expand.member_id.first_name} ${payment.expand.member_id.last_name}`.toLowerCase() 
      : '';
    const ref = (payment.mpesa_reference || payment.checkout_request_id || '').toLowerCase();
    
    const matchesSearch = memberName.includes(searchTerm.toLowerCase()) || ref.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Management - Admin - Hacro Labs</title>
        <meta name="description" content="Manage all member payments and transactions." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Payment Management</h1>
            <p className="text-muted-foreground">Monitor and manage all member transactions</p>
          </div>

          <div className="dashboard-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by member name or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input pl-10"
                >
                  <option value="All">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header">Date</th>
                    <th className="table-header">Member</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">M-Pesa Reference</th>
                    <th className="table-header">Status</th>
                    <th className="table-header text-right">File</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/50 transition-colors duration-200">
                      <td className="table-cell whitespace-nowrap">
                        {payment.payment_date ? format(new Date(payment.payment_date), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="table-cell font-medium text-foreground">
                        {payment.expand?.member_id 
                          ? `${payment.expand.member_id.first_name} ${payment.expand.member_id.last_name}`
                          : 'Unknown Member'}
                      </td>
                      <td className="table-cell font-semibold">
                        KES {payment.amount?.toLocaleString()}
                      </td>
                      <td className="table-cell font-mono text-xs uppercase">
                        {payment.mpesa_reference || payment.checkout_request_id || '-'}
                      </td>
                      <td className="table-cell">
                        <span
                          className={
                            payment.payment_status === 'completed'
                              ? 'badge-completed'
                              : payment.payment_status === 'pending'
                              ? 'badge-pending'
                              : 'badge-failed'
                          }
                        >
                          {payment.payment_status}
                        </span>
                      </td>
                      <td className="table-cell text-right">
                        {payment.acknowledgment_file ? (
                          <button
                            onClick={() => handleDownloadFile(payment)}
                            className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Download attachment"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">No file</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No payments found matching the filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AdminPaymentManagementPage;