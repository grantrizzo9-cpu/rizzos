import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HardDrive } from "lucide-react";

const connectedDomains = [
  { domain: "mycoolsite.com", status: "Connected", plan: "Pro" },
  { domain: "another-niche.net", status: "Propagating", plan: "Pro" },
];

export default function HostingPage() {
  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><HardDrive/>Hosting Manager</CardTitle>
          <CardDescription>Connect and manage your domains. All domain fulfillment is handled via the secure OpenSRS registrar pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="domain">Connect a new domain</Label>
            <div className="flex gap-2">
                <Input id="domain" placeholder="your-new-domain.com" />
                <Button>Connect</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
            <p className="text-sm text-muted-foreground">After connecting, you will be provided with nameservers to point your domain to.</p>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Connected Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connectedDomains.map((item) => (
                <TableRow key={item.domain}>
                  <TableCell className="font-medium">{item.domain}</TableCell>
                  <TableCell>{item.plan}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Connected' ? 'default' : 'secondary'}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
