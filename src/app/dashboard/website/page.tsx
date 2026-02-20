import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function WebsitePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><Globe />Website</CardTitle>
                <CardDescription>Manage your hosted websites.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This is where you would manage your websites, similar to the hosting manager.</p>
            </CardContent>
        </Card>
    );
}
