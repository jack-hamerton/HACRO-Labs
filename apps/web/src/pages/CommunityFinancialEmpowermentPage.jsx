import { ArrowLeft, ShieldCheck, Landmark, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function CommunityFinancialEmpowermentPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <main className="pt-24 pb-20">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700">
                <ShieldCheck className="h-4 w-4" />
                Community Financial Empowerment Protection
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Protecting savings, access, and dignity through smarter finance.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We are digitizing the chama spirit to build a safety net for everyone. Our platform helps communities pool resources, make fair decisions, and access credit with transparency and accountability.
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                By combining simple digital tools with trusted community structures, we make it easier for members to save responsibly, borrow fairly, and grow wealth together without fear of exclusion.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Join the movement
                </a>
                <Link to="/donate" className="inline-flex items-center justify-center rounded-full border border-green-300 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50">
                  Support the mission
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">What this pillar delivers</h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <Landmark className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Transparent savings circles</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">Each member has a digital record that ensures complete accountability for all group finances. Members can effortlessly track their individual contributions, monitor loan approvals, and view real-time account balances, replacing manual processes with a secure, transparent, and collaborative ledger.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <Landmark className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Peer To Peer Community Savings</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">This digital chama platform empowers community members to pool resources and manage collective funds with full transparency. Members maintain complete control over their group, making autonomous decisions on loan approvals while using secure digital tools to ensure accountability.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <Smartphone className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Accessible digital tools</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">It streamlines community finance by simplifying essential tasks such as processing payments, requesting loans, and facilitating member communication. By providing intuitive, user-friendly technology, we ensure that support is always within reach and that managing group finances is efficient, accessible, and inclusive for all members.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
