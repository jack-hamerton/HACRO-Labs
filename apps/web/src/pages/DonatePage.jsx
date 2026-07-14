import { useState } from 'react';
import { ArrowRight, HeartHandshake, Phone, Mail, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';

const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('7') || digits.startsWith('1')) return `254${digits}`;
  return digits;
};

const DonatePage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    amount: '500',
    purpose: 'General support',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneNumber = normalizePhone(form.phoneNumber);
    const amount = Number(form.amount);

    if (!form.fullName || !form.email || !form.phoneNumber || !amount) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!/^254\d{9}$/.test(phoneNumber)) {
      toast.error('Enter a valid Kenyan phone number, for example 0712345678.');
      return;
    }

    if (amount < 1) {
      toast.error('Donation amount must be at least 1 KES.');
      return;
    }

    setLoading(true);

    try {
      const endpoints = ['/api/mpesa/stk-push', '/mpesa/stk-push'];
      let response;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber,
              amount,
              email: form.email,
              firstName: form.fullName.split(' ')[0] || form.fullName,
              lastName: form.fullName.split(' ').slice(1).join(' ') || 'Donor',
              purpose: form.purpose,
            }),
          });

          if (response.ok) {
            break;
          }

          lastError = await response.json().catch(() => ({ error: 'Unable to start donation payment.' }));
        } catch (error) {
          lastError = error;
        }
      }

      if (!response?.ok) {
        throw new Error(lastError?.error || 'Unable to start donation payment.');
      }

      const data = await response.json();
      toast.success('M-Pesa prompt sent to your phone. Please approve the donation.');
      setForm((prev) => ({ ...prev, phoneNumber: '' }));
      console.log('Donation STK push started:', data);
    } catch (error) {
      toast.error(error.message || 'Donation payment could not be started.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
                <HeartHandshake className="h-4 w-4" />
                Support HACRO Hub
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Help us grow community impact with your donation.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your contribution helps HACRO Hub expand outreach, training, savings support, and sustainable programs for the communities we serve.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">Why donate</p>
                  <p className="mt-2 font-semibold text-foreground">Fund outreach, education, and empowerment programs.</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">How it works</p>
                  <p className="mt-2 font-semibold text-foreground">We send an M-Pesa STK Push prompt to your phone for quick approval.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-foreground">Secure and simple</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your donation is processed through M-Pesa STK Push, which is fast, familiar, and secure for Kenyan supporters.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-foreground">Donate now</h2>
                <p className="text-sm text-muted-foreground">Fill in your details and approve the M-Pesa prompt on your phone.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Full name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 outline-none ring-0 focus:border-green-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 outline-none focus:border-green-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Phone number</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 outline-none focus:border-green-500"
                    placeholder="0712345678"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Amount (KES)</label>
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Purpose</label>
                  <select
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-green-500"
                  >
                    <option>General support</option>
                    <option>Community outreach</option>
                    <option>Training and mentorship</option>
                    <option>Member welfare</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending M-Pesa prompt...' : 'Donate via M-Pesa'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-sm text-muted-foreground">
                By donating, you consent to an M-Pesa STK Push prompt being sent to your phone number for approval.
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;

