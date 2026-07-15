import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminCompanyAccountsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyAccounts();
  }, []);

  const fetchCompanyAccounts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/company-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch company accounts');
      }

      const result = await response.json();

      

      const defaultOverview = {
        total_revenue: 0,
        registration_fees: 0,
        insurance_fees: 0,
        donation_total: 0,
        interest_bonuses: 0,
        loan_principal_total: 0,
        total_income: 0,
        total_expenses: 0,
        admin_payouts: 0,
        rent_payment: 15000,
        admin_payout_due: 0,
        company_remaining: 0,
        total_member_contributions: 0,
        net_position: 0,
      };

      setData({
        company_overview: { ...defaultOverview, ...(result.company_overview || {}) },
        recent_transactions: result.recent_transactions || [],
        admin_payouts: result.admin_payouts || [],
        member_summaries: result.member_summaries || [],
        transaction_breakdown: result.transaction_breakdown || { by_type: {}, by_month: {} },
      });
    } catch (error) {
      console.error('Error fetching company accounts:', error);
      toast.error('Failed to load company accounts data');
    } finally {
      setLoading(false);
    }
  };
  

  const overview = data?.company_overview ?? {
    total_revenue: 0,
    registration_fees: 0,
    insurance_fees: 0,
    donation_total: 0,
    interest_bonuses: 0,
    loan_principal_total: 0,
    total_income: 0,
    total_expenses: 0,
    admin_payouts: 0,
    rent_payment: 0,
    admin_payout_due: 0,
    company_remaining: 0,
    total_member_contributions: 0,
    net_position: 0,
  };

  const adminPayoutsList = data?.admin_payouts ?? [];
  const recentTransactionsList = data?.recent_transactions ?? [];
  const memberSummariesList = data?.member_summaries ?? [];

  return (
    <AdminLayout>
      <Helmet>
        <title>Company Accounts - Admin Dashboard</title>
        <meta name="description" content="View company financial overview and member transaction summaries." />
      </Helmet>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Company Accounts</h1>
          <p className="text-muted-foreground">Financial overview and member transaction summaries.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 tabular-nums">
                    KES {String(overview.total_revenue ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-muted-foreground">Registration Fees</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 tabular-nums">
                    KES {String(overview.registration_fees ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-muted-foreground">Insurance Fees</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 tabular-nums">
                    KES {String(overview.insurance_fees ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-muted-foreground">Donations</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 tabular-nums">
                    KES {String(overview.donation_total ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-slate-700" />
                    <span className="text-sm font-medium text-muted-foreground">Interest Received</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">
                    KES {String(overview.interest_bonuses ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-muted-foreground">Loan Principal Total</span>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600 tabular-nums">
                    KES {String(overview.loan_principal_total ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-slate-900" />
                    <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">
                    KES {String(overview.total_expenses ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-rose-600" />
                    <span className="text-sm font-medium text-muted-foreground">Admin Payouts</span>
                  </div>
                  <p className="text-2xl font-bold text-rose-600 tabular-nums">
                    KES {String(overview.admin_payouts ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-fuchsia-600" />
                    <span className="text-sm font-medium text-muted-foreground">Rent</span>
                  </div>
                  <p className="text-2xl font-bold text-fuchsia-600 tabular-nums">
                    KES {String(overview.rent_payment ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-muted-foreground">Admin payout shortfall</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 tabular-nums">
                    KES {String(overview.admin_payout_due ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
              </div>

              <div className="dashboard-card mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Net Financial Position</h2>
                <div className="text-center">
                  <p className={(overview.company_remaining ?? 0) >= 0 ? 'text-3xl font-bold text-green-600 tabular-nums' : 'text-3xl font-bold text-red-600 tabular-nums'}>
                    KES {String(overview.company_remaining ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {(overview.company_remaining ?? 0) >= 0 ? 'Company balance after payouts and rent' : 'Company shortfall to pay all admins and rent'}
                  </p>
                </div>
              </div>

              <div className="dashboard-card mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Admin Payout Schedule</h2>
                {adminPayoutsList && adminPayoutsList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="table-header">Admin</th>
                          <th className="table-header">Role</th>
                          <th className="table-header">Phone</th>
                          <th className="table-header text-right">Payout</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminPayoutsList.map((admin) => (
                          <tr key={admin.id} className="hover:bg-muted/50 transition-colors duration-200">
                            <td className="table-cell font-medium">{admin.full_name}</td>
                            <td className="table-cell capitalize">{admin.role.replace('_', ' ')}</td>
                            <td className="table-cell">{admin.phone || 'N/A'}</td>
                            <td className="table-cell text-right font-semibold text-foreground">KES {Number(admin.payment_amount || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No admin payout configuration found.</p>
                )}
              </div>

              <div className="dashboard-card mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Recent Company Transactions</h2>
                {recentTransactionsList && recentTransactionsList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="table-header">Date</th>
                          <th className="table-header">Type</th>
                          <th className="table-header">Amount</th>
                          <th className="table-header">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactionsList.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-muted/50 transition-colors duration-200">
                            <td className="table-cell">
                              {transaction.date ? format(new Date(transaction.date), 'PPP') : 'N/A'}
                            </td>
                            <td className="table-cell capitalize">
                              {transaction.type.replace('_', ' ')}
                            </td>
                            <td className="table-cell font-semibold text-green-600">
                              KES {String(transaction.amount ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </td>
                            <td className="table-cell">
                              {transaction.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No recent transactions</p>
                )}
              </div>

              <div className="dashboard-card">
                <h2 className="text-xl font-semibold text-foreground mb-6">Member Transaction Summary</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="table-header">Member Name</th>
                        <th className="table-header">Total Savings</th>
                        <th className="table-header">Loan Repayments</th>
                        <th className="table-header">Insurance Fees</th>
                        <th className="table-header">Total Contributions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberSummariesList.map((member) => (
                        <tr key={member.member_id} className="hover:bg-muted/50 transition-colors duration-200">
                          <td className="table-cell font-medium">{member.member_name}</td>
                            <td className="table-cell text-blue-600">KES {String(member.total_savings ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                            <td className="table-cell text-green-600">KES {String(member.total_repayments ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                            <td className="table-cell text-purple-600">KES {String(member.total_insurance ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                            <td className="table-cell font-bold text-foreground">KES {String(member.total_contributions ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCompanyAccountsPage;
