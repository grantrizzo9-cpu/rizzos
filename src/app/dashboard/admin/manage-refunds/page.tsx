import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function AdminManageRefundsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><ShieldAlert />Manage Refunds</CardTitle>
                <CardDescription>Review and process refund requests from affiliates.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Admin interface for managing refund requests would go here.</p>
            </CardContent>
        </Card>
    );
}
