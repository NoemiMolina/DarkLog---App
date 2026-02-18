import Header from "../../components/HeaderComponents/Header";

const PrivacyPage = () => {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1
          className="text-4xl font-bold text-white mb-8"
          style={{ fontFamily: "'Metal Mania', serif" }}
        >
          Privacy Policy
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-300 mb-4">
              We collect information you provide directly to us, such as when
              you create an account, including:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-4 space-y-2">
              <li>Name and email address</li>
              <li>Profile information and preferences</li>
              <li>Watchlist and rating data</li>
              <li>Forum posts and comments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-4 space-y-2">
              <li>Provide and improve our services</li>
              <li>Personalize your experience</li>
              <li>Send you updates and notifications</li>
              <li>Respond to your inquiries</li>
              <li>Maintain security and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Information Sharing
            </h2>
            <p className="text-gray-300 mb-4">
              We do not sell, trade, or share your personal information with
              third parties, except as required by law or to provide services
              you've requested.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-300 mb-4">
              You have the right to access, update, or delete your personal
              information. To exercise these rights, please contact us through
              our contact form.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-300 mb-4">
              If you have questions about this Privacy Policy, please contact us
              through the contact form on our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPage;
