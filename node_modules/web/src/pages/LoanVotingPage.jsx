import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, Loader2, Users, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const LoanVotingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingVotes, setPendingVotes] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingVotes();
  }, [currentUser]);

  const fetchPendingVotes = async () => {
    try {
      // Fetch approvals assigned to current user that are not yet approved
      const approvals = await pb.collection('loan_approvals').getFullList({
        filter: `member_id="${currentUser.id}" && approved=false`,
        expand: 'loan_id,loan_id.member_id',
        sort: '-created',
        $autoCancel: false
      });

      // Filter out loans that are no longer pending
      const activePending = approvals.filter(a => a.expand?.loan_id?.status === 'pending');

      // For each loan, fetch total approvals and loan type
      const enrichedVotes = await Promise.all(activePending.map(async (approval) => {
        const loanId = approval.loan_id;
        const loan = approval.expand.loan_id;
        
        const allApprovals = await pb.collection('loan_approvals').getFullList({
          filter: `loan_id="${loanId}"`,
          $autoCancel: false
        });
        
        const approvedCount = allApprovals.filter(a => a.approved).length;
        const totalCount = allApprovals.length;

        // Get borrower's savings for collateral display
        const borrowerId = loan.member_id;
        const savings = await pb.collection('savings').getFullList({
          filter: `member_id="${borrowerId}"`,
          $autoCancel: false
        });
        const collateral = savings.reduce((sum, s) => sum + s.amount, 0);

        // For GIL, get guarantor information
        let guarantorInfo = null;
        if (loan.loan_type === 'GIL') {
          guarantorInfo = allApprovals.find(a => a.member_id === currentUser.id);
        }

        return {
          ...approval,
          approvedCount,
          totalCount,
          collateral,
          loanType: loan.loan_type || 'IL',
          guarantorInfo,
          loanAmount: loan.amount
        };
      }));

      setPendingVotes(enrichedVotes);
    } catch (error) {
      console.error('Error fetching votes:', error);
      toast.error('Failed to load pending loan requests');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (approvalId, loanId, isApproved) => {
    setProcessingId(approvalId);
    try {
      // 1. Update the approval record
      await pb.collection('loan_approvals').update(approvalId, {
        approved: isApproved,
        vote_date: new Date().toISOString()
      }, { $autoCancel: false });

      if (isApproved) {
        // 2. Check if all members have approved
        const allApprovals = await pb.collection('loan_approvals').getFullList({
          filter: `loan_id="${loanId}"`,
          $autoCancel: false
        });
        
        const approvedCount = allApprovals.filter(a => a.approved).length;
        
        if (approvedCount === allApprovals.length && allApprovals.length > 0) {
          // Get the loan to check its type
          const loan = await pb.collection('loans').getOne(loanId, { $autoCancel: false });
          
          // Auto-approve the loan
          await pb.collection('loans').update(loanId, {
            status: 'approved'
          }, { $autoCancel: false });
          
          if (loan.loan_type === 'GIL') {
            toast.success('Your collateral confirmation was recorded. The loan is now fully approved by all guarantors!');
          } else {
            toast.success('Your vote was recorded. The loan is now fully approved!');
          }
        } else {
          toast.success(approvedCount === 1 ? 'Your approval was recorded.' : `Your approval was recorded (${approvedCount} approvals so far).`);
        }
      } else {
        // If rejected, reject the whole loan
        await pb.collection('loans').update(loanId, {
          status: 'rejected'
        }, { $autoCancel: false });
        toast.success('You rejected the loan request.');
      }

      // Refresh list
      fetchPendingVotes();
    } catch (error) {
      console.error('Voting error:', error);
      toast.error('Failed to record vote. Please try again.');
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
        <title>Loan Voting - Hacro Labs</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
          <button 
            onClick={() => navigate('/group-dashboard')}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Group
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Loan Approvals</h1>
            <p className="text-muted-foreground">Review pending loan requests - either vote on Individual Loans or confirm collateral for Group Individual Loans.</p>
          </div>

          {pendingVotes.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold text-foreground mb-2">All Caught Up!</h2>
              <p className="text-muted-foreground">There are no pending loan requests requiring your vote or confirmation.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingVotes.map((vote) => {
                const loan = vote.expand.loan_id;
                const borrower = loan.expand.member_id;
                const isSelf = borrower.id === currentUser.id;
                const isGIL = vote.loanType === 'GIL';

                return (
                  <div key={vote.id} className="dashboard-card">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="px-3 py-1 rounded-full text-xs font-semibold" 
                            style={{
                              backgroundColor: isGIL ? 'hsl(var(--savings) / 0.1)' : 'hsl(var(--loans) / 0.1)',
                              color: isGIL ? 'hsl(var(--savings))' : 'hsl(var(--loans))'
                            }}>
                            {isGIL ? 'Group Individual Loan' : 'Individual Loan'}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="font-bold text-foreground">
                              {borrower.first_name[0]}{borrower.last_name[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {borrower.first_name} {borrower.last_name}
                              {isSelf && <span className="ml-2 text-xs font-normal text-muted-foreground">(Your Request)</span>}
                            </h3>
                            <p className="text-xs text-muted-foreground">Requested on {new Date(loan.created_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isGIL ? (
                      // GIL: Show guarantor collateral confirmation
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">Loan Amount Requested</p>
                            <p className="text-lg font-bold text-[hsl(var(--loans))] tabular-nums">KES {vote.loanAmount.toLocaleString()}</p>
                          </div>
                          <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">Your Collateral Amount</p>
                            <p className="text-lg font-bold text-[hsl(var(--savings))] tabular-nums">
                              KES {(vote.guarantorInfo?.collateral_amount || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-900">
                            <strong>Guarantor Role:</strong> You are a guarantor for this loan. Your collateral ({(vote.guarantorInfo?.collateral_amount || 0).toLocaleString()} KES) will be deducted from your savings and held until the loan is fully repaid.
                          </p>
                        </div>

                        <div className="mb-6">
                          <p className="text-sm font-medium text-foreground mb-2">Guarantor Confirmations</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${(vote.approvedCount / vote.totalCount) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                              {vote.approvedCount} of {vote.totalCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // IL: Show group voting
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">Requested Amount</p>
                            <p className="text-lg font-bold text-[hsl(var(--loans))] tabular-nums">KES {vote.loanAmount.toLocaleString()}</p>
                          </div>
                          <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">Available Collateral (Savings)</p>
                            <p className="text-lg font-bold text-[hsl(var(--savings))] tabular-nums">KES {vote.collateral.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-sm font-medium text-foreground mb-2">Group Vote Progress</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${(vote.approvedCount / vote.totalCount) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                              {vote.approvedCount} of {vote.totalCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-border">
                      <button
                        onClick={() => handleVote(vote.id, loan.id, true)}
                        disabled={processingId === vote.id || isSelf}
                        className="flex-1 btn-primary bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
                      >
                        {processingId === vote.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{isGIL ? 'Confirm Collateral' : 'Approve Loan'}</span>
                      </button>
                      <button
                        onClick={() => handleVote(vote.id, loan.id, false)}
                        disabled={processingId === vote.id || isSelf}
                        className="flex-1 btn-outline border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      {isSelf && (
                        <p className="text-xs text-center text-muted-foreground col-span-2 md:col-span-1">
                          You cannot vote on your own request.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LoanVotingPage;
