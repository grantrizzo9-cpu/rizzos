

export type Article = {
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
};

export const strategyArticles: Article[] = [
  {
    slug: 'connecting-your-domain',
    title: 'Guide: Connecting Your Custom Domain',
    description: 'A complete walkthrough for purchasing and connecting a custom domain to your website.',
    image: 'strategy-2',
    content: `
      <h2 class="font-headline text-2xl font-bold mt-8 mb-4 text-accent">Introduction: Your Professional Online Address</h2>
      <p class="mb-4">Once you\'ve activated your Rizzos Ai account, the next crucial step is to give your website a professional address with a custom domain name (e.g., <code>www.your-domain.com</code>). This guide will walk you through the entire process, from purchasing a domain to configuring it to work with our system. Following these steps will make your site live to the world on your own branded address.</p>
      
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Step 1: The Required DNS Records</h3>
      <p class="mb-4">You will need to add the following records at your domain registrar. These records tell the internet where to find your website hosted on our servers.</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Two 'A' Records:</strong> These point your root domain (e.g., <code>your-domain.com</code>) to our servers' IP addresses.</li>
        <li><strong>One 'CNAME' Record:</strong> This points the 'www' version of your domain (e.g., <code>www.your-domain.com</code>) to your root domain. This is a standard practice to ensure both addresses work.</li>
      </ul>
      <p class="mb-4">Here are the exact values you will need:</p>
      <ul class="list-none mb-4 space-y-2 bg-muted p-4 rounded-lg">
          <li><strong>A Record 1:</strong> Host: @, Value: 199.36.158.100</li>
          <li><strong>A Record 2:</strong> Host: @, Value: 199.36.158.101</li>
          <li><strong>CNAME Record:</strong> Host: www, Value: @</li>
      </ul>

      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Step 2: Adding the 'A' Records</h3>
       <p class="mb-4">Log in to your domain registrar (e.g., GoDaddy, Namecheap) and navigate to the DNS management section. Create two 'A' records with the host/name set to '@' (or your root domain) and point them to the IP addresses provided above.</p>


      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Step 3: Adding the 'CNAME' Record</h3>
      <p class="mb-4">In the same DNS management panel, you will add a CNAME record. Set the host/name to 'www' and point it to the value shown above. Most registrars use '@' to represent the root domain.</p>
      
      [DNS_IMAGE_PLACEHOLDER]

      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Step 4: Wait for Propagation & Verify</h3>
      <p class="mb-4">DNS changes can take some time to propagate across the internet. Once you\'ve completed the steps above, go to the <a href="/dashboard/domains" class="font-bold text-primary hover:underline">Hosting</a> page in your dashboard and use the verifier tool to check if your domain is fully connected.</p>
    `,
  },
  {
    slug: 'infrastructure-as-income',
    title: 'Guide: Infrastructure as Income',
    description: 'Learn how to turn essential web hosting into a reliable daily income stream.',
    image: 'strategy-1',
    content: `
      <h2 class="font-headline text-2xl font-bold mb-4 text-accent">The New Paradigm: Infrastructure as Income</h2>
      <p class="mb-4">In the dynamic world of affiliate marketing, the most astute players recognize a fundamental truth: sustainable, recurring revenue is the ultimate goal. Traditional affiliate models often rely on one-time commissions for fleeting products. But what if you could earn a consistent, daily income from a service as vital and permanent as a utility? This is the revolutionary concept behind Rizzos Ai, a principle we call "Infrastructure as Income." By promoting our enterprise-grade NVMe hosting, you are not merely selling a product; you\'re providing the very foundation upon which online businesses are built. A website\'s hosting is its home on the internet. Once a business settles in, especially on a high-performance platform that enhances their operations, they are incredibly unlikely to leave. This "stickiness" is the cornerstone of your long-term earnings.</p>
      <p class="mb-4">Think about the services businesses can\'t operate without: electricity, internet, and, in the digital age, web hosting. You are positioning yourself as a provider of this essential infrastructure. This elevates your role from a simple marketer to a strategic partner in your clients\' success. Every time you refer a customer, you\'re not just making a sale; you are planting a seed that yields a harvest every single day. This is a profound shift from chasing commissions to building a portfolio of income-generating assets. Your one-time effort of referral compounds over time, creating a reliable and predictable cash flow stream that lands in your account daily. This isn\'t just a sales pitch; it\'s a strategic framework for building a resilient and scalable affiliate business that pays you day in and day out. Over 600 words of compelling content can be generated here to elaborate on these points and provide even more value to the reader, exploring the psychological and economic principles that make this model so powerful and sustainable for the modern affiliate marketer.</p>
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Why Hosting is the Ultimate Affiliate Product</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Unmatched Stickiness:</strong> Website migration is a significant undertaking, involving technical risk and downtime. Once a business experiences the speed and reliability of our NVMe platform, the incentive to switch is virtually eliminated, securing your commission for the long haul.</li>
        <li><strong>An Absolutely Essential Service:</strong> In the digital economy, a website is not optional. High-quality hosting is the bedrock of online presence, security, and user experience. You are selling a fundamental business necessity.</li>
        <li><strong>Aligned Value Proposition:</strong> Your success is directly tied to your referral\'s success. By guiding them to a superior hosting solution, you are tangibly improving their site\'s performance, SEO rankings, and conversion rates, fostering trust and goodwill.</li>
        <li><strong>Scalable and Predictable:</strong> Unlike products with fluctuating demand, the need for web hosting is constant and growing. This allows you to build a predictable income model that you can scale with confidence, forecasting your earnings based on your referral base.</li>
      </ul>
      <p>This model transforms a standard affiliate partnership into a long-term financial asset. Your one-time effort of referring a customer blossoms into a daily dividend, paid directly to your account. This is the future of sustainable affiliate marketing.</p>
    `,
  },
  {
    slug: 'roadmap-to-10-referrals',
    title: 'Guide: Roadmap to 10 Referrals (75% Bump)',
    description: 'A step-by-step guide to reaching 10 active referrals and unlocking the 75% commission tier.',
    image: 'strategy-2',
    content: `
      <h2 class="font-headline text-2xl font-bold mb-4 text-accent">Your Roadmap to the 75% Commission Tier</h2>
      <p class="mb-4">Reaching your first 10 active referrals with Rizzos Ai is a critical milestone. It’s the threshold where your daily commission rate permanently increases from an already generous 70% to an industry-leading 75%. This 5% bump may seem small, but it represents a significant, compounding increase in your daily income over the lifetime of your referrals. This isn\'t just a promotional target; it\'s a strategic tipping point that accelerates your journey towards substantial passive income. Getting there requires a thoughtful, multi-faceted approach. Forget scattergun tactics; this roadmap provides a structured, three-stage plan to help you efficiently build your referral base and unlock that lucrative top-tier commission. Each stage focuses on a different strategy, from targeting high-intent users to leveraging our powerful AI tools and finally, to building a sustainable community that generates referrals on autopilot. This detailed plan, when executed consistently, can help you achieve your goal faster than you ever thought possible, solidifying your status as a high-earning affiliate partner. Let\'s dive into the specifics of each step and equip you with the knowledge to succeed. This article provides a comprehensive, step-by-step guide with examples and pro-tips for each stage.</p>
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Step 1: The Surgical Strike (First 1-3 Referrals)</h3>
      <p class="mb-4">Your initial focus should be on precision, not volume. Instead of broad-stroke marketing, become a problem-solver. Your ideal first customers are those actively experiencing the pain of slow, unreliable hosting. Spend time in webmaster forums, Facebook groups for small businesses, and on Reddit threads where people complain about their current hosting providers. Look for phrases like "my site is so slow," "my host keeps going down," or "should I switch from [Budget Host]?". Engage genuinely, offer advice, and then introduce Rizzos Ai as the definitive solution. Create a simple, powerful blog post on your own site titled "Why I Switched to NVMe Hosting and Doubled My Site Speed." Use real data if you can. This targeted, value-first approach builds trust and secures high-quality initial referrals who will stick around.</p>
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Step 2: The AI Content Engine (Referrals 4-7)</h3>
      <p class="mb-4">With a small base of daily income, it\'s time to scale your content production. This is where our integrated AI Studio becomes your superpower. Use the Blog Generator to rapidly create a library of high-value, SEO-optimized, and well-structured content. Think beyond simple reviews. Generate articles like: "Core Web Vitals Explained: How Your Host is Secretly Killing Your Rank," "The 2024 Guide to E-commerce Hosting Performance," or "Case Study: Reducing WooCommerce Cart Abandonment with Faster Load Times." Then, use the Ad Studio to create hyper-targeted social media campaigns promoting these articles to relevant audiences (e.g., e-commerce store owners, SaaS founders). The goal is to establish yourself as an authority on web performance, drawing potential customers to you with valuable information before you even pitch the product.</p>
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Step 3: The Community Flywheel (Referrals 8-10+)</h3>
      <p class="mb-4">Now it’s time to build a sustainable referral engine. Start a small, focused community on a platform like Discord, a private Facebook group, or even an email newsletter. The focus should be on "Digital Marketing & Growth," not just hosting. Offer weekly tips, share success stories (including your own), and answer questions about SEO, content marketing, and conversion optimization. Provide genuine value 90% of the time. In the remaining 10%, you can naturally introduce Rizzos Ai as the foundational tool for achieving the performance goals you discuss. Host Q&A sessions, invite guest experts, and feature member success stories. As you build authority and trust within this community, it will become a powerful, self-perpetuating flywheel, generating organic referrals as members recommend the platform to their own networks.</p>
    `,
  },
  {
    slug: 'ai-content-velocity',
    title: 'Guide: AI Content Velocity',
    description: 'Master the art of rapid content creation using the AI Studio to dominate your niche.',
    image: 'strategy-3',
    content: `
      <h2 class="font-headline text-2xl font-bold mb-4 text-accent">Achieving Unmatched Content Velocity with AI</h2>
      <p class="mb-4">In the contemporary digital ecosystem, content is not just king; it\'s the entire kingdom. It\'s the currency of attention, the foundation of authority, and the primary driver of traffic and conversions. "Content Velocity" is a critical metric that measures the speed, quality, and efficiency with which you can produce and deploy high-quality, relevant content. A higher content velocity allows you to dominate search engine results, saturate social media feeds, and capture audience attention before your competitors even have a chance to react. The Rizzos Ai AI Studio is an integrated suite of tools designed to give you an insurmountable advantage in this race. It\'s your personal, on-demand marketing team, ready to transform your ideas into polished, multi-format content in a matter of minutes, not days or weeks. This allows you to test new angles, respond to market trends instantly, and maintain a constant, engaging presence across all your marketing channels. The ability to consistently out-produce your competition is a game-changer, and our AI studio provides the engine to do just that. This guide provides a masterclass in AI-powered content marketing.</p>
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">Your Integrated AI Marketing Toolkit</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Blog Generator:</strong> This is the cornerstone of your content strategy. Go from a single keyword or topic to a 600+ word, SEO-optimized, and well-structured article in seconds. Use it to build out your own affiliate niche sites with pillar pages and supporting blog posts. Create compelling guest posts to build backlinks and authority. Generate lead magnets like free guides or ebooks to capture email addresses. This tool single-handedly solves the biggest bottleneck for most marketers: consistent, high-quality long-form content creation.</li>
        <li><strong>Ad Studio:</strong> Effective ad copy is an art and a science. The Ad Studio masters both. Stop A/B testing dozens of headlines and body copy variations. Instead, provide the product details and let the AI generate platform-specific copy for Facebook, Instagram, Google Ads, TikTok, and more. It understands the nuances of each platform, from character limits on Google Ads to the emoji-and-hashtag-driven language of Instagram. Pair this with AI-generated images for a complete, high-performance ad creative package in under five minutes.</li>
        <li><strong>Video Studio:</strong> Video content boasts the highest engagement rates across all social platforms, but production is often a barrier. The Video Studio shatters that barrier. It can take an article generated by the Blog Generator and automatically create a structured script for a short-form video, complete with an introduction, main points, and a call to action. This allows you to effortlessly repurpose your long-form content into engaging video snippets for platforms like TikTok, YouTube Shorts, and Instagram Reels, massively amplifying your reach.</li>
      </ul>
      <p>Imagine this workflow: On Monday morning, you use the Niche Site Idea Generator to identify a new trend. By lunch, you\'ve used the Blog Generator to create five foundational articles. By mid-afternoon, you\'ve used the Ad Studio to create a week\'s worth of promotional social media posts. And by the end of the day, you\'ve used the Video Studio to script three short-form videos. This is the power of content velocity. While your competitors are still brainstorming, you\'ve already deployed a comprehensive, multi-channel content campaign, ready to capture traffic, generate leads, and earn commissions.</p>
    `,
  },
  {
    slug: 'nvme-edge-seo-advantage',
    title: 'Guide: NVMe Edge SEO Advantage',
    description: 'Discover how sub-second load times give your sites a powerful ranking advantage on Google.',
    image: 'strategy-4',
    content: `
      <h2 class="font-headline text-2xl font-bold mb-4 text-accent">The SEO Power of NVMe Edge Hosting</h2>
      <p class="mb-4">Search Engine Optimization (SEO) is a multifaceted and ever-evolving discipline, but in recent years, Google has made one factor unequivocally clear and increasingly important: page speed. User experience is paramount, and a fast-loading website is the cornerstone of a positive user experience. Google\'s Core Web Vitals are no longer just a suggestion; they are a direct, measurable ranking factor that can make or break your visibility in the search results. This is precisely where Rizzos Ai’s NVMe Edge Hosting provides you and your referrals with a decisive, data-backed advantage. While your competitors are struggling with shared hosting limitations and sluggish databases, your sites are built on a foundation engineered for instantaneous response times. Understanding and articulating this technical advantage is key to converting savvy clients who know that in the world of SEO, milliseconds matter. This isn\'t just about being slightly faster; it\'s about a fundamental architectural superiority that translates directly into better rankings, more traffic, and higher conversions. This article will delve into the technical specifics of why NVMe is a game-changer and how you can leverage this knowledge to become a trusted authority on performance-driven SEO.</p>
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">NVMe vs. Legacy SSDs: A Generational Leap</h3>
      <p class="mb-4">For years, Solid State Drives (SSDs) were the gold standard for hosting. They were a massive improvement over traditional spinning hard drives (HDDs). However, SSDs were built using the same SATA interface as those older drives, creating an inherent bottleneck. NVMe (Non-Volatile Memory Express) is a technology built from the ground up for the speed of modern flash memory. Instead of the outdated SATA protocol, NVMe communicates directly with the server\'s CPU via the PCIe bus. This is like moving from a winding country road to a multi-lane superhighway.</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Drastically Lower Latency:</strong> NVMe reduces latency by orders of magnitude. This directly improves your Time to First Byte (TTFB), one of the first and most important metrics Google measures. A fast TTFB signals a healthy, responsive server.</li>
        <li><strong>Massive Parallelism:</strong> The SATA protocol can handle only one queue of commands with up to 32 commands per queue. NVMe can handle a staggering 65,536 queues, each with 65,536 commands. This means your site can handle heavy traffic, complex database queries, and numerous simultaneous user interactions without breaking a sweat.</li>
        <li><strong>Direct Impact on Core Web Vitals:</strong> A faster storage backend directly improves Google\'s key metrics. Largest Contentful Paint (LCP) is faster because images and content are served from the disk quicker. First Input Delay (FID) is reduced because the server can respond to user interactions instantly, without being bogged down by other requests. Cumulative Layout Shift (CLS) is also improved, as assets load so quickly that the page stabilizes almost immediately.</li>
      </ul>
      <p>When you refer a client to Rizzos Ai, you are offering them more than just hosting space. You are providing them with an immediate, tangible SEO advantage. Their pages will load faster, their users will be more engaged, their bounce rate will decrease, and as a result, Google will reward them with higher search engine rankings. This makes your role as an affiliate incredibly compelling. You\'re not just selling a service; you\'re selling better rankings, more traffic, and ultimately, more revenue for your clients\' businesses. It\'s a powerful value proposition that resonates with any serious online entrepreneur.</p>
    `,
  },
  {
    slug: 'daily-cashflow-management',
    title: 'Guide: Daily Cashflow Management',
    description: 'Strategies for managing and reinvesting your daily payouts to accelerate growth.',
    image: 'strategy-5',
    content: `
      <h2 class="font-headline text-2xl font-bold mb-4 text-accent">Mastering Your Daily Cashflow Velocity</h2>
      <p class="mb-4">For the vast majority of affiliate marketers, income is a waiting game. You make a sale today and might wait 30, 60, or even 90 days to see that commission in your bank account. This massive delay creates a significant drag on growth, tying up your hard-earned capital and preventing you from reinvesting it into your business. Rizzos Ai completely shatters this outdated model. Receiving your 70-75% commission daily is more than a convenience; it\'s a fundamental paradigm shift in how you operate and scale your business. It transforms your earnings from a static, distant paycheck into dynamic, active working capital that you can deploy every single day. This concept is known as cashflow velocity—the speed at which money moves through your business and is put back to work generating more money. Our daily payout system gives you the highest possible cashflow velocity in the affiliate industry, creating a powerful and accelerating feedback loop for growth. Understanding how to manage and leverage this daily influx of capital is the key to unlocking exponential scale and building a truly formidable affiliate enterprise. This guide will explore the strategies to do just that.</p>
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">The Daily Compound Growth Engine: A Case Study</h3>
      <p class="mb-4">Let\'s compare two affiliates. Affiliate A uses a traditional network with a 30-day payout. Affiliate B uses Rizzos Ai with daily payouts. Both start with a $100 ad budget.</p>
      <ol class="list-decimal list-inside space-y-2">
        <li><strong>Day 1:</strong> Both affiliates spend $100 on ads and generate $150 in commissions. Affiliate A\'s $150 is locked for 30 days. Affiliate B receives their $150 commission (~70% = $105) the next day.</li>
        <li><strong>Day 2:</strong> Affiliate A has no new capital and cannot run ads. They must wait. Affiliate B takes their $105 payout and immediately reinvests it into another ad campaign. This campaign generates $157.50 in new commissions ($105 * 1.5), which will be paid out on Day 3.</li>
        <li><strong>Day 3:</strong> Affiliate A is still waiting. Affiliate B receives their $157.50 commission ($110.25 payout) and reinvests it again, generating even more commissions for Day 4.</li>
      </ol>
      <p class="mb-4">By the end of the month, Affiliate A finally receives their first $150 payout. In that same time, Affiliate B has compounded their earnings every single day, turning their initial $100 into a significantly larger daily payout and a much larger customer base. This is the power of cashflow velocity. It allows you to create a self-funding, perpetually growing marketing machine. You can use your daily earnings to fuel your paid ad campaigns, test new traffic sources, or hire content creators, all without touching your personal capital. Your business funds its own rapid expansion. This strategy, made possible only by our daily payout structure, is how you out-maneuver and out-scale competitors who are stuck in the slow lane of monthly payments.</p>
    `,
  },
  {
    slug: 'one-click-niche-site-scaling',
    title: 'Guide: 1-Click Niche Site Scaling',
    description: 'A look into the future of affiliate marketing: deploying entire niche sites with a single click.',
    image: 'strategy-6',
    content: `
      <h2 class="font-headline text-2xl font-bold mb-4 text-accent">The Future is Automated: 1-Click Niche Site Deployment</h2>
      <p class="mb-4">Imagine having the power to test a new affiliate niche not in weeks or months, but in minutes. The conventional process of building a new niche website is a grueling, time-consuming affair: exhaustive keyword research, domain purchasing and configuration, setting up WordPress, wrestling with themes and plugins, and the most significant bottleneck of all—writing dozens of pages of foundational content. This slow, laborious process means that most affiliates can only pursue a handful of ideas per year, with each one representing a significant gamble of time and resources. The Rizzos Ai Website Builder, an exclusive tool for our upper-tier partners, is engineered to make this entire process obsolete. It represents the next evolutionary leap in affiliate marketing: the ability to go from a simple idea to a fully-realized, content-rich, and SEO-optimized niche website, deployed on our high-speed NVMe hosting, with just a few clicks. This isn\'t about incremental improvement; it\'s about a 100x increase in efficiency, a portfolio-based approach to affiliate marketing that was previously impossible. This guide provides a look into how this revolutionary technology works and the strategic implications it has for scaling your affiliate empire.</p>
      <h3 class="font-headline text-xl font-bold mt-6 mb-2 text-accent">From Concept to Live Site in Under 5 Minutes</h3>
      <p class="mb-4">Our AI-powered Website Builder is a sophisticated system that intelligently combines our powerful AI with our automated hosting provisioning pipeline. The workflow is designed for maximum impact with minimal input:</p>
      <ol class="list-decimal list-inside space-y-2">
        <li><strong>Define Your Niche & Target:</strong> You provide the AI with a core niche topic (e.g., "cold brew coffee makers," "beginner drone photography for real estate," or "eco-friendly pet toys") and a target demographic.</li>
        <li><strong>AI Strategic Analysis:</strong> Our AI backend gets to work. It analyzes the niche to identify key sub-topics, "versus" keywords, "best of" listicles, and informational content opportunities. It maps out a logical site structure designed to capture a wide range of search queries.</li>
        <li><strong>Automated Content Generation:</strong> With the content plan defined, the AI uses the Blog Generator to write a series of 5-10 foundational, SEO-optimized articles. This includes a comprehensive "pillar page" and several supporting articles that internally link to it, creating a powerful topic cluster that Google loves.</li>
        <li><strong>Intelligent Site Assembly & Deployment:</strong> The AI then selects a clean, fast-loading, mobile-friendly theme. It assembles the generated articles into a complete website, creates a logical navigation menu, sets up the homepage, and adds essential pages like 'About' and 'Contact'. Finally, it deploys the entire website package directly to your Rizzos Ai account, fully live and ready to be indexed by Google.</li>
      </ol>
      <p class="mb-4">This paradigm shift enables a portfolio strategy. Instead of betting everything on one or two ideas, you can now deploy a dozen niche sites in a single afternoon. Let them sit for a few weeks, watch your analytics, and see which ones start to gain organic traction. You can then use the AI Studio to double down on the winners, adding more content and promoting them, while simply abandoning the losers with minimal time or capital lost. This is how you de-risk affiliate marketing and scale your operations exponentially. It\'s not just about saving time; it\'s about fundamentally changing the economics of the game in your favor.</p>
    `,
  },
];

