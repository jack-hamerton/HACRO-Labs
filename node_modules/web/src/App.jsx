import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute.jsx';

import HomePage from '@/pages/HomePage.jsx';
import RegistrationPage from '@/pages/RegistrationPage.jsx';
import RegistrationConfirmationPage from '@/pages/RegistrationConfirmationPage.jsx';
import MemberLoginPage from '@/pages/MemberLoginPage.jsx';
import MemberDashboardPage from '@/pages/MemberDashboardPage.jsx';
import MemberPaymentHistoryPage from '@/pages/MemberPaymentHistoryPage.jsx';
import PaymentSelectionPage from '@/pages/PaymentSelectionPage.jsx';
import GroupDashboardPage from '@/pages/GroupDashboardPage.jsx';
import SavingsContributionPage from '@/pages/SavingsContributionPage.jsx';
import LoanRequestPage from '@/pages/LoanRequestPage.jsx';
import LoanVotingPage from '@/pages/LoanVotingPage.jsx';
import LoanRepaymentPage from '@/pages/LoanRepaymentPage.jsx';
import ContributionHistoryPage from '@/pages/ContributionHistoryPage.jsx';
import NotificationCenter from '@/pages/NotificationCenter.jsx';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard.jsx';
import GroupMessaging from '@/pages/GroupMessaging.jsx';
import LoanRepaymentTracker from '@/pages/LoanRepaymentTracker.jsx';

// Admin Routes
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '@/pages/ResetPasswordPage.jsx';
import AdminDashboardPage from '@/pages/AdminDashboardPage.jsx';
import AdminManagementPage from '@/pages/AdminManagementPage.jsx';
import AdminProfilePage from '@/pages/AdminProfilePage.jsx';
import AdminActivityLogPage from '@/pages/AdminActivityLogPage.jsx';
import AdminCompanyAccountsPage from '@/pages/AdminCompanyAccountsPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <ScrollToTop />
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/registration-confirmation" element={<RegistrationConfirmationPage />} />
            <Route path="/member-login" element={<MemberLoginPage />} />
            
            {/* Member Routes */}
            <Route path="/member-dashboard" element={<ProtectedRoute requireMember><MemberDashboardPage /></ProtectedRoute>} />
            <Route path="/make-payment" element={<ProtectedRoute requireMember><PaymentSelectionPage /></ProtectedRoute>} />
            <Route path="/payment-history" element={<ProtectedRoute requireMember><MemberPaymentHistoryPage /></ProtectedRoute>} />
            <Route path="/group-dashboard" element={<ProtectedRoute requireMember><GroupDashboardPage /></ProtectedRoute>} />
            <Route path="/savings-contribution" element={<ProtectedRoute requireMember><SavingsContributionPage /></ProtectedRoute>} />
            <Route path="/loan-request" element={<ProtectedRoute requireMember><LoanRequestPage /></ProtectedRoute>} />
            <Route path="/loan-voting" element={<ProtectedRoute requireMember><LoanVotingPage /></ProtectedRoute>} />
            <Route path="/loan-repayment" element={<ProtectedRoute requireMember><LoanRepaymentPage /></ProtectedRoute>} />
            <Route path="/contribution-history" element={<ProtectedRoute requireMember><ContributionHistoryPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute requireMember><NotificationCenter /></ProtectedRoute>} />
            <Route path="/group/:groupId/chat" element={<ProtectedRoute requireMember><GroupMessaging /></ProtectedRoute>} />
            <Route path="/loan/:loanId/repayment" element={<ProtectedRoute requireMember><LoanRepaymentTracker /></ProtectedRoute>} />
            
            {/* Admin Public Routes */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/admin-reset-password/:token" element={<ResetPasswordPage />} />

            {/* Admin Protected Routes */}
            <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute>} />
            <Route path="/admin-manage-admins" element={<ProtectedAdminRoute requireSuperAdmin><AdminManagementPage /></ProtectedAdminRoute>} />
            <Route path="/admin-profile" element={<ProtectedAdminRoute><AdminProfilePage /></ProtectedAdminRoute>} />
            <Route path="/admin-activity-log" element={<ProtectedAdminRoute><AdminActivityLogPage /></ProtectedAdminRoute>} />
            <Route path="/admin-company-accounts" element={<ProtectedAdminRoute><AdminCompanyAccountsPage /></ProtectedAdminRoute>} />
            <Route path="/analytics" element={<ProtectedAdminRoute><AnalyticsDashboard /></ProtectedAdminRoute>} />
            
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">404 - Page not found</h1>
                    <p className="text-muted-foreground mb-6">The page you are looking for does not exist.</p>
                    <a href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium inline-block">
                      Back to home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
