import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Wallet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminLoanManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [pendingLoans, setPendingLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const loans = await pb.collection('loans').getFullList({
        filter: `status="approved"`,
        expand: 'member_id,group_id',
        sort: 'created_date',
        $autoCancel: false
      });

      const enrichedLoans = await Promise.all(loans.map(async (loan) => {
        const savings = await pb.collection('savings').getFullList({
          filter: `member_id="${loan.member_id}"`,
          $autoCancel: false
        });
        const collateral = savings.reduce((sum, s) => sum + s.amount, 0);
        return { ...loan, collateral };
      }));

      setPendingLoans(enrichedLoans);
    } catch (error) {
      console.error('Error fetching loans:', error);
      toast.error('Failed to load pending loans');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Loan Management - Admin - Hacro Labs</title>
      </Helmet>

      <div className="max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Loan Management</h1>
          <p className="text-muted-foreground">Review group-approved loans without inline action buttons.</p>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Ready for Disbursement</h2>

          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header">Borrower</th>
                    <th className="table-header">Group</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Collateral</th>
                    <th className="table-header">Approved Date</th>
                    <th className="table-header text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-muted/50 transition-colors">
                      <td className="table-cell font-medium text-foreground">
                        {loan.expand?.member_id?.first_name} {loan.expand?.member_id?.last_name}
                      </td>
                      <td className="table-cell text-muted-foreground">
                        {loan.expand?.group_id?.group_name}
                      </td>
                      <td className="table-cell font-bold text-[hsl(var(--loans))] tabular-nums">
                        KES {loan.amount.toLocaleString()}
                      </td>
                      <td className="table-cell font-medium text-[hsl(var(--savings))] tabular-nums">
                        KES {loan.collateral.toLocaleString()}
                      </td>
                      <td className="table-cell text-muted-foreground">
                        {new Date(loan.updated).toLocaleDateString()}
                      </td>
                      <td className="table-cell text-right text-slate-600">Awaiting disbursement</td>
                    </tr>
                  ))}

                  {pendingLoans.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                        <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No approved loans waiting for disbursement.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLoanManagementPage;
