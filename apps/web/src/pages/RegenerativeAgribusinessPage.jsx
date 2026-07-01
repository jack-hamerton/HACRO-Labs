import { ArrowLeft, Sprout, Leaf, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function RegenerativeAgribusinessPage() {
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
                <Sprout className="h-4 w-4" />
                Regenerative Agribusiness
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Growing food, income, and resilience in a way that restores the land.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We believe farming should be profitable, resilient, and restorative. Our approach combines regenerative practices, better market access, and smarter farming methods to deliver more value for producers and communities.
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Through practical support and long-term planning, we help rural livelihoods become more sustainable while protecting the environment for future generations.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Explore our programs
                </a>
                <Link to="/donate" className="inline-flex items-center justify-center rounded-full border border-green-300 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50">
                  Invest in impact
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">Our agribusiness focus</h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <Leaf className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Eco-friendly production</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">We encourage regenerative methods that reduce harm to the soil, water, and surrounding ecosystems.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <Leaf className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Regenerative Resilience</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">We combine practical support and long-term planning to help rural livelihoods become more sustainable while protecting the environment for future generations.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <BarChart3 className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Better value chains</h3>
                    <p className="mt-1 text-sm leading-7 text-gray-600">We support value addition, stronger market linkages, and more predictable income for producers.</p>
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