export type PricingTier = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  stripePriceId: string;
};

const starterGuides = [
  'Guide: Connecting Your Custom Domain',
  'Guide: Infrastructure as Income',
];

const bronzeGuides = [
  ...starterGuides,
  'Guide: Roadmap to 10 Referrals (75% Bump)',
];

const silverGuides = [
  ...bronzeGuides,
  'Guide: AI Content Velocity',
];

const goldGuides = [
  ...silverGuides,
  'Guide: NVMe Edge SEO Advantage',
];

const platinumGuides = [
  ...goldGuides,
  'Guide: Daily Cashflow Management',
];

const diamondGuides = [
  ...platinumGuides,
  'Guide: 1-Click Niche Site Scaling',
];

export const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9.95,
    description: 'For marketers starting their journey.',
    stripePriceId: 'price_starter_activation_fee', // Replace with your actual Stripe Price ID
    features: [
      '1 Hosted Site',
      'NVMe Edge Storage',
      'Basic AI Tools (Ad Copy)',
      '70% Commission Rate',
      ...starterGuides,
    ],
  },
  {
    id: 'bronze',
    name: 'Bronze',
    price: 29.95,
    description: 'For marketers expanding their portfolio.',
    stripePriceId: 'price_bronze_activation_fee', // Replace with your actual Stripe Price ID
    features: [
      '5 Hosted Sites',
      'NVMe Edge Storage',
      'AI Blog, Article & Website Creation',
      '70% Commission Rate',
      ...bronzeGuides,
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 49.95,
    description: 'For marketers expanding their portfolio.',
    stripePriceId: 'price_silver_activation_fee', // Replace with your actual Stripe Price ID
    features: [
      '15 Hosted Sites',
      'NVMe Edge Storage',
      'AI Blog, Article & Website Creation',
      '70% Commission Rate',
      'Priority Support',
      ...silverGuides,
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 99.95,
    description: 'For serious marketers scaling their operations.',
    stripePriceId: 'price_gold_activation_fee', // Replace with your actual Stripe Price ID
    features: [
      '50 Hosted Sites',
      'NVMe Edge Storage',
      'AI Blog, Article & Website Creation',
      '75% Commission Rate',
      'Priority Support',
      ...goldGuides,
    ],
    isPopular: true,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 199.95,
    description: 'For affiliate teams managing multiple brands.',
    stripePriceId: 'price_platinum_activation_fee', // Replace with your actual Stripe Price ID
    features: [
      '150 Hosted Sites',
      'NVMe Edge Storage',
      'AI Blog, Article & Website Creation',
      '75% Commission Rate',
      'Priority Support',
      ...platinumGuides,
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 499.00,
    description: 'For agencies and large-scale businesses.',
    stripePriceId: 'price_diamond_activation_fee', // Replace with your actual Stripe Price ID
    features: [
      'Unlimited Hosted Sites',
      'NVMe Edge Storage',
      'Full AI Suite with Video Generation',
      '75% Commission Rate',
      'Dedicated Account Manager',
      'Whitelabel Solution',
      ...diamondGuides,
    ],
  },
];
