import { db } from '@/lib/firebase-admin';
import { formatDistanceToNow } from 'date-fns';

interface AffiliateData {
  username: string;
  referralCount: number;
  lastReferralAt?: Date;
  createdAt?: Date;
}

async function getAffiliates(): Promise<AffiliateData[]> {
  try {
    const snapshot = await db.collection('affiliates').get();
    const affiliates: AffiliateData[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      affiliates.push({
        username: doc.id,
        referralCount: data.referralCount || 0,
        lastReferralAt: data.lastReferralAt?.toDate(),
        createdAt: data.createdAt?.toDate(),
      });
    });

    // Sort by referral count descending
    return affiliates.sort((a, b) => (b.referralCount || 0) - (a.referralCount || 0));
  } catch (error) {
    console.error('Failed to fetch affiliates:', error);
    return [];
  }
}

export default async function AdminAffiliatesPage() {
  const affiliates = await getAffiliates();

  const profitableAffiliates = affiliates.filter((a) => (a.referralCount || 0) >= 2);
  const riskAffiliates = affiliates.filter((a) => (a.referralCount || 0) === 1);
  const topAffiliates = affiliates.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Affiliate Management</h1>
        <p className="text-gray-500">Monitor and manage your affiliate referral network</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total Affiliates</div>
          <div className="text-3xl font-bold mt-2">{affiliates.length}</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="text-sm text-green-800">Profitable Affiliates (2+ refs)</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{profitableAffiliates.length}</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="text-sm text-yellow-800">At Risk (1 ref)</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">{riskAffiliates.length}</div>
        </div>
      </div>

      {/* Top Affiliates */}
      {topAffiliates.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Top Affiliates</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {topAffiliates.map((affiliate) => (
              <div key={affiliate.username} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="font-medium">{affiliate.username}</div>
                  <div className="text-sm text-gray-500">
                    {affiliate.lastReferralAt
                      ? `Last referral: ${formatDistanceToNow(affiliate.lastReferralAt, { addSuffix: true })}`
                      : 'No referrals yet'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${(affiliate.referralCount || 0) >= 2 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {affiliate.referralCount || 0}
                  </div>
                  <div className="text-xs text-gray-500">referrals</div>
                  {(affiliate.referralCount || 0) >= 2 && (
                    <div className="text-xs text-green-600 font-medium mt-1">✓ Profitable</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Affiliates Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">All Affiliates</h2>
        </div>
        {affiliates.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Referrals</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Referral</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate) => (
                <tr key={affiliate.username} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{affiliate.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-bold">{affiliate.referralCount || 0}</div>
                  </td>
                  <td className="px-6 py-4">
                    {(affiliate.referralCount || 0) >= 2 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Profitable
                      </span>
                    ) : (affiliate.referralCount || 0) === 1 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        ⚠️ At Risk
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {affiliate.lastReferralAt
                      ? formatDistanceToNow(affiliate.lastReferralAt, { addSuffix: true })
                      : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">No affiliates yet</div>
        )}
      </div>
    </div>
  );
}
