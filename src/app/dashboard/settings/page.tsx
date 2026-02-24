'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings } from 'lucide-react';
import { useState } from 'react';

const settingsFormSchema = z.object({
  displayName: z.string().min(3, 'Display name must be at least 3 characters.'),
  username: z.string().min(3, 'Username must be at least 3 characters.').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  async function onSubmit(values: SettingsFormValues) {
    setIsLoading(true);
    // In a real app, you would call a function here to update the user's profile in your database.
    // e.g., await updateUserProfile(user.uid, values);
    console.log('Updating settings with:', values);
    
    // We'll simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Settings Saved',
      description: 'Your profile information has been updated.',
    });
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Settings />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account and profile settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
