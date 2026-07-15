import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, CheckCircle2, Loader2, ShieldAlert, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const AdminFraudManagementPage = () => {
  const { isSuperAdmin, currentAdmin } = useAdminAuth();
  const SUPERADMIN_EMAIL = import.meta.env.VITE_SUPERADMIN_EMAIL || '';
  const [alerts, setAlerts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAlertId, setUpdatingAlertId] = useState(null);
  const [updatingMemberId, setUpdatingMemberId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsResponse, membersResponse] = await Promise.all([
        pb.collection('fraud_alerts').getFullList({ sort: '-created', $autoCancel: false }),
        pb.collection('members').getFullList({ sort: '-created', $autoCancel: false }),
      ]);

      const alertDetails = await Promise.all(
        alertsResponse.map(async (alert) => {
          let member = null;
          if (alert.member_id) {
            try {
              member = await pb.collection('members').getOne(alert.member_id, { $autoCancel: false });
            } catch (error) {
              console.warn('Failed to load member for fraud alert', error);
            }
          }
          return { ...alert, member };
        })
      );

      setAlerts(alertDetails);
      setMembers(membersResponse);
    } catch (error) {
      console.error('Failed to load fraud review data', error);
      toast.error('Failed to load fraud review data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAlertResolved = async (alert) => {
    try {
      setUpdatingAlertId(alert.id);
      await pb.collection('fraud_alerts').update(alert.id, { status: 'resolved' }, { $autoCancel: false });
      toast.success('Fraud alert marked as resolved.');
      await fetchData();
    } catch (error) {
      toast.error(error?.message || 'Unable to update fraud alert.');
    } finally {
      setUpdatingAlertId(null);
    }
  };

  const toggleMemberStatus = async (member, nextStatus) => {
    try {
      setUpdatingMemberId(member.id);
      await pb.collection('members').update(member.id, { status: nextStatus }, { $autoCancel: false });
      toast.success(`Member account ${nextStatus === 'suspended' ? 'suspended' : 'reactivated'}.`);
      await fetchData();
    } catch (error) {
      toast.error(error?.message || 'Unable to change member status.');
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const getMemberName = (member) => {
    if (!member) return 'Unknown member';
    return [member.first_name, member.last_name].filter(Boolean).join(' ') || member.email || 'Unknown member';
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Fraud Review - Admin Portal</title>
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[28px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                <ShieldAlert className="h-4 w-4" />
                Fraud review workspace
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">Fraud alerts and account review</h2>
              <p className="mt-2 text-sm text-slate-600">Review fraud alerts raised by the PocketBase automation, clear them when verified, and manage member account access for review.</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">Review tools</p>
              <p className="mt-1">Fraud alerts are processed from the automation hook and linked to the member account.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Fraud alerts</h3>
                  <p className="mt-1 text-sm text-slate-500">Flagged payments and suspicious activity that need review.</p>
                </div>
                <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                  {alerts.length} total
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {alerts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    No fraud alerts have been generated yet.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${alert.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                              {alert.severity || 'medium'} severity
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${alert.status === 'pending_review' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {alert.status === 'pending_review' ? 'Pending review' : alert.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-slate-900">{alert.alert_type || 'Fraud alert'}</h4>
                          <p className="text-sm text-slate-600">{alert.description || 'No description provided.'}</p>
                          <div className="text-sm text-slate-500">
                            <p><span className="font-medium text-slate-700">Member:</span> {getMemberName(alert.member)}</p>
                            <p><span className="font-medium text-slate-700">Detected:</span> {new Date(alert.detected_at || alert.created).toLocaleString()}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={updatingAlertId === alert.id || alert.status === 'resolved'}
                          onClick={() => markAlertResolved(alert)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingAlertId === alert.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          {alert.status === 'resolved' ? 'Cleared' : 'Unflag / clear'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Member review controls</h3>
                  <p className="mt-1 text-sm text-slate-500">Suspend or reactivate a member account while fraud review is ongoing.</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  {isSuperAdmin ? 'Super admin controls' : 'Restricted review controls'}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {members.map((member) => {
                  const memberStatus = member.status || 'active';
                  const isSuspended = memberStatus === 'suspended';
                  return (
                    <div key={member.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{getMemberName(member)}</p>
                          <p className="mt-1 text-sm text-slate-500">{member.email || 'No email on record'}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isSuspended ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </div>

                      {(isSuperAdmin || currentAdmin?.email === SUPERADMIN_EMAIL) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={updatingMemberId === member.id || isSuspended}
                            onClick={() => toggleMemberStatus(member, 'suspended')}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingMemberId === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                            Suspend for review
                          </button>
                          <button
                            type="button"
                            disabled={updatingMemberId === member.id || !isSuspended}
                            onClick={() => toggleMemberStatus(member, 'active')}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingMemberId === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                            Unsuspend
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFraudManagementPage;
