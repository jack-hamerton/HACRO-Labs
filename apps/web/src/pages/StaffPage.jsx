import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, Twitter, Linkedin, Instagram, Facebook, Globe, Briefcase } from 'lucide-react';
import Header from '@/components/Header.jsx';
import apiServerClient from '@/lib/apiServerClient.js';

const advisoryBoardMembers = [
  {
    name: 'Jack Hamerton',
    role: 'Chair, Advisory Board',
    position: 'Governance & Strategy Advisor',
    bio: 'Guides HACRO Hub on long-term governance, policy alignment, and partnership growth for sustained impact.',
    photo: '/images/0Q4A0693.jpg',
  },
  {
    name: 'Dr. Daniel Mugo',
    role: 'Finance & Sustainability Advisor',
    position: 'Financial Sustainability Advisor',
    bio: 'Supports financial planning, resource mobilization, and resilient growth strategies for the organization.',
    photo: '/images/',
  },
  {
    name: 'Ms. Brenda Achieng',
    role: 'Community Development Advisor',
    position: 'Community Impact Advisor',
    bio: 'Brings deep experience in community engagement and ensures programs remain people-centered and inclusive.',
    photo: '/images/',
  },
  {
    name: 'Mr. Peter Nyaga',
    role: 'Youth & Digital Inclusion Advisor',
    position: 'Digital Access Advisor',
    bio: 'Advises on youth engagement, digital transformation, and expanding access to tools and opportunities.',
    photo: '/images/',
  },
  {
    name: 'Dr. Sarah Ouma',
    role: 'Education & Training Advisor',
    position: 'Learning & Capacity Building Advisor',
    bio: 'Helps shape training initiatives that build practical skills and strengthen member confidence and growth.',
    photo: '/images/',
  },
  {
    name: 'Mr. James Kariuki',
    role: 'Operations & Partnerships Advisor',
    position: 'Partnerships & Operations Advisor',
    bio: 'Supports strategic partnerships, operational excellence, and collaboration across the wider ecosystem.',
    photo: '/images/',
  },
];

const fallbackStaffMembers = [
  {
    name: 'Jack Hamerton',
    role: 'Founder & Executive Director',
    position: 'Executive Director',
    bio: 'Leading HACRO Hub with community-driven strategic oversight and governance for the organization, ensuring alignment with our mission and values for sustainability and lomg-term impact.',
    photo: '/images/0Q4A0693.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/jack-hamerton-6206911a3',
      twitter: 'https://twitter.com/jackotieno',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
   {
    name: 'Jessy Mala',
    role: 'Programs Manager',
    position: 'Program Delivery Manager',
    bio: 'Oversees the planning,coordination and execution of programmes, ensuring they meet organizational goals, stakeholders expectations and community needs.',
    photo: '/images/',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/chrispine-samwel-8ab695278?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      twitter: 'https://x.com/CHRISAMMY_254',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
  {
    name: 'Chrispine Samwel',
    role: 'Development Gateway Manager',
    position: 'Development Gateway Manager',
    bio: 'Coordinates for information, resources and partnerships across development initiatives "Gateway" ensure donors and stakeholders are connected effectively to development opportunities.',
    photo: '/images/Whats-App-Image-2026-06-18-at-09-19-39-(1).jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/chrispine-samwel-8ab695278?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      twitter: 'https://x.com/CHRISAMMY_254',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
  {
    name: 'Samuel Karanja',
    role: 'Community Oureach Coordinator',
    position: 'Community Oureach Coordinator',
    bio: 'Plans and executes community outreach initiatives to engage and support local members and ensures the organization presence in local communities.',
    photo: '/images/',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/samuel-karanja',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
   {
    name: 'Samuel Karanja',
    role: 'Program Delivery Unit',
    position: 'Program Delivery Unit Officer',
    bio: 'Assist in developing delivery plans, timelines and execution strategies for programs objectives and deliverable milestones.',
    photo: '/images/',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/samuel-karanja',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
   {
    name: 'Samuel Karanja',
    role: 'Program Delivery Unit',
    position: 'Program Delivery Unit Officer',
    bio: 'Assist in developing delivery plans, timelines and execution strategies for programs objectives and deliverable milestones.',
    photo: '/images/',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/samuel-karanja',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
   {
    name: 'Samuel Karanja',
    role: 'Program Delivery Unit',
    position: 'Program Delivery Unit Officer',
    bio: 'Assist in developing delivery plans, timelines and execution strategies for programs objectives and deliverable milestones.',
    photo: '/images/',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/samuel-karanja',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    }
  },
   {
    name: 'Samuel Karanja',
    role: 'Program Delivery Unit',
    position: 'Program Delivery Unit Officer',
    bio: 'Assist in developing delivery plans, timelines and execution strategies for programs objectives and deliverable milestones.',
    photo: '/images/',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/samuel-karanja',
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
        <title>HACRO Hub Team</title>
        <meta
          name="description"
          content="Meet the HACRO Hub Team who support community development, member services, and financial empowerment." 
        />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20 sm:pt-24">
          <section className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.35em] text-primary">HACRO Hub</p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">Meet our Team</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
              These are the people who keep HACRO Hub running, help members grow, and ensure the platform remains secure,
              supportive, and community-first.
            </p>
          </section>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <>
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

              <section className="mt-20">
                <div className="mb-8 text-center">
                  <p className="text-sm uppercase tracking-[0.35em] text-primary">Board of Advisory</p>
                  <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">Our Advisory Team</h2>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                    A dedicated circle of advisors who guide HACRO Hub with wisdom, practical expertise, and a shared commitment to community growth.
                  </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {advisoryBoardMembers.map((member) => (
                    <article key={member.name} className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative mb-6 h-36 overflow-hidden rounded-3xl bg-slate-100">
                        <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-1">{member.name}</h3>
                      <p className="text-sm font-medium text-primary">{member.role}</p>
                      <p className="mt-2 text-sm font-semibold text-muted-foreground">{member.position}</p>
                      <p className="mt-4 text-muted-foreground leading-7">{member.bio}</p>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          <section className="mt-20 rounded-3xl border border-border bg-primary/5 p-10 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Are you interested in joining the HACRO Hub community?</h2>
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground">
              Our team is always working to build stronger networks, provide better resources, and invite new members into the journey.
              Everyone is welcome to explore and engage with HACRO Hub.
            </p>
          </section>
        </main>

      </div>
    </>
  );
};

export default StaffPage;


