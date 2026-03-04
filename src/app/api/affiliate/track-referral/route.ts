import { db } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const { affiliateUsername, newUserEmail, newUserUsername } = await req.json();

    if (!affiliateUsername || !newUserEmail || !newUserUsername) {
      return Response.json(
        { error: 'Missing required fields: affiliateUsername, newUserEmail, newUserUsername' },
        { status: 400 }
      );
    }

    // Get or create affiliate document
    const affiliateRef = db.collection('affiliates').doc(affiliateUsername);
    const affiliateDoc = await affiliateRef.get();

    let affiliateData: any = {
      username: affiliateUsername,
      referralCount: 1,
      lastReferralAt: new Date(),
    };

    if (affiliateDoc.exists) {
      const current = affiliateDoc.data() || {};
      affiliateData = {
        ...current,
        referralCount: (current.referralCount || 0) + 1,
        lastReferralAt: new Date(),
      };
    }

    // Add referral to subcollection
    const referralRef = affiliateRef.collection('referrals').doc();
    await referralRef.set({
      email: newUserEmail,
      username: newUserUsername,
      createdAt: new Date(),
    });

    // Update affiliate count
    await affiliateRef.set(affiliateData, { merge: true });

    // If they just hit 2 referrals, send email alerts
    if (affiliateData.referralCount === 2) {
      // Get affiliate email from users collection
      const userRef = db.collection('users').doc(affiliateUsername);
      const userDoc = await userRef.get();
      const affiliateEmail = userDoc.data()?.email;

      const adminEmail = 'admin@rizzosai.com';
      const affiliateName = affiliateUsername;

      // Email to affiliate
      if (affiliateEmail) {
        await sendEmail(
          affiliateEmail,
          affiliateName,
          '🎉 Great News! You\'ve Hit 2 Referrals - Now in Profit Mode!',
          `
          <h2>Congratulations ${affiliateName}!</h2>
          <p>You've successfully referred 2 users to RizzoSAI! 🚀</p>
          <p>This is huge because <strong>you're now in profit mode</strong>. Your account is proven and you'll receive:</p>
          <ul>
            <li><strong>70% commission</strong> on your referrals (currently)</li>
            <li><strong>Daily automated payouts</strong> to PayPal</li>
            <li>Access to premium <strong>75% commission tier</strong> once you hit 10 referrals</li>
          </ul>
          <p>Check your dashboard to see your referral stats and earnings.</p>
          <p>Keep it up! 💪</p>
          `
        );
      }

      // Email to admin
      await sendEmail(
        adminEmail,
        'Admin',
        `⚠️ Affiliate Alert: ${affiliateName} Just Hit 2 Referrals`,
        `
        <h2>Affiliate Milestone Reached</h2>
        <p><strong>${affiliateName}</strong> (${affiliateEmail || 'unknown'}) has successfully referred 2 users.</p>
        <p>They're now in <strong>profit mode</strong> — chargeback risk is low. This affiliate is verified.</p>
        <p>Most recent referral: ${newUserEmail} (${newUserUsername})</p>
        `
      );
    }

    return Response.json({
      success: true,
      message: `Referral tracked for ${affiliateUsername}`,
      referralCount: affiliateData.referralCount,
      milestone: affiliateData.referralCount === 2 ? 'Email alerts sent!' : null,
    });
  } catch (error) {
    console.error('Referral tracking error:', error);
    return Response.json(
      { error: 'Failed to track referral', details: String(error) },
      { status: 500 }
    );
  }
}
