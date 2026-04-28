import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Loader2, Filter, ArrowDownUp, PiggyBank, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ContributionHistoryPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchHistory();
  }, [currentUser]);

  const fetchHistory = async () => {
    try {
      const records = await pb.collection('contributions_history').getFullList({
        filter: `member_id="${currentUser.id}"`,
        sort: '-date',
        $autoCancel: false
      });
      setHistory(records);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load contribution history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history
    .filter(record => filterType === 'all' || record.type === filterType)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'savings': return <PiggyBank className="w-4 h-4 text-[hsl(var(--savings))]" />;
      case 'loan_disbursement': return <ArrowDownRight className="w-4 h-4 text-[hsl(var(--loans))]" />;
      case 'loan_repayment': return <ArrowUpRight className="w-4 h-4 text-primary" />;
      default: return <Wallet className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'savings': return 'Savings Deposit';
      case 'loan_disbursement': return 'Loan Received';
      case 'loan_repayment': return 'Loan Repayment';
      default: return type;
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
        <title>Contribution History - Hacro Labs</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Contribution History</h1>
              <p className="text-muted-foreground">Timeline of all your savings and loan activities.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-card border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Types</option>
                  <option value="savings">Savings</option>
                  <option value="loan_disbursement">Loan Disbursements</option>
                  <option value="loan_repayment">Loan Repayments</option>
                </select>
              </div>
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="p-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                title="Toggle Sort Order"
              >
                <ArrowDownUp className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          <div className="dashboard-card">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No transaction history found.</p>
              </div>
            ) : (
              <div className="timeline-container">
                {filteredHistory.map((record) => (
                  <div key={record.id} className="timeline-item">
                    <div className="timeline-dot bg-muted" />
                    <div className="bg-muted/30 border border-border/50 rounded-xl p-5 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                            {getTypeIcon(record.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{getTypeLabel(record.type)}</h3>
                            <p className="text-xs text-muted-foreground">{new Date(record.date).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className={`text-lg font-bold tabular-nums ${record.type === 'loan_disbursement' ? 'text-[hsl(var(--loans))]' : 'text-foreground'}`}>
                            {record.type === 'loan_disbursement' ? '+' : ''}KES {record.amount.toLocaleString()}
                          </p>
                          {record.balance !== undefined && record.balance !== null && (
                            <p className="text-xs text-muted-foreground font-medium">
                              Balance: KES {record.balance.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      {record.description && (
                        <p className="text-sm text-muted-foreground mt-2 pl-11">{record.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ContributionHistoryPage;