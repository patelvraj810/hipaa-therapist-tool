import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Nav */}
      <header className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white text-lg">T</div>
          <div>
            <span className="font-bold text-xl text-white">TheraSecure</span>
            <span className="hipaa-badge ml-2">HIPAA Compliant</span>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Sign In</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Start Free Trial</Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="hipaa-badge mx-auto mb-6 w-fit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            256-bit AES Encryption · SOC 2 Compliant
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Secure Practice</span><br />
            Management for<br />Solo Therapists
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Encrypted patient records, intelligent scheduling, and streamlined billing — everything you need to run your practice, fully HIPAA compliant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-semibold text-lg">
              Start 14-Day Free Trial
            </Link>
            <Link href="/pricing" className="px-8 py-4 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 rounded-xl transition-colors font-medium text-lg">
              View Pricing
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              {
                icon: '🔒',
                title: 'Encrypted Records',
                desc: 'AES-256 encrypted patient notes, history, and documents. Zero-knowledge architecture.',
              },
              {
                icon: '📅',
                title: 'Smart Scheduling',
                desc: 'Conflict detection, automated reminders, and flexible session types.',
              },
              {
                icon: '💳',
                title: 'Integrated Billing',
                desc: 'Stripe payments, insurance claim tracking, and automatic invoicing.',
              },
              {
                icon: '📋',
                title: 'Audit Logging',
                desc: 'Complete access logs, data change tracking, and HIPAA compliance reports.',
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-6 text-left">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* HIPAA Compliance Section */}
          <div className="mt-24 glass-card p-10 text-left">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">HIPAA Compliance Built In</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-green-400 font-semibold mb-2">Technical Safeguards</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ AES-256 encryption at rest</li>
                  <li>✓ TLS 1.3 encryption in transit</li>
                  <li>✓ Multi-factor authentication</li>
                  <li>✓ Automatic session timeout</li>
                  <li>✓ Role-based access control</li>
                </ul>
              </div>
              <div>
                <div className="text-blue-400 font-semibold mb-2">Administrative Safeguards</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Comprehensive audit logging</li>
                  <li>✓ Access tracking & alerts</li>
                  <li>✓ Business Associate Agreement</li>
                  <li>✓ Staff training documentation</li>
                  <li>✓ Incident response procedures</li>
                </ul>
              </div>
              <div>
                <div className="text-violet-400 font-semibold mb-2">Physical Safeguards</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Secure cloud hosting</li>
                  <li>✓ Regular security audits</li>
                  <li>✓ Automated backups</li>
                  <li>✓ Disaster recovery plan</li>
                  <li>✓ Data center certifications</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { value: '500+', label: 'Solo Therapists' },
              { value: '50,000+', label: 'Encrypted Records' },
              { value: '99.9%', label: 'Uptime SLA' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm">T</div>
            <span className="font-semibold text-white">TheraSecure</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TheraSecure. All rights reserved. HIPAA compliant.</p>
        </div>
      </footer>
    </div>
  );
}