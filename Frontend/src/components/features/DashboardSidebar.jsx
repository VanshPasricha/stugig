import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    Briefcase, 
    MessageSquare, 
    Star, 
    CreditCard, 
    Settings, 
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardSidebar() {
    const { user } = useAuth();
    const location = useLocation();

    // Default to freelancer role if none provided for preview
    const role = user?.role || 'freelancer';

    const freelancerLinks = [
        { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'My Services', path: '/dashboard/services', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Active Bids', path: '/dashboard/bids', icon: <Zap className="w-5 h-5" /> },
        { name: 'Messages', path: '/dashboard/messages', icon: <MessageSquare className="w-5 h-5" /> },
        { name: 'Earnings', path: '/dashboard/earnings', icon: <CreditCard className="w-5 h-5" /> },
        { name: 'Reviews', path: '/dashboard/reviews', icon: <Star className="w-5 h-5" /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    const clientLinks = [
        { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Posted Jobs', path: '/dashboard/jobs', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Active Hires', path: '/dashboard/hires', icon: <Star className="w-5 h-5" /> },
        { name: 'Messages', path: '/dashboard/messages', icon: <MessageSquare className="w-5 h-5" /> },
        { name: 'Billing', path: '/dashboard/billing', icon: <CreditCard className="w-5 h-5" /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    const links = role === 'client' ? clientLinks : freelancerLinks;

    return (
        <div className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-md hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
            <div className="p-6 pb-2 border-b border-border/50">
                <div className="flex items-center gap-3 mb-6">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-lg shadow-md"
                    />
                    <div>
                        <h3 className="font-bold text-sm text-foreground line-clamp-1">{user?.name || 'Student Freelancer'}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{role}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                isActive 
                                ? 'text-primary' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className="relative z-10">{link.icon}</div>
                            <span className="relative z-10">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <div className="bg-gradient-to-tr from-accent/10 to-primary/10 border border-accent/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="text-xs font-bold uppercase text-accent">Pro Status</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                        Upgrade to boost your proposals with advanced AI.
                    </p>
                    <button className="w-full py-1.5 text-xs font-bold rounded-md bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
}
