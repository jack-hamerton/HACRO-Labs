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
      'By creating an account and using HACRO Hub, you agree to these Terms & Conditions and to the automated operational rules used by the platform.',
      'You understand that the system may create savings records, notifications, loan decisions, account updates, and payout requests automatically based on your actions and the platform rules.',
    ],
  },
  {
    title: '2. Membership, accounts, and fees',
    points: [
      'Members are responsible for providing accurate personal details, contact information, and financial information during registration and whenever their details change.',
      'A one-time registration fee of KES 50 and a membership fee of KES 500 may apply as shown during registration or account setup, and these fees may be processed through the platform as applicable.',
      'The platform may also collect monthly insurance and maintenance fees through the payment flow, and completed insurance payments are recorded as company fee transactions and member activity history.',
      'On registration, the system creates an initial savings record and a welcome notification to help members begin using the cooperative services.',
    ],
  },
  {
    title: '3. Savings, contributions, and eligibility',
    points: [
      'Savings contributions increase your recorded balance and are logged in your contribution history, and the platform may notify you when your savings reach loan eligibility thresholds.',
      'Every successful savings contribution is added to the memberâ€s savings balance, creates a contribution-history entry, and may unlock loan eligibility once the configured threshold is reached.',
      'Members are automatically assigned to a group based on available profile details and location, and groups may be created or updated by the system when new members join.',
      'Group membership is used to support shared accountability, loan eligibility, communication, and the distribution of group-based benefits where applicable.',
    ],
  },
  {
    title: '4. Loan requests, review, and repayment rules',
    points: [
      'Individual Loans (IL) require a minimum period of membership before they may be approved, and eligibility is further assessed using available savings and earned bonuses.',
      'IL applications are submitted for admin review, and the system may calculate a projected repayment total from the requested principal and the configured interest rate. In the current implementation, IL loans use a 2% rate unless an administrator sets a different rate on the loan record.',
      'Group Individual Loans (GIL) require a group context and a guarantor process, and the system may notify the borrower and group members when a GIL application is submitted and requires support.',
      'Loan requests do not proceed to disbursement until they are reviewed and approved by an administrator; approved loans are then marked active and may trigger an M-Pesa payout to the memberâ€s registered phone number.',
    ],
  },
  {
    title: '5. Guarantors, collateral, and review',
    points: [
      'Guarantors may be invited to support a GIL loan, but each guarantor must have a savings record and must offer collateral that does not exceed their available savings.',
      'Collateral commitments are recorded as pending acknowledgment and may be deducted from a guarantorâ€s savings once acknowledged, and the amount is returned when the loan is fully repaid.',
      'When all required collateral and borrower savings are sufficient, the loan may move to the review or disbursement stage for administrative approval.',
    ],
  },
  {
    title: '6. Repayments, defaults, and penalties',
    points: [
      'Loan balances are updated when repayments are received, and full repayment may cause the loan to be marked as repaid and the collateral to be returned for GIL loans.',
      'If a repayment is late, the platform may calculate and apply a penalty based on the overdue period, and repeated penalties may trigger additional warnings to the member.',
      'Penalty amounts may increase the loan balance and are recorded alongside the relevant payment and loan history.',
      'If a loan remains unpaid for an extended period, the platform may initiate recovery actions that can include deductions from a memberâ€s savings, group-interest penalties, or other account-based measures as defined by the cooperative rules.',
    ],
  },
  {
    title: '7. Fraud detection and payment protection',
    points: [
      'Payments are monitored for unusual behaviour such as a high number of payments within a short period, payments much larger than a memberâ€s usual pattern, rapid repeated payments, suspicious round-number amounts, and payments sent at unusual hours.',
      'When the system detects an anomaly, it creates a fraud alert record, flags the payment for review, and sends alerts to administrators and the affected member so the payment can be checked before it is treated as normal activity.',
      'These checks do not stop a valid payment automatically in every case; they are designed to protect the cooperative by drawing attention to unusual activity for review.',
    ],
  },
  {
    title: '8. Interest, bonuses, and member benefits',
    points: [
      'The platform may calculate interest on a loan using the configured interest rate for that loan. In the current setup, IL loans use a 2% rate and GIL loans use a 1% rate unless an administrator changes the rate on the loan record.',
      'Interest is not posted at the moment of disbursement. For GIL loans, the platform distributes the applicable interest only after the loan has been fully repaid, and the distribution follows the internal rule of 50% to the cooperative, 25% to group members, and 25% to guarantors.',
      'Bonuses and interest distributions are recorded in the memberâ€s contribution history and may be reflected in savings balances and account activity once the relevant automation has completed.',
    ],
  },
  {
    title: '9. Insurance, maintenance fees, and deductions',
    points: [
      'Completed insurance payments are treated as monthly insurance and maintenance fee collections. The system records them as company-fee transactions, creates a contribution-history entry, and sends the member a confirmation notification.',
      'These fee collections are designed to support the cooperativeâ€s operating costs and to keep the account activity auditable. The fee is recorded against the memberâ€s payment activity and is not treated as a savings contribution.',
      'The platform may also create penalty and recovery entries when a loan or account is overdue or defaulted, and those entries can reduce available balances or add charges to the relevant loan record.',
    ],
  },
  {
    title: '10. Annual savings withdrawal cycle (85/15 policy)',
    points: [
      'Members are eligible to withdraw 85% of their accumulated savings after every 12 months of continuous savings contributions, calculated from their first contribution date or the date of their last 85% withdrawal.',
      'Upon reaching the 12-month milestone, members may request a withdrawal, and the system will automatically calculate and process 85% of their total savings for withdrawal to their designated account or via M-Pesa.',
      'The remaining 15% of the memberâ€s savings is automatically carried forward as the starting balance for the next 12-month savings cycle, ensuring continuous savings accumulation and financial discipline.',
      'Withdrawal requests are subject to verification and must comply with platform rules; members cannot withdraw more than the 85% allocation or withdraw before the 12-month period elapses.',
      'Once a withdrawal is approved, the system records the processed amount, carries forward the remaining 15%, and may send a payout request to the memberâ€s registered M-Pesa number for settlement.',
    ],
  },
  {
    title: '11. Communications, alerts, and admin actions',
    points: [
      'The platform sends notifications for approvals, rejections, repayments, group messages, disbursements, penalties, insurance payments, withdrawals, and important account actions.',
      'Group messages and announcements may be broadcast to the relevant group, and important announcements may be forwarded more widely to the system membership.',
      'Administrators may reject loans, suspend or reactivate accounts, or deactivate groups when necessary, and the platform will issue notifications to affected members.',
    ],
  },
  {
    title: '12. Final notice',
    points: [
      'These terms may be updated as the platform evolves, and continued use of the service means you accept the current version of the rules.',
      'By joining HACRO Hub, you agree to participate with honesty, respect the cooperative process, and understand that the platformâ€s automation is part of the service you are using.',
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

              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-gray-900 shadow-sm">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm text-gray-900">
                  <Sparkles className="h-4 w-4 text-green-700" />
                  Why members love it
                </div>
                <h2 className="text-2xl font-semibold">What this pillar delivers</h2>
                <div className="mt-6 space-y-4">
                  {pillars.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-green-400 hover:bg-green-50 hover:shadow-lg cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-green-50 p-2 text-green-700">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="mt-1 text-sm leading-7 text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <section id="terms" className="mt-14 rounded-[2rem] border border-gray-200 bg-gray-50 p-8 shadow-sm sm:p-10">
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
                <div key={section.title} className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-green-400 hover:bg-green-50 hover:shadow-lg cursor-pointer">
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

