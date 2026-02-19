import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container max-w-4xl py-12 md:py-24">
          <h1 className="font-headline text-4xl font-bold mb-8">Terms & Conditions</h1>
          <div className="prose prose-invert max-w-none space-y-4">
            <p>Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Affiliate AI Host website (the "Service") operated by Affiliate AI Host ("us", "we", or "our").</p>
            
            <h2 className="font-headline">Accounts</h2>
            <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            
            <h2 className="font-headline">Intellectual Property</h2>
            <p>The Service and its original content, features and functionality are and will remain the exclusive property of Affiliate AI Host and its licensors.</p>
            
            <h2 className="font-headline">Links To Other Web Sites</h2>
            <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by Affiliate AI Host. We have no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services.</p>

            <h2 className="font-headline">Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h2 className="font-headline">Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of Australia, without regard to its conflict of law provisions.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
