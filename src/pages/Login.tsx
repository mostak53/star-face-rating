import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, User, Lock, Mail } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginProps {
  setUser: (user: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function Login({ setUser, setIsAdmin }: LoginProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // User Login/Register State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleUserAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    
    setIsLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      }
      navigate('/rating');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) return toast.error('Please fill in all fields');
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      if (adminEmail === '252-15-974@diu.edu.bd') {
        toast.success('Admin access granted');
        navigate('/admin');
      } else {
        toast.error('This account does not have administrator privileges.');
        await auth.signOut();
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Invalid admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12 rounded-full p-1 bg-zinc-100">
          <TabsTrigger value="user" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            User Login
          </TabsTrigger>
          <TabsTrigger value="admin" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Admin Login
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <Card className="border-zinc-100 shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 pb-8">
              <div className="h-12 w-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 mb-4">
                <User className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">{isRegistering ? 'Create Account' : 'User Portal'}</CardTitle>
              <CardDescription>
                {isRegistering ? 'Join our community to start rating' : 'Enter your credentials to access the rating system'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="john@example.com" 
                    className="pl-10 h-11 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 h-11 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4">
              <Button 
                className="w-full h-11 rounded-xl font-semibold" 
                onClick={handleUserAction}
                disabled={isLoading}
              >
                {isLoading ? (isRegistering ? 'Creating...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-11 rounded-xl font-semibold text-zinc-500" 
                onClick={() => setIsRegistering(!isRegistering)}
                disabled={isLoading}
              >
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register Now'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="border-zinc-100 shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 pb-8">
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
              <CardDescription>Restricted area. Please provide administrator credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input 
                    id="adminEmail" 
                    type="email" 
                    placeholder="Enter admin email" 
                    className="pl-10 h-11 rounded-xl"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input 
                    id="adminPassword" 
                    type="password" 
                    className="pl-10 h-11 rounded-xl"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button 
                className="w-full h-11 rounded-xl font-semibold bg-zinc-900 hover:bg-zinc-800" 
                onClick={handleAdminLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Admin Login'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
