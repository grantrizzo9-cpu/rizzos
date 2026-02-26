
'use client';

import { useState, useEffect, Suspense } from 'react';
import { getWebsiteForDomain, type SavedWebsite } from '@/lib/firestore';
import { HomePageClient } from '@/components/home-page-client';
import { Loader2 } from 'lucide-react';

export default function Page() {
    const [website, setWebsite] = useState<SavedWebsite | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkDomain = async () => {
            // This code now runs on the client, so window.location is available
            let domain = window.location.hostname.split(':')[0] || '';
            
            console.log(`[Client Domain Router] Detected host: ${domain}`);
            
            // Strip 'www.' from the beginning of the domain for lookup
            if (domain.startsWith('www.')) {
                domain = domain.substring(4);
            }
            
            // We check for localhost to ensure the marketing page works in local dev.
            if (domain === 'localhost' || domain.endsWith('.a.run.app')) {
                setLoading(false);
                return;
            }
            
            // getWebsiteForDomain uses localStorage, so it must run on the client.
            const site = await getWebsiteForDomain(domain);

            if (site && site.htmlContent) {
                console.log(`[Client Domain Router] Found website with theme '${site.themeName}' for domain: ${domain}`);
                setWebsite(site);
            } else {
                console.log(`[Client Domain Router] No website found for domain: ${domain}. Showing default marketing page.`);
            }

            setLoading(false);
        };

        checkDomain();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (website && website.htmlContent) {
        // If a website is found, serve its raw HTML content.
        return <div dangerouslySetInnerHTML={{ __html: website.htmlContent }} />;
    }

    // If no website is mapped, show the main marketing page, wrapped in Suspense.
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <HomePageClient />
        </Suspense>
    );
}
