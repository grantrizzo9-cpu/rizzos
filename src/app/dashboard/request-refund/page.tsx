
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleHelp, Hourglass } from "lucide-react";

export default function RequestRefundPage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <CircleHelp />
            Request a Refund
        </CardTitle>
        <CardDescription>
            Our refund policy and how to request one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="font-semibold mb-2">Eligibility</h3>
            <p className="text-muted-foreground">We offer a no-questions-asked refund on your one-time activation fee if you request it within 24 hours of joining, with one important condition: to be eligible for a refund, you must not have received any commission payouts from your referrals. If you have been paid out, a refund is not possible.</p>
        </div>
        
        <Alert>
            <Hourglass className="h-4 w-4" />
            <AlertTitle>How to Request a Refund</AlertTitle>
            <AlertDescription>
                <p className="mb-2">All refund requests are handled manually by our team. If you meet the eligibility criteria, please send an email to <a href="mailto:rentapog@gmail.com" className="text-primary hover:underline">rentapog@gmail.com</a> to start the process.</p>
                <p>We do our best to process requests quickly, but please **allow us up to 24 hours** to respond before filing a payment dispute. If your request is approved, the refund will be sent directly to your account, and your affiliate account will be closed.</p>
            </AlertDescription>
        </Alert>

        <div>
            <h3 className="font-semibold mb-2">Important Note</h3>
            <p className="text-muted-foreground">Please note that if you choose to receive a refund, your account will be permanently closed, and you will no longer be able to log in or earn commissions.</p>
        </div>
      </CardContent>
    </Card>
  );
}
