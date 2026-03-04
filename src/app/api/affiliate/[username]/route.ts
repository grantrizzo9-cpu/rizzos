import { db } from '@/lib/firebase-admin';

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = params;

    if (!username) {
      return Response.json({ error: 'Username is required' }, { status: 400 });
    }

    // Get affiliate document
    const affiliateRef = db.collection('affiliates').doc(username);
    const affiliateDoc = await affiliateRef.get();

    if (!affiliateDoc.exists) {
      return Response.json({
        referralCount: 0,
        referrals: [],
      });
    }

    const affiliateData = affiliateDoc.data();

    // Get all referrals for this affiliate
    const referralsSnapshot = await affiliateRef.collection('referrals').orderBy('createdAt', 'desc').get();
    const referrals = referralsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));

    return Response.json({
      username,
      referralCount: affiliateData?.referralCount || 0,
      referrals,
      lastReferralAt: affiliateData?.lastReferralAt?.toDate?.() || null,
    });
  } catch (error) {
    console.error('Error fetching affiliate referrals:', error);
    return Response.json(
      { error: 'Failed to fetch referral data', details: String(error) },
      { status: 500 }
    );
  }
}
