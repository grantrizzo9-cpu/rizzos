
import type { GenerateWebsiteJsonOutput } from '@/ai/flows/website-generator';
import type { Theme } from './data';

function generateLegalPage(
    pageId: string,
    title: string,
    content: string,
    siteTitle: string,
    affiliateLink: string,
    ctaButtonText: string
): string {
  return `
    <div id="${pageId}" class="page" style="display: none;">
        <header class="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div class="container mx-auto flex h-16 items-center justify-between px-4">
                <a href="#" onclick="event.preventDefault(); showPage('page-main')" class="font-bold text-xl">${siteTitle}</a>
                <a href="#" onclick="event.preventDefault(); showPage('page-main')" class="text-sm font-medium hover:text-primary transition-colors">Back to Home</a>
            </div>
        </header>
        <main class="py-12 md:py-20">
            <div class="container mx-auto px-4 max-w-4xl">
                <div class="prose">
                    <h1>${title}</h1>
                    <p>${content.replace(/\n/g, '<br />')}</p>
                </div>
            </div>
        </main>
        <section class="py-12 bg-primary text-primary-foreground text-center">
            <div class="container mx-auto px-4">
                 <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                 <p class="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Join today and start building your income stream.</p>
                 <a href="${affiliateLink}" class="btn bg-background text-primary-foreground hover:opacity-90 text-lg">${ctaButtonText}</a>
            </div>
        </section>
        <footer class="border-t border-border">
            <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-sm opacity-70">&copy; ${new Date().getFullYear()} ${siteTitle}. All rights reserved.</p>
                 <a href="#" class="text-sm hover:text-primary" onclick="event.preventDefault(); showPage('page-main')">Back to Home</a>
            </div>
        </footer>
    </div>
  `;
}


export function generateHtmlForWebsite(
  data: GenerateWebsiteJsonOutput,
  theme: Theme,
  username: string
): string {
  const { homepage, legal } = data;
  const affiliateLink = `https://hostproai.com/?ref=${username}`;

  const themeStyles = Object.entries(theme.colors)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  const navLinks = [
      { text: "Features", href: "#features"},
      { text: "How It Works", href: "#how-it-works"},
      { text: "Commission", href: "#commission"},
      { text: "FAQ", href: "#faq"},
  ];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${homepage.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
            ${themeStyles}
            --radius: 0.5rem;
        }
        body { 
            font-family: 'Inter', sans-serif; 
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            scroll-behavior: smooth;
        }
        .bg-primary { background-color: hsl(var(--primary)); }
        .text-primary { color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .border-accent { border-color: hsl(var(--accent)); }
        .border-border { border-color: hsl(var(--border)); }
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius);
            font-weight: 600;
            text-decoration: none;
            transition: opacity 0.2s;
        }
        .btn:hover { opacity: 0.9; }
        .btn-primary {
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
        }
        .prose { color: hsl(var(--foreground) / 0.8); }
        .prose h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 2rem; color: hsl(var(--foreground)); }
        .prose h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; margin-top: 2rem; color: hsl(var(--foreground)); }
        .page { display: none; }
    </style>
