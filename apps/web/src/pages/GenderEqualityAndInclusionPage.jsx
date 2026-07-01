import { ArrowLeft, Users, HeartHandshake, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function GenderEqualityAndInclusionPage() {
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
                <Users className="h-4 w-4" />
                Gender Equality and Social Inclusion (GESI)
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Making sure every voice can lead, participate, and thrive.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We believe real development happens when every person has equal access to opportunity. Our work breaks down barriers and creates space for women, youth, and underserved groups to lead with confidence.
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                By centering inclusion in our programming, we build stronger households, stronger groups, and stronger communities that reflect the people they serve.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Join as a member
                </a>
                <Link to="/staff" className="inline-flex items-center justify-center rounded-full border border-green-300 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50">
                  Meet the team
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">Our inclusion approach</h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <HeartHandshake className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Inclusive Research</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">We transform community members into active researchers, leveraging local data to drive evidence-based advocacy and shape meaningful development agendas.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <HeartHandshake className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Shifting Power Dynamics</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">We actively dismantle systemic barriers to ensure that young people, especially women and marginalized youth—gain the influence necessary to lead local and national development.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <Sparkles className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Safe Spaces</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">We uphold a "Security as a Right" standard by integrating robust protection protocols that mitigate psychosocial, physical, and digital risks for all participants.</p>
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
