
import type { GenerateWebsiteJsonOutput } from '@/ai/flows/website-generator';
import type { Theme } from './data';

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
      { text: "Testimonials", href: "#testimonials"},
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
        .modal {
            display: none;
            position: fixed;
            z-index: 50;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.6);
            animation: fadeIn 0.3s;
        }
        .modal-content {
            background-color: hsl(var(--card));
            margin: 5% auto;
            padding: 2rem;
            border: 1px solid hsl(var(--border));
            width: 90%;
            max-width: 800px;
            border-radius: var(--radius);
            animation: slideIn 0.3s;
            position: relative;
        }
        .close-btn {
            color: hsl(var(--foreground));
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            font-size: 2rem;
            font-weight: bold;
            cursor: pointer;
        }
        @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
        @keyframes slideIn { from {transform: translateY(-50px);} to {transform: translateY(0);} }
        .prose { color: hsl(var(--foreground) / 0.8); }
        .prose h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; margin-top: 2rem; color: hsl(var(--foreground)); }
    </style>
</head>
<body class="antialiased">

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
                <h2 class="text-3xl font-bold mb-12">How It Works</h2>
                <div class="grid md:grid-cols-3 gap-8">
                     ${homepage.howItWorksSteps.map((step, index) => `
                        <div class="flex flex-col items-center">
                            <div class="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">${index + 1}</div>
                            <h3 class="text-lg font-semibold mb-2">${step.title}</h3>
                            <p class="opacity-70">${step.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section id="testimonials" class="py-20 bg-card">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    ${homepage.testimonials.map(testimonial => `
                        <div class="bg-background p-6 rounded-lg border border-border">
                            <p class="italic mb-4">"${testimonial.text}"</p>
                            <div class="font-semibold">${testimonial.name}</div>
                            <div class="text-sm opacity-70">${testimonial.role}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="py-20">
            <div class="container mx-auto px-4 max-w-3xl">
                <h2 class="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    ${homepage.faqs.map(faq => `
                        <div>
                            <details class="group bg-card p-4 rounded-lg cursor-pointer border border-border">
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
                <a href="#" class="hover:text-primary" onclick="event.preventDefault(); openModal('termsModal')">Terms</a>
                <a href="#" class="hover:text-primary" onclick="event.preventDefault(); openModal('privacyModal')">Privacy</a>
                <a href="#" class="hover:text-primary" onclick="event.preventDefault(); openModal('disclaimerModal')">Disclaimer</a>
            </div>
        </div>
    </footer>

    <!-- Modals -->
    <div id="termsModal" class="modal"><div class="modal-content"><span class="close-btn" onclick="closeModal('termsModal')">&times;</span><div class="prose"><h2>Terms & Conditions</h2><p>${legal.terms.replace(/\n/g, '<br />')}</p></div></div></div>
    <div id="privacyModal" class="modal"><div class="modal-content"><span class="close-btn" onclick="closeModal('privacyModal')">&times;</span><div class="prose"><h2>Privacy Policy</h2><p>${legal.privacy.replace(/\n/g, '<br />')}</p></div></div></div>
    <div id="disclaimerModal" class="modal"><div class="modal-content"><span class="close-btn" onclick="closeModal('disclaimerModal')">&times;</span><div class="prose"><h2>Disclaimer</h2><p>${legal.disclaimer.replace(/\n/g, '<br />')}</p></div></div></div>

    <script>
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }
    </script>
</body>
</html>
  `;
}
