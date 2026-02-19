import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container max-w-4xl py-12 md:py-24">
          <h1 className="font-headline text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-4">
            <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Affiliate AI Host (the "Site").</p>
            
            <h2 className="font-headline">Personal Information We Collect</h2>
            <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
            
            <h2 className="font-headline">How Do We Use Your Personal Information?</h2>
            <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
            
            <h2 className="font-headline">Sharing Your Personal Information</h2>
            <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Firebase for authentication and database services.</p>

            <h2 className="font-headline">Your Rights</h2>
            <p>If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted.</p>

            <h2 className="font-headline">Changes</h2>
            <p>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
