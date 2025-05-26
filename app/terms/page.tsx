export default function TermsPage() {
  return (
    <section className="min-h-[80vh] bg-neutral-50 dark:bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <main className="py-12 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Pamoja Events platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">2. Use of the Platform</h2>
            <p>
              You agree to use the platform only for lawful purposes and in accordance with all applicable laws and regulations. You are responsible for your activity and content shared on the platform.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
            <p>
              All content, trademarks, and data on this platform, including but not limited to software, databases, text, graphics, icons, and hyperlinks are the property of Pamoja Events or its licensors.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
            <p>
              Pamoja Events is not liable for any damages or losses resulting from your use of the platform. The platform is provided "as is" without warranties of any kind.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
            <p>
              For questions about these Terms, please contact us at support@pamoja.events.
            </p>
          </section>
        </main>
      </div>
    </section>
  );
}
