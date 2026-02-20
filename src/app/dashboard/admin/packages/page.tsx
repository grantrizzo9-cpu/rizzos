import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function AdminPackagesPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Package />Manage Packages</CardTitle>
                <CardDescription>Configure pricing tiers and features for the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Admin interface for managing subscription packages would go here.</p>
            </CardContent>
        </Card>
    );
}
