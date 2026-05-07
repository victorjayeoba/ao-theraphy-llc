import React from 'react'

const Terms: React.FC = () => {
  return (

    <main className="min-h-screen bg-gray-50 py-12" aria-labelledby="terms-heading">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <header className="px-6 py-6 border-b">
            <h1 id="terms-heading" className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Terms and Conditions
            </h1>
            <p className="mt-1 text-sm text-gray-500">Last updated: November 29, 2025</p>
          </header>

          <article className="px-6 py-8 space-y-6">
            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">1. Acceptance of Terms</h2>
              <p>
                By accessing or using this website and its services, you agree to be bound by these Terms and any
                applicable laws and regulations. If you do not agree, do not use the site.
              </p>
            </section>

            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">2. Use of the Service</h2>
              <p>
                You agree to use the service only for lawful purposes and in a way that does not infringe the rights
                of, restrict or inhibit anyone else's use and enjoyment of the service.
              </p>
            </section>

            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">3. Accounts and Security</h2>
              <p>
                If you create an account, you are responsible for maintaining the confidentiality of your account
                information and for all activity that occurs under your account. Notify us immediately of any
                unauthorized use.
              </p>
            </section>

            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">4. Content and Intellectual Property</h2>
              <p>
                All content provided on the site is owned by or licensed to us. You may not copy, reproduce, or
                distribute content without permission. You retain ownership of content you submit but grant us a
                license to use it as described in our policies.
              </p>
            </section>

            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">5. Prohibited Conduct</h2>
              <p>
                You must not use the service to upload, post, transmit, or distribute any material that is unlawful,
                harmful, threatening, abusive, defamatory, or otherwise objectionable.
              </p>
            </section>

            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">6. Disclaimers and Limitation of Liability</h2>
              <p>
                The service is provided "as is" without warranties of any kind. To the maximum extent permitted by
                law, we are not liable for indirect, incidental, special, consequential, or punitive damages arising
                from your use of the service.
              </p>
            </section>

            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">7. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. When we do, we will update the "Last updated" date. Continued
                use after changes means you accept the new Terms.
              </p>
            </section>

            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">8. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the jurisdiction in which the company operates, unless
                otherwise required by local law.
              </p>
            </section>

            <section className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-lg font-semibold text-gray-800">9. Contact</h2>
              <p>
                For questions about these Terms, contact us at{' '}
                <a
                  className="text-indigo-600 hover:text-indigo-800 underline"
                  href="mailto:support@example.com"
                >
                  support@example.com
                </a>
                .
              </p>
            </section>
          </article>
        </div>
      </div>
    </main>
    
  )
}

export default Terms