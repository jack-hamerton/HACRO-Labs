import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const SavingsContributionPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  
  const [formData, setFormData] = useState({
    amount: '',
    description: 'Monthly Savings Contribution'
  });

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const memberGroup = await pb.collection('group_members').getFirstListItem(`member_id="${currentUser.id}"`, {
        expand: 'group_id',
        $autoCancel: false
      });
      setGroupData(memberGroup.expand.group_id);

      const savings = await pb.collection('savings').getFullList({
        filter: `member_id="${currentUser.id}"`,
        $autoCancel: false
      });
      
      const balance = savings.reduce((sum, s) => sum + s.amount, 0);
      setCurrentBalance(balance);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Could not load group data. Are you assigned to a group?');
      navigate('/group-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      const dateStr = new Date().toISOString();
      
      // 1. Create savings record
      await pb.collection('savings').create({
        member_id: currentUser.id,
        group_id: groupData.id,
        amount: amount,
        date: dateStr,
        description: formData.description
      }, { $autoCancel: false });

      // 2. Create contribution history record
      await pb.collection('contributions_history').create({
        member_id: currentUser.id,
        group_id: groupData.id,
        type: 'savings',
        amount: amount,
        date: dateStr,
        description: formData.description,
        balance: currentBalance + amount
      }, { $autoCancel: false });

      toast.success('Savings contribution recorded successfully!');
      navigate('/group-dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to record contribution. Please try again.');
      setSubmitting(false);
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
        <title>Make Savings Contribution - Hacro Labs</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
          <button 
            onClick={() => navigate('/group-dashboard')}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Group
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Savings Contribution</h1>
            <p className="text-muted-foreground">Add funds to your group savings account.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="stat-card bg-[hsl(var(--savings)_/_0.05)] border-[hsl(var(--savings)_/_0.1)]">
              <div className="flex items-center space-x-3 mb-2">
                <PiggyBank className="w-5 h-5 text-[hsl(var(--savings))]" />
                <h3 className="text-sm font-medium text-muted-foreground">Current Balance</h3>
              </div>
              <p className="text-3xl font-bold text-[hsl(var(--savings))] tabular-nums">
                KES {currentBalance.toLocaleString()}
              </p>
            </div>
            <div className="stat-card">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Group</h3>
              <p className="text-lg font-semibold text-foreground">{groupData?.group_name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-section">
            <div>
              <label className="form-label">Contribution Amount (KES) <span className="text-destructive">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">KES</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="form-input pl-14 font-mono text-lg"
                  placeholder="0.00"
                  min="1"
                  step="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Description (Optional)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-input"
                placeholder="e.g., Monthly Savings"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <PiggyBank className="w-5 h-5" />
                    <span>Submit Contribution</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SavingsContributionPage;