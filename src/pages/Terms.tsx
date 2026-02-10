import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Terms of Use"
        description="Review the Terms of Use for Global Luxe Times. Understand your rights and responsibilities when using our luxury fashion editorial website."
        url="/terms"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: '/' },
        { name: 'Terms of Use', url: '/terms' },
      ]} />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs items={[{ label: "Terms of Use" }]} />

          <h1 className="font-serif text-5xl md:text-7xl mb-6">Terms of Use</h1>
          <p className="text-muted-foreground font-body mb-12">Last updated: November 2025</p>

          <div className="space-y-8 font-body leading-relaxed">
            <section>
              <h2 className="font-serif text-3xl mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Global Luxe Times (luxuryshopping.world), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our website or services.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Intellectual Property Rights</h2>
              <p className="text-muted-foreground mb-4">
                Unless otherwise indicated, Global Luxe Times owns or licenses all intellectual property rights in our website and content, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Editorial content, articles, and written materials</li>
                <li>Photographs, images, and visual content</li>
                <li>Website design, layout, and user interface</li>
                <li>Logos, trademarks, and brand elements</li>
                <li>Software and technical infrastructure</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You may view, download, and print pages from the website for your personal, non-commercial use, subject to the restrictions set out in these terms.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Acceptable Use</h2>
              <p className="text-muted-foreground mb-4">
                You agree not to use our website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>In any way that violates applicable laws or regulations</li>
                <li>To transmit any material that is defamatory, offensive, or obscene</li>
                <li>To impersonate any person or misrepresent your affiliation</li>
                <li>To interfere with or disrupt the website or servers</li>
                <li>To collect or harvest information about other users</li>
                <li>To transmit spam, chain letters, or unsolicited communications</li>
              </ul>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">User Contributions</h2>
              <p className="text-muted-foreground">
                If you submit comments, feedback, or other content to our website, you grant Global Luxe Times a perpetual, worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and publish such content. You represent that you own or control all rights in your contributions and that your content does not violate any third-party rights.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Third-Party Links</h2>
              <p className="text-muted-foreground">
                Our website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of third-party sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                Our website and content are provided "as is" without any representations or warranties, express or implied. Global Luxe Times makes no representations or warranties regarding the accuracy, completeness, or reliability of any content on the website.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, Global Luxe Times shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the website, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless Global Luxe Times and its affiliates from any claims, losses, damages, liabilities, and expenses arising out of your use of the website, your violation of these Terms, or your violation of any rights of another.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Modifications to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms of Use at any time. We will notify users of any material changes by posting the updated terms on this page with a new "Last Updated" date. Your continued use of the website after such changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with applicable international laws, without regard to conflict of law provisions.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Use, please contact us at:
                <br />
                <a href="mailto:contact@luxuryshopping.world" className="text-gold hover:underline">
                  contact@luxuryshopping.world
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
