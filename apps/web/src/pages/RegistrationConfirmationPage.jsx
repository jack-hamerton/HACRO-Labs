import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const RegistrationConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { member, payment } = location.state || {};

  if (!member) {
    navigate('/');
    return null;
  }

  const handlePrint = () => {
    // Triggers standard browser print to save as PDF
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Registration Successful - Hacro Labs</title>
        <meta name="description" content="Your Hacro Labs membership registration has been completed successfully." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 print:py-0 print:max-w-none">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8 print:shadow-none print:border-none print:p-0">
            
            {/* Print Only Header (Hidden on screen) */}
            <div className="hidden print:block text-center mb-8 border-b border-border pb-6">
              <h1 className="text-3xl font-bold text-foreground">Hacro Labs</h1>
              <p className="text-muted-foreground mt-2">Official Payment Receipt & Membership Acknowledgment</p>
            </div>

            <div className="flex items-center justify-center mb-8 print:hidden">
              <CheckCircle className="w-20 h-20 text-success" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance print:text-2xl">
                Registration & Payment Successful!
              </h1>
              <p className="text-lg text-muted-foreground print:text-base">Welcome to the Hacro Labs Community</p>
            </div>

            <div className="bg-muted rounded-lg p-6 mb-8 space-y-6 print:bg-transparent print:p-0 print:space-y-4">
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
                    <p className="font-bold text-foreground">300 KSH</p>
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

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8 print:hidden">
              <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>You can now log in to your member dashboard using your email and password.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Keep this receipt and your Member ID for future reference.</span>
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
            
            {/* Print Only Footer (Hidden on screen) */}
            <div className="hidden print:block mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>This is a system generated receipt. For any queries, please contact info@hacrolabs.com.</p>
              <p className="mt-1">Printed on {format(new Date(), 'PPP at pp')}</p>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default RegistrationConfirmationPage;
