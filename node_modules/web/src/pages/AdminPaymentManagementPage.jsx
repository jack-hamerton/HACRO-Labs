import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminPaymentManagementPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const [paymentsResponse, donationsResponse] = await Promise.all([
        pb.collection('payments').getFullList({
          sort: '-payment_date',
          expand: 'member_id',
          $autoCancel: false,
        }),
        pb.collection('donations').getFullList({
          sort: '-payment_date',
          $autoCancel: false,
        }),
      ]);

      const normalizedPayments = paymentsResponse.map((payment) => ({
        ...payment,
        kind: 'payment',
        displayName: payment.expand?.member_id
          ? `${payment.expand.member_id.first_name} ${payment.expand.member_id.last_name}`
          : payment.email || 'Unknown member',
      }));

      const normalizedDonations = donationsResponse.map((donation) => ({
        ...donation,
        kind: 'donation',
        displayName: donation.donor_name || donation.donor_email || 'Anonymous donor',
      }));

      setTransactions([...normalizedPayments, ...normalizedDonations]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load payments and donations');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const memberName = (transaction.displayName || '').toLowerCase();
    const ref = (transaction.mpesa_reference || transaction.checkout_request_id || '').toLowerCase();
    const purpose = (transaction.purpose || '').toLowerCase();

    const matchesSearch = memberName.includes(searchTerm.toLowerCase()) || ref.includes(searchTerm.toLowerCase()) || purpose.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || transaction.payment_status === statusFilter;
    const matchesType = typeFilter === 'All' || transaction.kind === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AdminLayout>
      <Helmet>
        <title>Payment Management - Admin - HACRO Hub</title>
        <meta name="description" content="Manage all member payments and transactions." />
      </Helmet>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Payment Management</h1>
          <p className="text-muted-foreground">Monitor member payments with no header action buttons.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="dashboard-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by donor, member, or reference..."
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

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="form-input pl-10"
                >
                  <option value="All">All Types</option>
                  <option value="payment">Payments</option>
                  <option value="donation">Donations</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header">Date</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Type</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">M-Pesa Reference</th>
                    <th className="table-header">Status</th>
                    <th className="table-header text-right">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={`${transaction.kind}-${transaction.id}`} className="hover:bg-muted/50 transition-colors duration-200">
                      <td className="table-cell whitespace-nowrap">
                        {transaction.payment_date ? format(new Date(transaction.payment_date), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="table-cell font-medium text-foreground">
                        {transaction.displayName || 'Unknown'}
                      </td>
                      <td className="table-cell">
                        <span className={transaction.kind === 'donation' ? 'badge-pending' : 'badge-completed'}>
                          {transaction.kind === 'donation' ? 'Donation' : 'Payment'}
                        </span>
                      </td>
                      <td className="table-cell font-semibold">
                        KES {Number(transaction.amount || 0).toLocaleString()}
                      </td>
                      <td className="table-cell font-mono text-xs uppercase">
                        {transaction.mpesa_reference || transaction.checkout_request_id || '-'}
                      </td>
                      <td className="table-cell">
                        <span className={
                          transaction.payment_status === 'completed'
                            ? 'badge-completed'
                            : transaction.payment_status === 'pending'
                            ? 'badge-pending'
                            : 'badge-failed'
                        }>
                          {transaction.payment_status}
                        </span>
                      </td>
                      <td className="table-cell text-right text-xs text-slate-500">
                        {transaction.purpose || (transaction.kind === 'donation' ? 'General support' : '-')}
                      </td>
                    </tr>
                  ))}

                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No transactions found matching the filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentManagementPage;

