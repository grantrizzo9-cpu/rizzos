import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleHelp } from "lucide-react";

export default function RequestRefundPage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <CircleHelp />
            Request a Refund
        </CardTitle>
        <CardDescription>
            Information about our refund policy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>We offer a no-questions-asked refund on your one-time activation fee if you request it within 24 hours of joining, with one important condition: to be eligible for a refund, you must not have received any commission payouts from your referrals. If you have been paid out, a refund is not possible.</p>
        <p>If you decide it's not for you and meet the condition above, please contact our support team to request your refund. Please note that if you choose to receive a refund, your account will be closed, and you will no longer be able to log in.</p>
      </CardContent>
    </Card>
  );
}
