'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getWebsites, deleteWebsite, type SavedWebsite } from "@/lib/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import { Loader2, Trash2, Eye, Globe, Webhook, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DeploymentClient } from "@/components/hosting/deployment-client";


export default function WebsitePage() {
    const { user } = useAuth();
    const [websites, setWebsites] = useState<SavedWebsite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deployingWebsite, setDeployingWebsite] = useState<SavedWebsite | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (user?.uid) {
            getWebsites(user.uid)
                .then(setWebsites)
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    const handlePreview = (htmlContent: string) => {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const handleDelete = async (websiteId: string) => {
        if (!user?.uid) return;
        try {
            await deleteWebsite(user.uid, websiteId);
            setWebsites(prev => prev.filter(w => w.id !== websiteId));
            toast({
                title: "Website Deleted",
                description: "Your generated website has been removed.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not delete the website. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Globe />My Generated Websites</CardTitle>
                    <CardDescription>Manage, preview, and deploy the websites you've created with the AI Website Builder.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : websites.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Website ID</TableHead>
                                    <TableHead>Theme</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {websites.map((website) => (
                                    <TableRow key={website.id}>
                                        <TableCell className="font-mono text-xs">{website.id}</TableCell>
                                        <TableCell><Badge variant="outline">{website.themeName}</Badge></TableCell>
                                        <TableCell>{format(new Date(website.createdAt), "PPP p")}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handlePreview(website.htmlContent)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Preview
                                            </Button>
                                            <Button 
                                                variant="default" 
                                                size="sm" 
                                                onClick={() => setDeployingWebsite(website)}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                <Rocket className="mr-2 h-4 w-4" />
                                                Deploy
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your website
                                                        and remove its data from our servers.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(website.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-16">
                            <Webhook className="mx-auto h-12 w-12 mb-4"/>
                            <h3 className="text-lg font-semibold">No Websites Yet</h3>
                            <p>You haven't generated and saved any websites. Visit the AI Content Studio to create your first one!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!deployingWebsite} onOpenChange={(open) => !open && setDeployingWebsite(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Deploy Your Website</DialogTitle>
                        <DialogDescription>
                            Deploy your generated website to a custom domain using Firebase Hosting
                        </DialogDescription>
                    </DialogHeader>
                    {deployingWebsite && user && (
                        <DeploymentClient
                            userId={user.uid}
                            htmlContent={deployingWebsite.htmlContent}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your website
                                                    and remove its data from our servers.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(website.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-16">
                        <Webhook className="mx-auto h-12 w-12 mb-4"/>
                        <h3 className="text-lg font-semibold">No Websites Yet</h3>
                        <p>You haven't generated and saved any websites. Visit the AI Content Studio to create your first one!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
