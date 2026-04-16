import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <header className="container mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white text-lg">T</div>
          <span className="font-bold text-xl">TheraSecure</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Sign In</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Start Free Trial</Link>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-400">One plan. Everything you need. HIPAA compliant by default.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-2">Free Trial</h2>
            <p className="text-gray-400 mb-6">Try everything for 14 days</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-gray-400">/14 days</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Up to 10 patients',
                'Full encryption',
                'Scheduling & calendar',
                'Clinical notes',
                'Audit logging',
                'Email support',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full py-3 border border-gray-600 text-gray-300 text-center rounded-xl hover:bg-gray-800 transition-colors font-medium">
              Start Free Trial
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="glass-card p-8 relative border-blue-500/30 bg-gradient-to-b from-blue-500/5 to-transparent">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">HIPAA Compliant</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Professional</h2>
            <p className="text-gray-400 mb-6">Full practice management</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">$49</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited patients',
                'AES-256 encryption',
                'Smart scheduling',
                'Insurance billing',
                'Full audit logs & reports',
                'BAA included',
                'Priority support',
                'Data export (CSV/PDF)',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup?plan=pro" className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-center rounded-xl transition-colors font-medium">
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-20 glass-card p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-6">Your Data is Protected</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div>
              <div className="font-medium text-white mb-2">Encryption</div>
              <p>All patient data encrypted with AES-256 at rest and TLS 1.3 in transit. Even if breached, data is unreadable.</p>
            </div>
            <div>
              <div className="font-medium text-white mb-2">Access Controls</div>
              <p>Role-based access, MFA required, automatic session timeouts. Only you see your patients data.</p>
            </div>
            <div>
              <div className="font-medium text-white mb-2">Audit Trail</div>
              <p>Every data access, change, and export is logged with timestamps. Full HIPAA audit trail compliance.</p>
            </div>
            <div>
              <div className="font-medium text-white mb-2">Business Associate Agreement</div>
              <p>We sign a BAA with every professional plan. Your compliance requirements are our requirements.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}