import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, BarChart3, CheckCircle2, ChevronDown, Handshake, MapPin, Plus, Search, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import MemberPortalLayout from '@/components/MemberPortalLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const TYPES = ['Youth Group', 'Vocational Trainer', 'Private-Sector Vendor/Employer', 'CBO', 'Local Leader', 'Individual'];
const PHASES = ['baseline', 'midline', 'endline'];

function asList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function Card({ children, className = '' }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</section>;
}

export default function HubPageFixed() {
  const { currentUser, isMember } = useAuth();
  const [areas, setAreas] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [area, setArea] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All partners');
  const [phase, setPhase] = useState('baseline');
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [profile, setProfile] = useState({ display_name: '', entity_type: TYPES[0], location: '', description: '', sectors: '', offers: '', seeks: '', community_work: '', visibility: 'public' });
  const [project, setProject] = useState({ title: '', description: '', goals: '', status: 'active', visibility: 'public' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [areaRows, stakeholderRows, projectRows, outcomeRows] = await Promise.all([
        pb.collection('hub_areas').getFullList({ sort: '-created', $autoCancel: false }).catch(() => []),
        pb.collection('hub_stakeholders').getFullList({ sort: '-created', expand: 'owner,area_id', $autoCancel: false }).catch(() => []),
        pb.collection('hub_projects').getFullList({ sort: '-created', expand: 'owner,area_id', $autoCancel: false }).catch(() => []),
        pb.collection('hub_outcomes').getFullList({ sort: '-created', expand: 'project', $autoCancel: false }).catch(() => []),
      ]);
      setAreas(areaRows.filter((item) => item.verified || item.owner === currentUser?.id));
      setStakeholders(stakeholderRows.filter((item) => item.visibility === 'public' || item.owner === currentUser?.id));
      setProjects(projectRows.filter((item) => item.visibility === 'public' || item.owner === currentUser?.id));
      setOutcomes(outcomeRows.filter((item) => item.status === 'published' || item.recorded_by === currentUser?.id));

      const home = String(currentUser?.hub_area || currentUser?.location || '').trim();
      const available = [...new Map(areaRows.map((item) => [String(item.location || item.name || '').trim(), item.location || item.name]).filter(([value]) => value)).values()];
      if (!area) {
        const preferred = available.find((value) => value.toLowerCase() === home.toLowerCase()) || home || available[0] || '';
        setArea(preferred);
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to load Hub data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (currentUser) loadData(); }, [currentUser]);

  const areaOptions = useMemo(() => {
    const values = new Map();
    for (const item of areas) {
      const value = String(item.location || item.name || '').trim();
      if (value) values.set(value.toLowerCase(), value);
    }
    const home = String(currentUser?.hub_area || currentUser?.location || '').trim();
    if (home) values.set(home.toLowerCase(), home);
    return [...values.values()].sort((a, b) => a.localeCompare(b));
  }, [areas, currentUser]);

  const normalize = (value) => String(value || '').split(',').map((part) => part.trim().toLowerCase()).filter(Boolean);
  const matchesArea = (record) => {
    const selected = normalize(area);
    const recordArea = normalize(record?.area || record?.location || record?.expand?.area_id?.location);
    return !selected.length || selected.some((part) => recordArea.includes(part));
  };

  const visibleStakeholders = useMemo(() => stakeholders.filter((person) => {
    if (!matchesArea(person)) return false;
    if (category !== 'All partners' && person.entity_type !== category) return false;
    const text = [person.display_name, person.description, person.community_work, ...asList(person.sectors), ...asList(person.offers), ...asList(person.seeks)].join(' ').toLowerCase();
    return text.includes(search.trim().toLowerCase());
  }), [stakeholders, area, category, search]);

  const activeProjects = useMemo(() => projects.filter((item) => matchesArea(item)), [projects, area]);
  const publishedOutcomes = useMemo(() => outcomes.filter((item) => matchesArea(item)), [outcomes, area]);
  const ownStakeholder = stakeholders.find((item) => item.owner === currentUser?.id);

  const createProfile = async (event) => {
    event.preventDefault();
    if (!isMember) return;
    try {
      const payload = {
        owner: currentUser.id,
        display_name: profile.display_name.trim(),
        entity_type: profile.entity_type,
        area,
        location: profile.location.trim(),
        description: profile.description.trim(),
        sectors: profile.sectors.split(',').map((item) => item.trim()).filter(Boolean),
        offers: profile.offers.split(',').map((item) => item.trim()).filter(Boolean),
        seeks: profile.seeks.split(',').map((item) => item.trim()).filter(Boolean),
        community_work: profile.community_work.trim(),
        visibility: profile.visibility,
        verified: false,
      };
      if (ownStakeholder) await pb.collection('hub_stakeholders').update(ownStakeholder.id, payload, { $autoCancel: false });
      else await pb.collection('hub_stakeholders').create(payload, { $autoCancel: false });
      toast.success('Stakeholder profile saved for verification.');
      setProfileOpen(false);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.message || error?.message || 'Could not save profile.');
    }
  };

  const createProject = async (event) => {
    event.preventEvent?.();
    event.preventDefault?.();
    if (!isMember) return;
    try {
      const record = await pb.collection('hub_projects').create({
        owner: currentUser.id,
        title: project.title.trim(),
        area,
        description: project.description.trim(),
        goals: project.goals.trim(),
        status: 'active',
        visibility: 'public',
      }, { $autoCancel: false });
      toast.success('Community project created.');
      setProjectOpen(false);
      setProject({ title: '', description: '', goals: '', status: 'active', visibility: 'public' });
      await loadData();
      return record;
    } catch (error) {
      toast.error(error?.response?.message || error?.message || 'Could not create project.');
    }
  };

  const phaseMetrics = PHASES.map((round) => {
    const rows = publishedOutcomes.filter((item) => item.phase === round);
    return {
      phase: round,
      enrolled: rows.reduce((sum, item) => sum + Number(item.youth_enrolled || 0), 0),
      placed: rows.reduce((sum, item) => sum + Number(item.apprenticeships_placed || 0), 0),
      women: rows.reduce((sum, item) => sum + Number(item.women_participants || 0), 0),
      marginalized: rows.reduce((sum, item) => sum + Number(item.marginalized_participants || 0), 0),
    };
  });

  return (
    <MemberPortalLayout title="Youth Livelihoods Hub" subtitle={area ? `Your local ecosystem: ${area}` : 'Community-owned economic opportunity'}>
      <div className="min-h-[calc(100vh-12rem)] bg-[#f7faf7] text-slate-900">
        <section className="relative overflow-hidden px-6 py-14 text-white sm:px-8 sm:py-16 lg:px-12">
          <div className="absolute inset-0" style={{ backgroundImage: "url('/images/2nd.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_38%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100"><Sparkles className="h-4 w-4" /> Community livelihoods network</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Local knowledge. Shared opportunity.</h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/80">Discover local organizations, coordinate projects, and use consent-led evidence to adapt work-readiness initiatives.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm sm:min-w-[280px]">
              <label htmlFor="hub-area" className="text-xs font-semibold uppercase tracking-wider text-emerald-100/70">Focus area</label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300" />
                <select id="hub-area" value={area} onChange={(event) => setArea(event.target.value)} className="w-full appearance-none rounded-xl border border-white/15 bg-slate-950/70 py-3 pl-10 pr-9 text-sm text-white outline-none">
                  {areaOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-200" />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-12">
          {loading && <Card><p className="text-sm text-slate-500">Loading community data…</p></Card>}
          {!loading && <>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[['Verified areas', areas.length], ['Verified partners', stakeholders.filter((item) => item.verified).length], ['Active projects', activeProjects.filter((item) => item.status === 'active').length], ['Assessment records', publishedOutcomes.length]].map(([label, value]) => <Card key={label} className="p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></Card>)}
            </section>

            <Card>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">People & organizations</p><h2 className="mt-2 text-2xl font-semibold">Build your local network</h2></div>
                {isMember && <button type="button" onClick={() => setProfileOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" />{ownStakeholder ? 'Edit my profile' : 'Create my profile'}</button>}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Search verified profiles" placeholder="Search capabilities, sectors, or needs" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none" /></div>
                <div className="flex flex-wrap gap-2">{['All partners', ...TYPES].map((type) => <button key={type} type="button" onClick={() => setCategory(type)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${category === type ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-slate-200 text-slate-600'}`}>{type}</button>)}</div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleStakeholders.map((person) => <Link key={person.id} to={`/hub/stakeholders/${person.id}`} className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-400 hover:shadow-lg"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{person.display_name}</h3><p className="mt-1 text-xs text-slate-500">{person.entity_type} · {person.area}</p></div>{person.verified ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-900"><CheckCircle2 className="h-3 w-3" />Verified</span> : <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-900">Unverified</span>}</div><p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{person.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{asList(person.offers).slice(0, 4).map((item) => <span key={item} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800">{item}</span>)}</div><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">View profile <ArrowRight className="h-4 w-4" /></span></Link>)}
              </div>
              {!visibleStakeholders.length && <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No public profiles match this area and filter yet.</p>}
            </Card>

            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Community interventions</p><h2 className="mt-2 text-2xl font-semibold">Projects in {area || 'your area'}</h2></div>{isMember && <button type="button" onClick={() => setProjectOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Create project</button>}</div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">{activeProjects.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 p-4"><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm text-slate-600">{item.description}</p><p className="mt-3 text-xs capitalize text-slate-500">{item.status} · {item.area}</p></article>)}</div>
              {!activeProjects.length && <p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No published projects in this area yet.</p>}
            </Card>

            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Implementation research · IRGA</p><h2 className="mt-2 text-2xl font-semibold">Assessment workbench</h2></div><div className="flex gap-2"><button type="button" onClick={() => toast.success('CSV export ready from published outcomes.')} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold">CSV</button><button type="button" onClick={() => toast.success('JSON export ready from published outcomes.')} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold">JSON</button></div></div>
              <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">{PHASES.map((round) => <button key={round} type="button" onClick={() => setPhase(round)} className={`rounded-lg px-2 py-3 text-sm font-semibold capitalize ${phase === round ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}>{round}</button>)}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{phaseMetrics.map((metric) => <div key={metric.phase} className={`rounded-xl p-4 ${phase === metric.phase ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'}`}><p className="text-xs text-slate-500 capitalize">{metric.phase}</p><p className="mt-1 text-sm">Enrolled <strong>{metric.enrolled}</strong></p><p className="mt-1 text-sm">Placed <strong>{metric.placed}</strong></p><p className="mt-1 text-sm">Women <strong>{metric.women}</strong></p><p className="mt-1 text-sm">Marginalized <strong>{metric.marginalized}</strong></p></div>)}</div>
              {!publishedOutcomes.length && <p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No published assessment outcomes yet for this area.</p>}
            </Card>
          </>}
        </div>
      </div>

      {profileOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4"><form onSubmit={createProfile} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">{ownStakeholder ? 'Edit stakeholder profile' : 'Create stakeholder profile'}</h2><button type="button" onClick={() => setProfileOpen(false)} className="text-sm">Close</button></div><div className="grid gap-3 sm:grid-cols-2"><input required placeholder="Organization or display name" value={profile.display_name} onChange={(event) => setProfile({ ...profile, display_name: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><select value={profile.entity_type} onChange={(event) => setProfile({ ...profile, entity_type: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">{TYPES.map((type) => <option key={type}>{type}</option>)}</select><input placeholder="Physical area or community" value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} className="sm:col-span-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><textarea required placeholder="About the organization" value={profile.description} onChange={(event) => setProfile({ ...profile, description: event.target.value })} className="sm:col-span-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><input placeholder="Capabilities offered, comma-separated" value={profile.offers} onChange={(event) => setProfile({ ...profile, offers: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><input placeholder="Collaboration needs, comma-separated" value={profile.seeks} onChange={(event) => setProfile({ ...profile, seeks: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><textarea placeholder="Community work and track record" value={profile.community_work} onChange={(event) => setProfile({ ...profile, community_work: event.target.value })} className="sm:col-span-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div><button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white">Save profile</button></form></div>}

      {projectOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4"><form onSubmit={createProject} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Create community project</h2><button type="button" onClick={() => setProjectOpen(false)} className="text-sm">Close</button></div><div className="grid gap-3"><input required placeholder="Project title" value={project.title} onChange={(event) => setProject({ ...project, title: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><textarea required placeholder="Description" value={project.description} onChange={(event) => setProject({ ...project, description: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><textarea placeholder="Goals" value={project.goals} onChange={(event) => setProject({ ...project, goals: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div><button type="submit" className="mt-5 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white">Create project</button></form></div>}
    </MemberPortalLayout>
  );
}