</head>
<body class="antialiased">

    <div id="page-main" class="page" style="display: block;">
        <!-- Header -->
        <header class="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div class="container mx-auto flex h-16 items-center justify-between px-4">
                <a href="#" class="font-bold text-xl">${homepage.title}</a>
                <nav class="hidden md:flex items-center gap-6">
                    ${navLinks.map(link => `<a href="${link.href}" class="text-sm font-medium hover:text-primary transition-colors">${link.text}</a>`).join('')}
                </nav>
                <a href="${affiliateLink}" class="btn btn-primary hidden md:inline-block">${homepage.ctaButtonText}</a>
            </div>
        </header>

        <main>
            <!-- Hero Section -->
            <section id="hero" class="py-20 text-center">
                <div class="container mx-auto px-4">
                    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">${homepage.headline}</h1>
                    <p class="text-lg md:text-xl max-w-3xl mx-auto opacity-80 mb-8">${homepage.subheadline}</p>
                    <a href="${affiliateLink}" class="btn btn-primary text-lg">${homepage.ctaButtonText}</a>
                </div>
            </section>

            <!-- Features Section -->
            <section id="features" class="py-20 bg-card">
                <div class="container mx-auto px-4">
                    <div class="grid md:grid-cols-3 gap-8">
                        ${homepage.features.map(feature => `
                            <div class="text-center">
                                <div class="text-4xl mb-4">${feature.iconEmoji}</div>
                                <h3 class="text-xl font-bold mb-2">${feature.title}</h3>
                                <p class="opacity-70">${feature.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- How It Works Section -->
            <section id="how-it-works" class="py-20">
                <div class="container mx-auto px-4 text-center">
                    <h2 class="text-3xl font-bold mb-4">Your Simple Path to Profit</h2>
                    <p class="text-lg md:text-xl max-w-3xl mx-auto opacity-80 mb-12">Our model is designed for transparency and to get you into profit as quickly as possible. Here’s the step-by-step breakdown:</p>
                    <div class="grid md:grid-cols-3 gap-8 text-left">
                        <div class="bg-card p-6 rounded-lg border border-border">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
                                <h3 class="text-lg font-semibold">Activate & Start Your Trial</h3>
                            </div>
                            <p class="opacity-80 text-sm">To begin, you pay a one-time activation fee for your chosen plan. This initial fee goes directly to the platform owner to support server maintenance, ongoing development, and customer support, ensuring the longevity and quality of the service for everyone. Upon activation, your 3-day, full-featured free trial begins immediately.</p>
                        </div>
                        <div class="bg-card p-6 rounded-lg border border-border">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
                                <h3 class="text-lg font-semibold">Refer Two & Enter Profit Mode</h3>
                            </div>
                            <p class="opacity-80 text-sm">Your primary goal is to refer just two other members on the same plan. The platform's 30% share from their daily payments is designed to completely cover the cost of your own daily plan fee. This means that with only two referrals, you are effectively in profit mode. Even if you achieve this within your 3-day trial, you'll start earning profit from day four.</p>
                        </div>
                        <div class="bg-card p-6 rounded-lg border border-border">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
                                <h3 class="text-lg font-semibold">Earn Daily, Paid to PayPal</h3>
                            </div>
                            <p class="opacity-80 text-sm">Every referral after your first two is pure profit, paid out daily. All recurring commissions you earn are calculated every 24 hours and sent directly to your registered PayPal account. Your affiliate business funds itself, and your profits are available as daily cash flow.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Commission Structure Section -->
            <section id="commission" class="py-20 bg-card">
                <div class="container mx-auto px-4 text-center">
                    <h2 class="text-3xl font-bold mb-4">The Most Lucrative Commission in the Industry</h2>
                    <p class="text-lg md:text-xl max-w-3xl mx-auto opacity-80 mb-12">Our entire model is built to make you profitable. We pay more, and we pay faster than anyone else. Here’s exactly how you earn.</p>
                    <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div class="bg-background p-8 rounded-lg border border-border text-left">
                            <div class="text-5xl font-extrabold text-primary mb-4">70-75%</div>
                            <h3 class="text-xl font-bold mb-2">Recurring Daily Commissions</h3>
                            <p class="opacity-70">You start at an industry-leading 70% recurring daily commission. After just 10 referrals, you’re automatically bumped to 75% for life. You earn this on every payment, from every referral, every single day.</p>
                        </div>
                        <div class="bg-background p-8 rounded-lg border border-border text-left">
                            <div class="text-5xl font-extrabold text-primary mb-4">24hrs</div>
                            <h3 class="text-xl font-bold mb-2">To Your PayPal Account</h3>
                            <p class="opacity-70">Stop waiting 30-90 days for your money. We process payouts every 24 hours. The money you earn today is in your PayPal account tomorrow, ready to be reinvested or spent. This is true cash flow velocity.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Testimonials Section -->
            <section id="testimonials" class="py-20">
                <div class="container mx-auto px-4">
                    <h2 class="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
                    <div class="grid md:grid-cols-3 gap-8">
                        ${homepage.testimonials.map(testimonial => `
                            <div class="bg-card p-6 rounded-lg border border-border">
                                <p class="italic mb-4">"${testimonial.text}"</p>
                                <div class="font-semibold">${testimonial.name}</div>
                                <div class="text-sm opacity-70">${testimonial.role}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- FAQ Section -->
            <section id="faq" class="py-20 bg-card">
                <div class="container mx-auto px-4 max-w-3xl">
                    <h2 class="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <div class="space-y-4">
                        ${homepage.faqs.map(faq => `
                            <div>
                                <details class="group bg-background p-4 rounded-lg cursor-pointer border border-border">
                                    <summary class="font-semibold flex justify-between items-center">
                                        ${faq.question}
                                        <span class="transform group-open:rotate-45 transition-transform">+</span>
                                    </summary>
                                    <p class="mt-2 opacity-80 pt-2 border-t border-border">${faq.answer}</p>
                                </details>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- Final CTA Section -->
            <section id="cta-final" class="py-20 bg-primary text-primary-foreground text-center">
                <div class="container mx-auto px-4">
                     <h2 class="text-3xl font-bold mb-4">${homepage.finalCta.headline}</h2>
                     <p class="text-lg opacity-90 mb-8 max-w-2xl mx-auto">${homepage.finalCta.subheadline}</p>
                     <a href="${affiliateLink}" class="btn bg-background text-primary-foreground hover:opacity-90 text-lg">${homepage.finalCta.buttonText}</a>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="border-t border-border">
            <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-sm opacity-70">&copy; ${new Date().getFullYear()} ${homepage.title}. All rights reserved.</p>
                <div class="flex gap-4 text-sm">
                    <a href="#" class="hover:text-primary" onclick="event.preventDefault(); showPage('page-terms')">Terms & Conditions</a>
                    <a href="#" class="hover:text-primary" onclick="event.preventDefault(); showPage('page-privacy')">Privacy Policy</a>
                    <a href="#" class="hover:text-primary" onclick="event.preventDefault(); showPage('page-disclaimer')">Earnings Disclaimer</a>
                </div>
            </div>
        </footer>
    </div>

    <!-- Legal Pages -->
    ${generateLegalPage('page-terms', 'Terms & Conditions', legal.terms, homepage.title, affiliateLink, homepage.ctaButtonText)}
    ${generateLegalPage('page-privacy', 'Privacy Policy', legal.privacy, homepage.title, affiliateLink, homepage.ctaButtonText)}
    ${generateLegalPage('page-disclaimer', 'Earnings Disclaimer', legal.disclaimer, homepage.title, affiliateLink, homepage.ctaButtonText)}
    
    <script>
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(function(page) {
                page.style.display = 'none';
            });
            document.getElementById(pageId).style.display = 'block';
            window.scrollTo(0, 0);
        }
    </script>
</body>
</html>
`;
}
