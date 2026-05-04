import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, Twitter, Linkedin, Instagram, Facebook, Globe, Briefcase } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import apiServerClient from '@/lib/apiServerClient.js';

const fallbackStaffMembers = [
  {
    name: 'Jack Hamerton',
    role: 'Founder & Executive Director',
    position: 'Executive Director',
    bio: 'Leading HACRO Labs with community-driven digital and financial empowerment programs.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/jack-otieno',
      twitter: 'https://twitter.com/jackotieno',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
  {
    name: 'Byrone Otieno',
    role: 'Operations Manager',
    position: 'Operations Manager',
    bio: 'Coordinates training, partnerships, and community outreach across Kenya.',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/amina-mwangi',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
  {
    name: 'Samuel Karanja',
    role: 'Technology Lead',
    position: 'Technology Lead',
    bio: 'Builds and supports the HACRO Labs digital membership and operations platform.',
    photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/samuel-karanja',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
  {
    name: 'Ruth Njeri',
    role: 'Community Engagement Specialist',
    position: 'Community Engagement Specialist',
    bio: 'Supports members with onboarding, group management, and local impact initiatives.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/ruth-njeri',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
];

const StaffPage = () => {
  const [staffMembers, setStaffMembers] = useState(fallbackStaffMembers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await apiServerClient.fetch('/staff');

        if (!response.ok) {
          throw new Error('Server response not OK');
        }

        const data = await response.json();
        if (Array.isArray(data.staff) && data.staff.length > 0) {
          setStaffMembers(data.staff);
        }
      } catch (fetchError) {
        console.warn('Using fallback staff list:', fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, []);

  return (
    <>
      <Helmet>
        <title>HACRO Labs Team</title>
        <meta
          name="description"
          content="Meet the HACRO Labs Team who support community development, member services, and financial empowerment." 
        />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.35em] text-primary">HACRO Labs</p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">Meet our Team</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
              These are the people who keep HACRO Labs running, help members grow, and ensure the platform remains secure,
              supportive, and community-first.
            </p>
          </section>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <section className="grid gap-8 lg:grid-cols-2">
              {staffMembers.map((member) => (
                <article key={member.id || member.name} className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative mb-6 h-36 overflow-hidden rounded-3xl bg-slate-100">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                        {member.name.split(' ').map((part) => part[0]).join('')}
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-semibold text-foreground mb-1">{member.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Briefcase className="w-4 h-4" />
                    <span>{member.position || member.role}</span>
                  </div>
                  <p className="text-muted-foreground leading-7 mb-6">{member.bio}</p>

                  <div className="flex flex-wrap gap-3">
                    {member.socialLinks?.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/10 px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary">
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a href={member.socialLinks.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/10 px-4 py-2 text-sm text-foreground transition hover:border-sky-500 hover:text-sky-600">
                        <Twitter className="w-4 h-4" /> Twitter
                      </a>
                    )}
                    {member.socialLinks?.instagram && (
                      <a href={member.socialLinks.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/10 px-4 py-2 text-sm text-foreground transition hover:border-fuchsia-500 hover:text-fuchsia-600">
                        <Instagram className="w-4 h-4" /> Instagram
                      </a>
                    )}
                    {member.socialLinks?.facebook && (
                      <a href={member.socialLinks.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/10 px-4 py-2 text-sm text-foreground transition hover:border-blue-600 hover:text-blue-600">
                        <Facebook className="w-4 h-4" /> Facebook
                      </a>
                    )}
                    {member.socialLinks?.website && (
                      <a href={member.socialLinks.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/10 px-4 py-2 text-sm text-foreground transition hover:border-slate-700 hover:text-slate-900">
                        <Globe className="w-4 h-4" /> Website
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}

          <section className="mt-20 rounded-3xl border border-border bg-primary/5 p-10 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Are you interested in joining the HACRO Labs community?</h2>
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground">
              Our team is always working to build stronger networks, provide better resources, and invite new members into the journey.
              Everyone is welcome to explore and engage with HACRO Labs.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StaffPage;
