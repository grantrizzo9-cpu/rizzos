// This is a new server component that acts as a router
import { headers } from 'next/headers';
import { getWebsiteForDomain } from '@/lib/firestore';
import { HomePageClient } from '@/components/home-page-client';

export default async function Page() {
    const headersList = headers();
    // In a real environment, you might check x-forwarded-host as well.
    // For Firebase App Hosting, 'host' should be reliable.
    let domain = headersList.get('host')?.split(':')[0] || '';
    
    // Strip 'www.' from the beginning of the domain for lookup
    if (domain.startsWith('www.')) {
        domain = domain.substring(4);
    }
    
    // We check for localhost to ensure the marketing page works in local dev.
    if (domain === 'localhost') {
        return <HomePageClient />;
    }
    
    // For any other domain, we try to find a mapped website.
    const website = await getWebsiteForDomain(domain);

    if (website && website.htmlContent) {
        // If a website is found for the domain, serve its raw HTML content.
        return <div dangerouslySetInnerHTML={{ __html: website.htmlContent }} />;
    }

    // If no website is mapped to the domain, it's either the main marketing
    // site or an unconfigured custom domain. We'll show the main marketing page.
    return <HomePageClient />;
}
