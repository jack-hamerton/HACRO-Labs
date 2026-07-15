import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const AdminMemberDetailsPage = () => {
  const navigate = useNavigate();
  const { adminToken } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [expanded, setExpanded] = useState({
    savings: false,
    loans: false,
    payments: false,
    contributions: false
  });

  

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Enter a search term');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/members/search?q=${encodeURIComponent(searchQuery)}&limit=50`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setSearchResults(data.members || []);
      
      if (data.members.length === 0) {
        toast.info('No members found');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to search members');
    } finally {
      setLoading(false);
    }
  };

  

  const fetchMemberDetails = async (memberId) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/admin/members/${memberId}/summary`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (!response.ok) throw new Error('Failed to load member details');

      const data = await response.json();
      setMemberDetails(data);
      setSelectedMember(memberId);
    } catch (error) {
      toast.error(error.message || 'Failed to load member details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
      'partially_paid': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Helmet>
        <title>Member Details - Admin - HACRO Hub</title>
      </Helmet>

      <AdminLayout title="Member Details" subtitle="View comprehensive member information and activity">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {                }
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {                }
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">Members ({searchResults.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <p className="text-gray-500 text-sm">Search for members to view details</p>
                  ) : (
                    searchResults.map(member => (
                      <button
                        key={member.id}
                        onClick={() => fetchMemberDetails(member.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedMember === member.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{member.first_name} {member.last_name}</div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                        <div className="text-xs text-gray-500 mt-1">{member.phone_number}</div>
                        <div className="text-xs bg-gray-100 text-gray-700 inline-block px-2 py-1 rounded mt-1">
                          {member.group_name}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {                }
            <div className="lg:col-span-2">
              {detailsLoading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : memberDetails ? (
                <div className="space-y-6">
                  
                  {              }
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {memberDetails.member.first_name} {memberDetails.member.last_name}
                        </h2>
                        <p className="text-gray-600">{memberDetails.member.email}</p>
                        <p className="text-gray-600">{memberDetails.member.phone_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-medium">{formatDate(memberDetails.member.created)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{memberDetails.member.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Group</p>
                        <p className="font-medium">
                          {memberDetails.member.group?.name || 'Not Assigned'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {               }
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-600">Total Savings</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(memberDetails.summary.total_savings)}
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-600">Total Borrowed</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(memberDetails.summary.total_borrowed)}
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-600">Total Repaid</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(memberDetails.summary.total_repaid)}
                      </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm text-orange-600">Outstanding</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatCurrency(memberDetails.summary.outstanding_balance)}
                      </p>
                    </div>
                  </div>

                  {                 }
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSection('savings')}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        ðŸ’° Savings
                        <span className="text-sm text-gray-600">
                          ({memberDetails.savings.contribution_count} contributions)
                        </span>
                      </h3>
                      <ChevronRight className={`w-5 h-5 transition-transform ${expanded.savings ? 'rotate-90' : ''}`} />
                    </button>
                    {expanded.savings && (
                      <div className="border-t p-4 space-y-3">
                        <p className="text-sm text-gray-600">
                          Total Saved: <span className="font-bold text-gray-900">
                            {formatCurrency(memberDetails.savings.total_saved)}
                          </span>
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {memberDetails.savings.recent_contributions.map(saving => (
                            <div key={saving.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                              <div>
                                <p className="font-medium">{saving.description}</p>
                                <p className="text-gray-600">{formatDate(saving.date)}</p>
                              </div>
                              <p className="font-semibold">{formatCurrency(saving.amount)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {               }
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSection('loans')}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        ðŸ“‹ Loans
                        <span className="text-sm text-gray-600">
                          ({memberDetails.loans.active_loans} active)
                        </span>
                      </h3>
                      <ChevronRight className={`w-5 h-5 transition-transform ${expanded.loans ? 'rotate-90' : ''}`} />
                    </button>
                    {expanded.loans && (
                      <div className="border-t p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">Total Borrowed</p>
                            <p className="font-bold">{formatCurrency(memberDetails.loans.total_borrowed)}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">Total Repaid</p>
                            <p className="font-bold">{formatCurrency(memberDetails.loans.total_repaid)}</p>
                          </div>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {memberDetails.loans.loans.map(loan => (
                            <div key={loan.id} className="p-3 bg-gray-50 rounded border-l-4 border-primary">
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-semibold">{formatCurrency(loan.amount)}</p>
                                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(loan.status)}`}>
                                  {loan.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Interest: {loan.interest_rate}% | Period: {loan.repayment_period} months
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(loan.created)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {                  }
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSection('payments')}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        ðŸ’³ Payments
                        <span className="text-sm text-gray-600">
                          ({memberDetails.payments.total_payments} total)
                        </span>
                      </h3>
                      <ChevronRight className={`w-5 h-5 transition-transform ${expanded.payments ? 'rotate-90' : ''}`} />
                    </button>
                    {expanded.payments && (
                      <div className="border-t p-4 space-y-3">
                        {memberDetails.payments.by_type && Object.entries(memberDetails.payments.by_type).map(([type, data]) => (
                          <div key={type} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="flex justify-between">
                              <p className="font-medium capitalize">{type.replace('_', ' ')}</p>
                              <p className="text-gray-600">{data.count} payments</p>
                            </div>
                            <p className="text-gray-600">Total: {formatCurrency(data.total)}</p>
                          </div>
                        ))}
                        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                          {memberDetails.payments.recent.map(payment => (
                            <div key={payment.id} className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded text-sm">
                              <div>
                                <p className="font-medium capitalize">{payment.type.replace('_', ' ')}</p>
                                <p className="text-gray-600">{formatDate(payment.date)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(payment.status)}`}>
                                  {payment.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {                       }
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSection('contributions')}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        ðŸ“Š Contribution History
                        <span className="text-sm text-gray-600">
                          ({memberDetails.contributions.total_records})
                        </span>
                      </h3>
                      <ChevronRight className={`w-5 h-5 transition-transform ${expanded.contributions ? 'rotate-90' : ''}`} />
                    </button>
                    {expanded.contributions && (
                      <div className="border-t p-4">
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {memberDetails.contributions.recent.map(contrib => (
                            <div key={contrib.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                              <div>
                                <p className="font-medium capitalize">{contrib.type}</p>
                                <p className="text-gray-600">{formatDate(contrib.date)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(contrib.amount)}</p>
                                <p className="text-xs text-gray-500">Balance: {formatCurrency(contrib.balance)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {                  }
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900">View Only</p>
                      <p className="text-blue-800">You are viewing member data for reference only. Changes cannot be made from this view.</p>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a member from the list to view details</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminMemberDetailsPage;

