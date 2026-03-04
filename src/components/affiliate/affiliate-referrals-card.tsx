'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Referral {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

interface AffiliateData {
  username: string;
  referralCount: number;
  referrals: Referral[];
  lastReferralAt: string | null;
}

export function AffiliateReferralsCard({ username }: { username: string }) {
  const [data, setData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReferrals() {
      try {
        const response = await fetch(`/api/affiliate/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch referral data');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchReferrals();
  }, [username]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">Error loading referrals</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://rizzosai.com'}/?username=${username}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Affiliate Referrals</span>
          <Badge variant={data.referralCount >= 2 ? 'default' : 'outline'}>
            {data.referralCount} referrals
          </Badge>
        </CardTitle>
        <CardDescription>
          You've referred {data.referralCount} user{data.referralCount !== 1 ? 's' : ''}.
          {data.referralCount >= 2 && (
            <span className="text-green-600 font-medium block mt-1">✓ You're in profit mode!</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Commission Info */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Commission Structure</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• <strong>70% commission</strong> on each referral (current tier)</li>
            <li>• <strong>75% commission</strong> when you reach 10 referrals</li>
            <li>• <strong>Daily automated payouts</strong> to your PayPal account</li>
          </ul>
        </div>

        {/* Referrals List */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Recent Signups via Your Link</h4>
          {data.referrals.length > 0 ? (
            <div className="space-y-2 divide-y">
              {data.referrals.map((referral) => (
                <div key={referral.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{referral.email}</p>
                      <p className="text-sm text-gray-500">
                        @{referral.username} • {formatDistanceToNow(new Date(referral.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      ✓ Signed up
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No referrals yet. Start sharing your link!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
