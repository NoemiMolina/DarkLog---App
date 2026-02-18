import Header from "../../components/HeaderComponents/Header";

const TermsPage = () => {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1
          className="text-4xl font-bold text-white mb-8"
          style={{ fontFamily: "'Metal Mania', serif" }}
        >
          Terms of Service
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-300 mb-4">
              By accessing and using FearLog, you accept and agree to be bound
              by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Use License
            </h2>
            <p className="text-gray-300 mb-4">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on FearLog for personal,
              non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may
              not:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-4 space-y-2">
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                Attempt to decompile or reverse engineer any software on FearLog
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
              <li>
                Transfer the materials to another person or "mirror" the
                materials on any other server
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Disclaimer
            </h2>
            <p className="text-gray-300 mb-4">
              The materials on FearLog are provided "as is". FearLog makes no
              warranties, expressed or implied, and hereby disclaims and negates
              all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Limitations
            </h2>
            <p className="text-gray-300 mb-4">
              In no event shall FearLog or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on FearLog.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="text-gray-300 mb-4">
              The materials appearing on FearLog could include technical,
              typographical, or photographic errors. FearLog does not warrant
              that any of the materials on its website are accurate, complete,
              or current.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Materials on FearLog
            </h2>
            <p className="text-gray-300 mb-4">
              FearLog has not reviewed all of the material (including
              information and data) available through its website and is not
              responsible for the content of any off-site pages or any other
              materials linked to or from any of its web pages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. User Conduct
            </h2>
            <p className="text-gray-300 mb-4">
              You agree to comply with all laws, rules, and regulations
              applicable to your use of FearLog. You agree not to use FearLog:
            </p>
            <ul className="text-gray-300 list-disc list-inside mb-4 space-y-2">
              <li>In any way that violates any applicable law or regulation</li>
              <li>
                To transmit any harassing, abusive, defamatory, obscene, or
                otherwise objectionable material
              </li>
              <li>
                To impersonate or attempt to impersonate any person or entity
              </li>
              <li>To upload viruses or malicious code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Modifications
            </h2>
            <p className="text-gray-300 mb-4">
              FearLog may revise these terms of service for its website at any
              time without notice. By using this website, you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Governing Law
            </h2>
            <p className="text-gray-300 mb-4">
              These terms and conditions are governed by and construed in
              accordance with the laws of the jurisdiction in which FearLog
              operates, and you irrevocably submit to the exclusive jurisdiction
              of the courts in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please
              contact us through the contact form on our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsPage;
