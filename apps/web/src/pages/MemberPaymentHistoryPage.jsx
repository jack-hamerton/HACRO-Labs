import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { CreditCard, Download, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PaymentAcknowledgmentModal from '@/components/PaymentAcknowledgmentModal.jsx';

const MemberPaymentHistoryPage = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [currentUser]);

  const fetchPayments = async () => {
    if (!currentUser) return;
    
    try {
      const memberData = await pb.collection('members').getOne(currentUser.id, { $autoCancel: false });
      setMember(memberData);

      const records = await pb.collection('payments').getList(1, 50, {
        filter: `member_id = "${currentUser.id}"`,
        sort: '-payment_date',
        $autoCancel: false,
      });
      setPayments(records.items);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

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
        <title>Payment History - Hacro Labs</title>
        <meta name="description" content="View your payment history and download receipts." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Payment history</h1>
            <p className="text-muted-foreground">View your past transactions and download receipts</p>
          </div>

          <div className="dashboard-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header">Date</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">M-Pesa Reference</th>
                    <th className="table-header">Status</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/50 transition-colors duration-200">
                      <td className="table-cell">
                        {payment.payment_date ? format(new Date(payment.payment_date), 'PPP') : 'N/A'}
                      </td>
                      <td className="table-cell font-semibold text-foreground">
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
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1" /> View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}

                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No payment records found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedPayment && (
          <PaymentAcknowledgmentModal
            payment={selectedPayment}
            member={member}
            onClose={() => setSelectedPayment(null)}
          />
        )}

        <Footer />
      </div>
    </>
  );
};

export default MemberPaymentHistoryPage;