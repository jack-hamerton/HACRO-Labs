import { ArrowLeft, ShieldCheck, Landmark, Smartphone, Sparkles, CheckCircle2, HeartHandshake, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const pillars = [
  {
    title: 'Transparent savings circles',
    description: 'Every contribution, loan decision, and balance update is logged clearly so members can trust the process and follow their progress in real time.',
    icon: Landmark,
  },
  {
    title: 'Peer-to-peer community savings',
    description: 'Members can pool funds, approve requests, and manage shared goals with confidence through a secure digital cooperative experience.',
    icon: HeartHandshake,
  },
  {
    title: 'Accessible digital tools',
    description: 'From payments to loans and communication, the platform removes friction and gives members simple, mobile-friendly tools to thrive.',
    icon: Smartphone,
  },
];

const benefits = [
  'Build savings with clarity and confidence',
  'Access fair credit through trusted community structures',
  'Stay informed with real-time updates and transparent records',
  'Strengthen dignity, inclusion, and accountability every step of the way',
];

const termsSections = [
  {
    title: '1. Acceptance of the cooperative agreement',
    points: [
      'By creating an account and using HACRO Labs, you agree to these Terms & Conditions and to the automated operational rules used by the platform.',
      'You understand that the system may create savings records, notifications, loan decisions, and account updates automatically based on your actions and the platform rules.',
    ],
  },
  {
    title: '2. Membership, accounts, and fees',
    points: [
      'Members are responsible for providing accurate personal details, contact information, and financial information during registration and whenever their details change.',
      'A one-time registration fee of KES 50 and a membership fee of KES 500 may apply as shown during registration or account setup, and these fees may be processed through the platform as applicable.',
      'On registration, the system creates an initial savings record and a welcome notification to help members begin using the cooperative services.',
    ],
  },
  {
    title: '3. Savings, groups, and eligibility',
    points: [
      'Savings contributions increase your recorded balance and are logged in your contribution history, and the platform may notify you when your savings reach loan eligibility thresholds.',
      'Members are automatically assigned to a group based on available profile details and location, and groups may be created or updated by the system when new members join.',
      'Group membership is used to support shared accountability, loan eligibility, communication, and the distribution of group-based benefits where applicable.',
    ],
  },
  {
    title: '4. Loan products and approval rules',
    points: [
      'Individual Loans (IL) require a minimum period of membership before they may be approved, and eligibility is further assessed using available savings and earned bonuses.',
      'IL applications may be auto-approved when they meet the platform’s collateral and eligibility rules, and the system may apply a 2% flat interest rate with a 2-month repayment period and a 1-month grace period.',
      'Group Individual Loans (GIL) require a group context and a guarantor process, and the system may notify the borrower and group members when a GIL application is submitted and requires support.',
    ],
  },
  {
    title: '5. Guarantors, collateral, and review',
    points: [
      'Guarantors may be invited to support a GIL loan, but each guarantor must have a savings record and must offer collateral that does not exceed their available savings.',
      'Collateral commitments are recorded as pending acknowledgment and may be deducted from a guarantor’s savings once acknowledged, and the amount is returned when the loan is fully repaid.',
      'When all required collateral and borrower savings are sufficient, the loan may move to the review or disbursement stage for administrative approval.',
    ],
  },
  {
    title: '6. Repayments, defaults, and penalties',
    points: [
      'Loan balances are updated when repayments are received, and full repayment may cause the loan to be marked as repaid and the collateral to be returned for GIL loans.',
      'If a repayment is late, the platform may calculate and apply a penalty based on the overdue period, and repeated penalties may trigger additional warnings to the member.',
      'Penalty amounts may increase the loan balance and are recorded alongside the relevant payment and loan history.',
    ],
  },
  {
    title: '7. Disbursement, interest, and member benefits',
    points: [
      'When a loan is disbursed, the platform records the disbursement, issues notifications to the member and relevant group members, and updates the loan status to active.',
      'For GIL loans, a portion of the interest may be allocated to the company, a portion may be distributed to group members, and another portion may be distributed to guarantors according to the platform’s internal rules.',
      'All such distributions are logged in the member’s history and may be reflected in savings or account activity.',
    ],
  },
  {
    title: '8. Communications, alerts, and security monitoring',
    points: [
      'The platform sends notifications for approvals, rejections, repayments, group messages, disbursements, penalties, insurance payments, and important account actions.',
      'Group messages and announcements may be broadcast to the relevant group, and important announcements may be forwarded more widely to the system membership.',
      'Payments may be reviewed for unusual patterns or suspicious activity, and the platform may create alerts for review by administrators and notify members where appropriate.',
    ],
  },
  {
    title: '9. Admin actions and account status',
    points: [
      'Administrators may reject loans, suspend or reactivate accounts, or deactivate groups when necessary, and the platform will issue notifications to affected members.',
      'Members are expected to respond to account changes, review notifications, and remain in contact with the cooperative if any issues arise.',
    ],
  },
  {
    title: '10. Final notice',
    points: [
      'These terms may be updated as the platform evolves, and continued use of the service means you accept the current version of the rules.',
      'By joining HACRO Labs, you agree to participate with honesty, respect the cooperative process, and understand that the platform’s automation is part of the service you are using.',
    ],
  },
];

export default function CommunityFinancialEmpowermentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 text-gray-900">
      <Header />

      <main className="pt-24 pb-20">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-[0_20px_80px_-24px_rgba(16,185,129,0.35)]">
            <div className="grid gap-12 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700">
                  <ShieldCheck className="h-4 w-4" />
                  Community Financial Empowerment Protection
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  A safer, smarter way to grow together.
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  We are digitizing the chama spirit to build a confidence-first safety net for every member. From savings to loans and accountability, our platform supports communities with clarity, dignity, and real impact.
                </p>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Members can save responsibly, borrow fairly, and build strong financial habits without losing the human trust that makes community finance work.
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

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {benefits.map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-xl bg-green-50/70 p-3 text-sm text-gray-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-600 to-emerald-500 p-8 text-white shadow-lg">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
                  <Sparkles className="h-4 w-4" />
                  Why members love it
                </div>
                <h2 className="text-2xl font-semibold">What this pillar delivers</h2>
                <div className="mt-6 space-y-4">
                  {pillars.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-white/15 p-2">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="mt-1 text-sm leading-7 text-green-50/90">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <section id="terms" className="mt-14 rounded-[2rem] border border-green-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-green-700">Terms & Conditions</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">Read the agreement clearly before joining</h2>
                <p className="mt-2 max-w-2xl text-gray-600">These terms explain how savings, loans, penalties, and member responsibilities are handled on the platform.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                <BadgeCheck className="h-4 w-4" />
                Effective June 14, 2026
              </div>
            </div>

            <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
              {termsSections.map((section) => (
                <div key={section.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {section.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
