import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Briefcase, UserCircle2 } from 'lucide-react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password, role);
            navigate('/dashboard');
        } catch (err) {
            setError(err || 'Failed to register');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
            {/* Left Pane - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-background py-12">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto w-full max-w-sm lg:w-[400px]"
                >
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-foreground tracking-tight">
                            Join StuGig
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign in instead
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

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-background text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div 
                                    onClick={() => setRole('client')}
                                    className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${role === 'client' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:bg-muted/50'}`}
                                >
                                    <Briefcase className={`w-6 h-6 mx-auto mb-2 ${role === 'client' ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className={`text-sm font-medium ${role === 'client' ? 'text-foreground' : 'text-muted-foreground'}`}>I want to Hire</span>
                                </div>
                                <div 
                                    onClick={() => setRole('freelancer')}
                                    className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${role === 'freelancer' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:bg-muted/50'}`}
                                >
                                    <UserCircle2 className={`w-6 h-6 mx-auto mb-2 ${role === 'freelancer' ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className={`text-sm font-medium ${role === 'freelancer' ? 'text-foreground' : 'text-muted-foreground'}`}>I want to Work</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

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
                                <input
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="mt-1 text-xs text-muted-foreground">Must be at least 8 characters.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all active:scale-[0.98] mt-4"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Right Pane - Visuals */}
            <div className="hidden lg:block flex-1 relative bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20 backdrop-blur-[2px]"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="max-w-lg"
                    >
                        <blockquote className="space-y-4">
                            <p className="text-2xl font-medium text-foreground leading-snug">
                                "StuGig gave me the platform to build a professional portfolio while still in college. By graduation, I already had a massive network."
                            </p>
                            <footer className="flex items-center space-x-4">
                                <img src="https://i.pravatar.cc/150?u=sarahj" alt="" className="w-12 h-12 rounded-full border-2 border-primary/50" />
                                <div>
                                    <div className="font-bold text-foreground">Sarah Jenkins</div>
                                    <div className="text-sm text-muted-foreground">UX Designer & Top Rated Freelancer</div>
                                </div>
                            </footer>
                        </blockquote>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
