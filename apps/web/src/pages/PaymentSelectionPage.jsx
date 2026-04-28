import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { CreditCard, PiggyBank, Wallet, Shield, DollarSign, Phone } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const PaymentSelectionPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState(null);
  const [activeLoans, setActiveLoans] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [selectedLoan, setSelectedLoan] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchMemberData();
  }, [currentUser]);

  const fetchMemberData = async () => {
    if (!currentUser) return;

    try {
      const memberData = await pb.collection('members').getOne(currentUser.id, { $autoCancel: false });
      setMember(memberData);
      setPhoneNumber(memberData.phone_number || '');

      // Fetch active loans for repayment option
      const loans = await pb.collection('loans').getFullList({
        filter: `member_id="${currentUser.id}" && (status="active" || status="partially_paid")`,
        $autoCancel: false
      });
      setActiveLoans(loans);
    } catch (error) {
      toast.error('Failed to load member data');
    }
  };

  const paymentTypes = [
    {
      id: 'savings',
      title: 'Savings Contribution',
      description: 'Make a regular savings contribution',
      icon: PiggyBank,
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'loan_repayment',
      title: 'Loan Repayment',
      description: 'Repay your active loan',
      icon: Wallet,
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'insurance',
      title: 'Insurance & Maintenance',
      description: 'Monthly insurance and maintenance fee (KES 150)',
      icon: Shield,
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/50',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'registration',
      title: 'Registration Fee',
      description: 'One-time registration fee',
      icon: DollarSign,
      color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900/50',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const handlePaymentTypeSelect = (type) => {
    setSelectedPaymentType(type);
    setSelectedLoan('');
    setAmount('');

    // Set default amounts for fixed fees
    if (type === 'insurance') {
      setAmount('150');
    } else if (type === 'registration') {
      setAmount('500'); // Assuming registration fee
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPaymentType || !amount || !phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedPaymentType === 'loan_repayment' && !selectedLoan) {
      toast.error('Please select a loan to repay');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        member_id: currentUser.id,
        payment_type: selectedPaymentType,
        amount: parseFloat(amount),
        phone_number: phoneNumber,
        payment_status: 'pending',
        payment_date: new Date().toISOString(),
      };

      if (selectedPaymentType === 'loan_repayment') {
        paymentData.loan_id = selectedLoan;
      }

      // Create payment record
      const payment = await pb.collection('payments').create(paymentData, { $autoCancel: false });

      // Trigger M-Pesa STK push via API
      const stkResponse = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace('+', ''),
          amount: parseFloat(amount),
          accountReference: `PAY-${payment.id}`,
          transactionDesc: `${selectedPaymentType.replace('_', ' ').toUpperCase()} - ${member.first_name} ${member.last_name}`
        })
      });

      if (!stkResponse.ok) {
        throw new Error('Failed to initiate M-Pesa payment');
      }

      const stkData = await stkResponse.json();

      // Update payment with STK details
      await pb.collection('payments').update(payment.id, {
        checkout_request_id: stkData.CheckoutRequestID,
        mpesa_reference: stkData.ResponseCode
      }, { $autoCancel: false });

      toast.success('M-Pesa payment prompt sent to your phone. Please complete the payment.');

      // Reset form
      setSelectedPaymentType('');
      setSelectedLoan('');
      setAmount('');
      setPhoneNumber(member?.phone_number || '');

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Make Payment - Hacro Labs</title>
        <meta name="description" content="Select payment type and make secure payments via M-Pesa." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Make a Payment</h1>
            <p className="text-muted-foreground">Select your payment type and complete securely via M-Pesa</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Type Selection */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Select Payment Type</h2>
                <div className="grid grid-cols-1 gap-3">
                  {paymentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handlePaymentTypeSelect(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedPaymentType === type.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${type.color}`}>
                            <Icon className={`w-5 h-5 ${type.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{type.title}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="dashboard-card">
              <h2 className="text-xl font-semibold text-foreground mb-6">Payment Details</h2>

              {selectedPaymentType ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {selectedPaymentType === 'loan_repayment' && activeLoans.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select Loan to Repay
                      </label>
                      <select
                        value={selectedLoan}
                        onChange={(e) => setSelectedLoan(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Choose a loan...</option>
                        {activeLoans.map((loan) => (
                          <option key={loan.id} value={loan.id}>
                            Loan #{loan.id.slice(-8)} - KES {loan.amount.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Amount (KES)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                      required
                      readOnly={selectedPaymentType === 'insurance' || selectedPaymentType === 'registration'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      M-Pesa Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="254XXXXXXXXX"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your M-Pesa registered phone number
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay via M-Pesa
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a payment type to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PaymentSelectionPage;