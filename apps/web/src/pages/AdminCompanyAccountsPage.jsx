import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, TrendingUp, Users, CreditCard, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminCompanyAccountsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyAccounts();
  }, []);

  const fetchCompanyAccounts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
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
      setData(result);
    } catch (error) {
      console.error('Error fetching company accounts:', error);
      toast.error('Failed to load company accounts data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Company Accounts - Admin Dashboard</title>
        <meta name="description" content="View company financial overview and member transaction summaries." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Company Accounts</h1>
            <p className="text-muted-foreground">Financial overview and member transaction summaries</p>
          </div>

          {data && (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                    KES {data.company_overview.total_revenue.toLocaleString()}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-muted-foreground">Registration Fees</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                    KES {data.company_overview.registration_fees.toLocaleString()}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-muted-foreground">Insurance Fees</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                    KES {data.company_overview.insurance_fees.toLocaleString()}
                  </p>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-muted-foreground">Member Contributions</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                    KES {data.company_overview.total_member_contributions.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Net Position */}
              <div className="dashboard-card mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Net Financial Position</h2>
                <div className="text-center">
                  <p className="text-3xl font-bold tabular-nums"
                     className={data.company_overview.net_position >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    KES {data.company_overview.net_position.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {data.company_overview.net_position >= 0 ? 'Company surplus' : 'Company deficit'}
                  </p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="dashboard-card mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Recent Company Transactions</h2>
                {data.recent_transactions.length > 0 ? (
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
                        {data.recent_transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-muted/50 transition-colors duration-200">
                            <td className="table-cell">
                              {transaction.date ? format(new Date(transaction.date), 'PPP') : 'N/A'}
                            </td>
                            <td className="table-cell capitalize">
                              {transaction.type.replace('_', ' ')}
                            </td>
                            <td className="table-cell font-semibold text-green-600 dark:text-green-400">
                              KES {transaction.amount.toLocaleString()}
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

              {/* Member Summary */}
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
                      {data.member_summaries.map((member) => (
                        <tr key={member.member_id} className="hover:bg-muted/50 transition-colors duration-200">
                          <td className="table-cell font-medium">
                            {member.member_name}
                          </td>
                          <td className="table-cell text-blue-600 dark:text-blue-400">
                            KES {member.total_savings.toLocaleString()}
                          </td>
                          <td className="table-cell text-green-600 dark:text-green-400">
                            KES {member.total_repayments.toLocaleString()}
                          </td>
                          <td className="table-cell text-purple-600 dark:text-purple-400">
                            KES {member.total_insurance.toLocaleString()}
                          </td>
                          <td className="table-cell font-bold text-foreground">
                            KES {member.total_contributions.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AdminCompanyAccountsPage;