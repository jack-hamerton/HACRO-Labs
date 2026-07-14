import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2, Clock3, XCircle, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  processed: 'bg-blue-100 text-blue-700',
  rejected: 'bg-rose-100 text-rose-700',
};

const AdminWithdrawalManagementPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('withdrawals').getFullList({
        expand: 'member_id',
        sort: '-created',
        $autoCancel: false,
      });
      setWithdrawals(records);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load withdrawal requests right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const filteredWithdrawals = useMemo(() => {
    if (filter === 'all') return withdrawals;
    return withdrawals.filter((item) => item.status === filter);
  }, [withdrawals, filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setActingId(id);
      await pb.collection('withdrawals').update(id, { status: newStatus, notes: `Reviewed by admin (${newStatus})` }, { $autoCancel: false });
      toast.success(`Withdrawal marked as ${newStatus}.`);
      await fetchWithdrawals();
    } catch (error) {
      console.error(error);
      toast.error('The withdrawal update failed.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <AdminLayout>
      <Helmet><title>Withdrawal Management - HACRO Hub</title></Helmet>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Withdrawal Management</h2>
            <p className="text-sm text-slate-500">Review member withdrawal requests and approve or reject them.</p>
          </div>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">All requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="processed">Processed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading withdrawal requestsâ€¦</div>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">No withdrawal requests found for this filter.</div>
          ) : (
            <div className="space-y-4">
              {filteredWithdrawals.map((item) => {
                const member = item.expand?.member_id;
                const memberName = member ? `${member.first_name || ''} ${member.last_name || ''}`.trim() : 'Unknown member';
                return (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="rounded-full bg-green-100 p-2 text-green-700">
                            <Wallet className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{memberName}</p>
                            <p className="text-sm text-slate-500">{member?.email || 'No email on file'}</p>
                          </div>
                        </div>
                        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="font-medium text-slate-700">Type</p>
                            <p>{item.withdrawal_type || '85_percent'}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Requested amount</p>
                            <p>KES {Number(item.withdrawal_amount_85 || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Carry forward</p>
                            <p>KES {Number(item.carry_forward_15 || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Status</p>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status] || statusStyles.pending}`}>
                              {item.status || 'pending'}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-sm text-slate-600">
                          <p className="font-medium text-slate-700">Notes</p>
                          <p>{item.notes || 'No additional notes.'}</p>
                        </div>
                      </div>

                      {item.status === 'pending' && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleStatusChange(item.id, 'approved')}
                            disabled={actingId === item.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'rejected')}
                            disabled={actingId === item.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-400"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminWithdrawalManagementPage;

