import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Wallet, CheckCircle2, Loader2, Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminLoanManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      // Fetch loans that are approved by group but not yet disbursed (status='approved')
      const loans = await pb.collection('loans').getFullList({
        filter: `status="approved"`,
        expand: 'member_id,group_id',
        sort: 'created_date',
        $autoCancel: false
      });

      // Fetch collateral for each
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

  const handleDisburse = async (loan) => {
    setProcessingId(loan.id);
    try {
      const dateStr = new Date().toISOString();

      // 1. Update loan status
      await pb.collection('loans').update(loan.id, {
        status: 'active',
        disbursement_date: dateStr
      }, { $autoCancel: false });

      // 2. Create contribution history record
      await pb.collection('contributions_history').create({
        member_id: loan.member_id,
        group_id: loan.group_id,
        type: 'loan_disbursement',
        amount: loan.amount,
        date: dateStr,
        description: 'Loan Disbursement'
      }, { $autoCancel: false });

      toast.success('Loan disbursed successfully!');
      fetchLoans(); // Refresh list
    } catch (error) {
      console.error('Disbursement error:', error);
      toast.error('Failed to disburse loan.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Loan Management - Admin - Hacro Labs</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Loan Management</h1>
            <p className="text-muted-foreground">Review and disburse group-approved loans.</p>
          </div>

          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-foreground mb-6">Ready for Disbursement</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header">Borrower</th>
                    <th className="table-header">Group</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Collateral</th>
                    <th className="table-header">Approved Date</th>
                    <th className="table-header text-right">Action</th>
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
                      <td className="table-cell text-right">
                        <button
                          onClick={() => handleDisburse(loan)}
                          disabled={processingId === loan.id}
                          className="btn-primary py-2 px-4 text-sm flex items-center justify-center space-x-2 ml-auto"
                        >
                          {processingId === loan.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Disburse</span>
                            </>
                          )}
                        </button>
                      </td>
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
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AdminLoanManagementPage;
