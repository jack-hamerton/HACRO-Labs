import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, User, Wallet, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminMemberSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const members = await pb.collection('members').getFullList({
          filter: `first_name~"${query}" || last_name~"${query}" || email~"${query}" || phone~"${query}"`,
          $autoCancel: false,
        });
        setResults(members);
      } catch (error) {
        console.error(error);
        toast.error('Member search failed.');
      } finally {
        setLoading(false);
      }
    };

    const timeout = window.setTimeout(runSearch, 350);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const summary = useMemo(() => {
    return results.length > 0 ? `${results.length} member${results.length === 1 ? '' : 's'} found` : 'Search by name, email, or phone';
  }, [results]);

  return (
    <AdminLayout>
      <Helmet><title>Member Search - HACRO Hub</title></Helmet>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Member Search</h2>
          <p className="text-sm text-slate-500">Find members quickly and review their core account details.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Search className="h-4 w-4 text-green-600" />
            Search members
          </label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, or phone"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-0 focus:border-green-500"
          />
          <p className="mt-2 text-sm text-slate-500">{summary}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500">Searching membersâ€¦</div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No members match your search yet.</div>
          ) : (
            <div className="space-y-3">
              {results.map((member) => (
                <div key={member.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-green-100 p-2 text-green-700">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{member.first_name} {member.last_name}</p>
                        <p className="text-sm text-slate-500">{member.email || 'No email'}</p>
                        <p className="text-sm text-slate-500">Phone: {member.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1">
                        <Wallet className="h-4 w-4 text-green-600" />
                        Savings overview available in member details
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        Loan and collateral records available
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMemberSearchPage;

