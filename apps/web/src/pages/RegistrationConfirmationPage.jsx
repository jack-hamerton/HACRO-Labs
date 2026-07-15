import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Download, Sparkles, ShieldCheck, BadgeCheck } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header.jsx';

const RegistrationConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { member, payment } = location.state || {};

  if (!member) {
    navigate('/');
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Registration Successful - HACRO Hub</title>
        <meta name="description" content="Your HACRO Hub membership registration has been completed successfully." />
      </Helmet>

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_40%),linear-gradient(135deg,_#f8fff9_0%,_#eef7ff_100%)] flex flex-col">
        <Header />

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 print:py-0 print:max-w-none">
          <div className="bg-white/90 backdrop-blur rounded-3xl border border-emerald-100 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.35)] p-8 md:p-10 print:shadow-none print:border-none print:p-0">
            <div className="hidden print:block text-center mb-8 border-b border-border pb-6">
              <h1 className="text-3xl font-bold text-foreground">HACRO Hub</h1>
              <p className="text-muted-foreground mt-2">Official Payment Receipt & Membership Acknowledgment</p>
            </div>

            <div className="flex flex-col items-center text-center mb-8 print:hidden">
              <div className="mb-4 rounded-full bg-emerald-100 p-3 shadow-sm">
                <img src="/images/logo-mark.png" alt="HACRO Hub logo" className="h-16 w-16 rounded-full object-cover" />
              </div>
              <div className="mb-4 flex items-center justify-center rounded-full bg-emerald-50 px-4 py-2 text-emerald-700 shadow-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                <span className="text-sm font-semibold">Welcome aboard</span>
              </div>
              <div className="flex items-center justify-center rounded-full bg-emerald-500/10 p-2 text-emerald-700">
                <CheckCircle2 className="h-20 w-20" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance print:text-2xl">
                You’re officially part of HACRO Hub!
              </h1>
              <p className="text-lg text-slate-600 print:text-base">
                Thank you for joining our growing community of changemakers. Your registration and payment have been received successfully.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 mb-8 space-y-6 print:bg-transparent print:p-0 print:space-y-4">
              <div className="border-b border-border pb-6 print:pb-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Membership Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Member ID</p>
                    <p className="text-xl font-bold text-primary print:text-foreground">{member.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                    <p className="font-medium text-foreground">
                      {member.registration_date ? format(new Date(member.registration_date), 'PPP') : format(new Date(), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium text-foreground">
                      {member.first_name} {member.middle_name} {member.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-medium text-foreground">{member.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-foreground">{member.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium text-foreground">{member.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Acknowledgment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                    <p className="font-bold text-foreground">{payment?.amount ? `${payment.amount} KSH` : '50 KSH'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">M-Pesa Reference</p>
                    <p className="font-mono text-sm uppercase text-foreground bg-background px-2 py-1 rounded border border-border inline-block print:border-none print:px-0">
                      {payment?.mpesa_reference || payment?.checkout_request_id || 'CONFIRMED'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 print:bg-transparent print:border-none print:px-0 print:text-foreground">
                      Completed
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                    <p className="font-medium text-foreground">
                      {payment?.payment_date ? format(new Date(payment.payment_date), 'PPP') : format(new Date(), 'PPP')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 mb-8 print:hidden">
              <div className="flex items-start gap-3 mb-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">What happens next?</h3>
                  <p className="text-sm text-slate-600">You are ready to explore member benefits, updates, and your dashboard.</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start">
                  <BadgeCheck className="mr-2 mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>Log in anytime with your email or phone number and password.</span>
                </li>
                <li className="flex items-start">
                  <BadgeCheck className="mr-2 mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>Keep this confirmation handy for your records and future support requests.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button onClick={handlePrint} className="flex-1 btn-outline flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download Payment Receipt</span>
              </button>
              <Link to="/member-login" className="flex-1 btn-primary flex items-center justify-center space-x-2">
                <span>Go to Login</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="hidden print:block mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>This is a system generated receipt. For any queries, please contact info@hacrolabs.com.</p>
              <p className="mt-1">Printed on {format(new Date(), 'PPP at pp')}</p>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default RegistrationConfirmationPage;

