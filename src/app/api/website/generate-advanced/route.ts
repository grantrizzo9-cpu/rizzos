import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      websiteName,
      colorScheme,
      wordCount,
      emailCaptureEnabled,
      affiliateEnabled,
    } = await request.json();

    if (!websiteName || !colorScheme || !wordCount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Call Gemini to generate unique content
    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY || '',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a unique, professional website article of approximately ${wordCount} words about "${websiteName}". 
                  
Requirements:
- Make it original and unique (not generic)
- Professional tone suitable for an affiliate marketing website
- Include natural sections with headers
- Include practical tips and insights
- Make it compelling and engaging
- Avoid repetition

Format as JSON with this structure:
{
  "title": "Article title",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Section content"
    }
  ]
}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error('Failed to generate content from Gemini');
    }

    const geminiData = await geminiResponse.json();
    const contentText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!contentText) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    let contentData;
    try {
      const jsonMatch = contentText.match(/\{[\s\S]*\}/);
      contentData = JSON.parse(jsonMatch ? jsonMatch[0] : contentText);
    } catch {
      contentData = {
        title: websiteName,
        sections: [{ heading: 'Content', content: contentText }],
      };
    }

    // Generate HTML with all components
    const htmlContent = generateWebsiteHTML({
      websiteName: contentData.title || websiteName,
      sections: contentData.sections || [],
      colorScheme,
      emailCaptureEnabled,
      affiliateEnabled,
    });

    return NextResponse.json(
      { htmlContent, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating website:', error);
    return NextResponse.json(
      { error: 'Failed to generate website' },
      { status: 500 }
    );
  }
}

interface Section {
  heading: string;
  content: string;
}

interface GenerateWebsiteParams {
  websiteName: string;
  sections: Section[];
  colorScheme: string;
  emailCaptureEnabled: boolean;
  affiliateEnabled: boolean;
}

