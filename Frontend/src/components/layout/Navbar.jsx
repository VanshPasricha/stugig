import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-4 md:space-x-6">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                            S
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            StuGig
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center space-x-1 ml-4">
                        <Link to="/services" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors">
                            Explore
                        </Link>
                        <Link to="/jobs" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors">
                            Jobs
                        </Link>
                        <Link to="/ai-matchmaker" className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-purple-500 bg-purple-500/10 hover:bg-purple-500 hover:text-white rounded-full transition-colors">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Matchmaker</span>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {user ? (
                        <div className="flex items-center space-x-2">
                            <Link 
                                to="/dashboard" 
                                className="px-4 py-2 text-sm font-medium border border-border rounded-full hover:bg-muted/50 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
