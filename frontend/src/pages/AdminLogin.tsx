import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, WashingMachine, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setUser = useAppStore((state) => state.setUser);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.status === 'success') {
                localStorage.setItem('token', response.data.data);
                // In a real app, you'd fetch the user profile here.
                // For now, we'll set a dummy admin user.
                setUser({
                    id: 1,
                    name: 'Admin Maulana',
                    email: email,
                    role: 'admin'
                });
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 relative">
            <Button
                variant="ghost"
                className="absolute top-6 left-6 text-gray-500 hover:text-primary rounded-full px-4"
                onClick={() => navigate('/')}
            >
                <Home className="mr-2 h-4 w-4" />
                Back to Website
            </Button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary p-3 rounded-2xl shadow-lg">
                            <WashingMachine className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-blue-900">Maulana Login</h1>
                    </div>
                </div>

                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center border border-destructive/20"
                                >
                                    {error}
                                </motion.div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@laundry.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
                                    onClick={() => {
                                        setEmail('admin@laundry.com');
                                        setPassword('admin123');
                                    }}
                                >
                                    Use Demo Account
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full font-bold text-lg h-12 rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login to Dashboard'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
                <p className="text-center mt-8 text-sm text-gray-500">
                    &copy; 2024 Maulana Laundry. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
