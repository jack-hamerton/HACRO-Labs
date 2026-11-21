import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, LoaderCircle, MapPin, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { HUB_COLLECTIONS } from '@/lib/hubData.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function StakeholderProfile() {
  const { stakeholderId } = useParams();
  const navigate = useNavigate();
  const { isMember, currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    pb.collection(HUB_COLLECTIONS.stakeholders).getOne(stakeholderId, { expand: 'area_id', $autoCancel: false })
      .then((record) => { if (active) setProfile(record); })
      .catch((error) => { console.error(error); toast.error('Profile not found or is private.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [stakeholderId]);

  if (loading) return <div className="min-h-screen bg-slate-50"><Header /><div className="flex justify-center py-32 text-slate-500"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" />Loading profile…</div><Footer /></div>;

  const items = (value) => Array.isArray(value) ? value : [];
  return <div className="min-h-screen bg-slate-50 text-slate-900"><Header /><main className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:px-8"><Link to="/hub" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><ArrowLeft className="h-4 w-4" />Back to the Hub</Link>{profile && <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-sm font-semibold text-emerald-800">{profile.entity_type}</p><h1 className="mt-2 text-3xl font-semibold">{profile.display_name}</h1><p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" />{profile.area || profile.expand?.area_id?.location || profile.location}</p></div>{profile.verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-900"><CheckCircle2 className="h-4 w-4" />Verified</span>}</div><p className="mt-8 whitespace-pre-wrap leading-7 text-slate-700">{profile.description}</p><section className="mt-8"><h2 className="font-semibold">Community work and track record</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{profile.community_work || 'No track record has been published.'}</p></section>{Array.isArray(profile.active_cohorts) && profile.active_cohorts.length > 0 && <section className="mt-7"><h2 className="font-semibold">Active cohorts</h2><p className="mt-2 text-sm text-slate-600">{profile.active_cohorts.join(', ')}</p></section>}<div className="mt-8 grid gap-6 sm:grid-cols-2"><section><h2 className="font-semibold">Capabilities offered</h2><ul className="mt-3 space-y-2 text-sm text-slate-600">{items(profile.offers).map((value) => <li key={value}>• {value}</li>)}</ul></section><section><h2 className="font-semibold">Collaboration needs</h2><ul className="mt-3 space-y-2 text-sm text-slate-600">{items(profile.seeks).map((value) => <li key={value}>• {value}</li>)}</ul></section></div><div className="mt-8 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />Only information intentionally published on this profile is shown. Personal account contact details remain private.</div>{isMember && profile.owner !== currentUser?.id && <button className="mt-7 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white" onClick={() => navigate('/hub', { state: { collaborateWith: profile.id } })}>Propose collaboration</button>}</article>}</main><Footer /></div>;
}