function generateWebsiteHTML(params: GenerateWebsiteParams): string {
  const {
    websiteName,
    sections,
    colorScheme,
    emailCaptureEnabled,
    affiliateEnabled,
  } = params;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '59, 130, 246';
  };

  const rgbColor = hexToRgb(colorScheme);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${websiteName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: ${colorScheme};
            --primary-rgb: ${rgbColor};
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f9fafb;
        }

        /* Header Styles */
        header {
            background: white;
            border-bottom: 1px solid #e5e7eb;
            position: sticky;
            top: 0;
            z-index: 50;
        }

        header .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        header .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        header nav a {
            margin-left: 2rem;
            text-decoration: none;
            color: #666;
            transition: color 0.3s;
        }

        header nav a:hover {
            color: var(--primary-color);
        }

        /* Footer Styles */
        footer {
            background: #222;
            color: #ddd;
            border-top: 1px solid #333;
            padding: 4rem 2rem;
            margin-top: 6rem;
        }

        footer .container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #444;
        }

        footer h3 {
            color: white;
            margin-bottom: 1rem;
        }

        footer a {
            color: #aaa;
            text-decoration: none;
            display: block;
            margin-bottom: 0.5rem;
            transition: color 0.3s;
        }

        footer a:hover {
            color: white;
        }

        footer .footer-bottom {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
            font-size: 0.9rem;
            color: #999;
        }

        /* Main Content */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        main {
            padding: 4rem 2rem;
        }

        .hero {
            background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.05));
            padding: 4rem 2rem;
            margin-bottom: 4rem;
            border-radius: 8px;
        }

        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #222;
        }

        .hero p {
            font-size: 1.1rem;
            color: #666;
            max-width: 600px;
        }

        /* Content Sections */
        section {
            margin-bottom: 3rem;
        }

        h2 {
            color: var(--primary-color);
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--primary-color);
        }

        p {
            margin-bottom: 1rem;
            color: #555;
        }

        /* Email Capture Form */
        .email-capture {
            background: white;
            border: 2px solid var(--primary-color);
            border-radius: 8px;
            padding: 2rem;
            margin: 3rem 0;
            text-align: center;
        }

        .email-capture h3 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }

        .email-capture p {
            margin-bottom: 1.5rem;
            color: #666;
        }

        .email-form {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .email-form input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .email-form button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.3s;
        }

        .email-form button:hover {
            opacity: 0.9;
        }

        /* Affiliate Section */
        .affiliate-section {
            background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.05), rgba(var(--primary-rgb), 0.1));
            border-left: 4px solid var(--primary-color);
            padding: 2rem;
            border-radius: 8px;
            margin: 3rem 0;
        }

        .affiliate-section h3 {
            color: var(--primary-color);
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .commission-tiers {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }

        .tier {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            text-align: center;
        }

        .tier .percentage {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .tier .description {
            color: #666;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 1.8rem;
            }

            h2 {
                font-size: 1.3rem;
            }

            header .logo {
                font-size: 1.2rem;
            }

            header nav a {
                margin-left: 1rem;
                font-size: 0.9rem;
            }

            .email-form {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="logo">Rizzos AI</div>
            <nav>
                <a href="https://rizzosai.com">Home</a>
                <a href="https://rizzosai.com/blog">Blog</a>
                <a href="https://rizzosai.com/pricing">Pricing</a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container">
        <!-- Hero Section -->
        <div class="hero">
            <h1>${websiteName}</h1>
            <p>Discover the latest insights and strategies to grow your business with proven techniques and expert tips.</p>
        </div>

        <!-- Content Sections -->
        ${sections.map((section) => `
            <section>
                <h2>${section.heading}</h2>
                <p>${section.content}</p>
            </section>
        `).join('')}

        ${emailCaptureEnabled ? `
            <!-- Email Capture Form -->
            <div class="email-capture">
                <h3>Stay Updated</h3>
                <p>Get exclusive tips and strategies delivered to your inbox every week.</p>
                <div class="email-form">
                    <input type="email" placeholder="Enter your email address" id="emailInput" required>
                    <button onclick="captureEmail()">Subscribe</button>
                </div>
                <p style="font-size: 0.85rem; margin-top: 1rem; color: #999;">We respect your privacy. Unsubscribe at any time.</p>
            </div>
        ` : ''}

        ${affiliateEnabled ? `
            <!-- Affiliate Section -->
            <div class="affiliate-section">
                <h3>Join Our Affiliate Program</h3>
                <p>Earn money by sharing the content you love. Build passive income on autopilot.</p>
                
                <div class="commission-tiers">
                    <div class="tier">
                        <div class="percentage">70%</div>
                        <div class="description">Commission Rate<br><small>All new members</small></div>
                    </div>
                    <div class="tier">
                        <div class="percentage">75%</div>
                        <div class="description">Premium Rate<br><small>After 10 referrals</small></div>
                    </div>
                    <div class="tier">
                        <div class="percentage">Daily</div>
                        <div class="description">Automatic Payouts<br><small>Passive income on autopilot</small></div>
                    </div>
                </div>

                <p style="margin-top: 1.5rem; color: #666;">
                    Start earning today. Reach 10 referrals and your commission jumps to 75%. All payouts are fully automated and sent directly to your account every day.
                </p>
            </div>
        ` : ''}
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div>
                <h3>Company</h3>
                <a href="https://rizzosai.com">Home</a>
                <a href="https://rizzosai.com/pricing">Pricing</a>
                <a href="https://rizzosai.com/blog">Blog</a>
            </div>
            <div>
                <h3>Legal</h3>
                <a href="https://rizzosai.com/privacy">Privacy Policy</a>
                <a href="https://rizzosai.com/terms">Terms & Conditions</a>
                <a href="https://rizzosai.com/disclaimer">Earnings Disclaimer</a>
            </div>
            <div>
                <h3>Support</h3>
                <a href="https://rizzosai.com/faq">FAQ</a>
                <a href="mailto:support@rizzosai.com">Contact Us</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Rizzos AI. All rights reserved. Built for the modern affiliate marketer.</p>
        </div>
    </footer>

    <script>
        function captureEmail() {
            const emailInput = document.getElementById('emailInput');
            const email = emailInput.value.trim();

            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }

            // Send to Zapier webhook
            fetch('${process.env.NEXT_PUBLIC_ZAPIER_AFFILIATE_SIGNUP_WEBHOOK_URL}', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    source: 'generated_website',
                    website_name: '${websiteName}',
                    timestamp: new Date().toISOString()
                })
            })
            .then(() => {
                emailInput.value = '';
                alert('Thanks for subscribing! Check your email for confirmation.');
            })
            .catch(err => {
                console.error('Signup error:', err);
                alert('There was an issue. Please try again.');
            });
        }
    </script>
</body>
</html>`;
}
