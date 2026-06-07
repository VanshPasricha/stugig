import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err || 'Failed to login');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
            {/* Left Pane - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-background">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto w-full max-w-sm lg:w-96"
                >
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-foreground tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <a 
                                href="http://localhost:5000/api/auth/google"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center items-center py-2.5 px-4 border border-border rounded-lg shadow-sm bg-card hover:bg-muted/50 transition-colors font-medium text-sm text-foreground"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </a>
                            <a 
                                href="http://localhost:5000/api/auth/github"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center items-center py-2.5 px-4 border border-border rounded-lg shadow-sm bg-card hover:bg-muted/50 transition-colors font-medium text-sm text-foreground"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                Github
                            </a>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-background text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>

                        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3"
                                >
                                    {error}
                                </motion.div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-foreground">Email address</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                                        placeholder="you@student.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground">Password</label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        required
                                        className="block w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-input rounded bg-background" />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">Remember me</label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Right Pane - Feature Showcase */}
            <div className="hidden lg:flex flex-1 relative bg-muted/20 border-l border-border/50 items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-[100px]"></div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 max-w-lg"
                >
                    <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">The Student Advantage</h3>
                                <p className="text-sm text-muted-foreground">Build your portfolio early.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">Access exclusive student-only freelance opportunities tailored to your major.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">Utilize our AI Smart Bidding Assistant to win higher-paying jobs effortlessly.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground">Secure Escrow payments guarantee you get paid for your hard work on time.</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                <img className="w-8 h-8 rounded-full border-2 border-card" src="https://i.pravatar.cc/100?img=1" alt="" />
                                <img className="w-8 h-8 rounded-full border-2 border-card" src="https://i.pravatar.cc/100?img=2" alt="" />
                                <img className="w-8 h-8 rounded-full border-2 border-card" src="https://i.pravatar.cc/100?img=3" alt="" />
                            </div>
                            <p className="text-sm text-muted-foreground">Join 10,000+ students</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
