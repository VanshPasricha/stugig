import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Briefcase, Zap, Loader2 } from 'lucide-react';
import api from '../utils/axiosInterceptor';
import { Link } from 'react-router-dom';

export default function FreelancerDashboard() {
    const [data, setData] = useState({
        stats: { totalEarnings: 0, activeProjects: 0, proposalsSent: 0, profileViews: 0 },
        recentJobs: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/api/jobs/freelancer/dashboard');
                setData(response.data);
            } catch (err) {
                console.error('Failed to fetch freelancer dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { label: 'Total Earnings', value: `$${data.stats.totalEarnings.toFixed(2)}`, change: '+12.5%', positive: true, icon: <DollarSign className="w-5 h-5 text-green-500" /> },
        { label: 'Active Projects', value: data.stats.activeProjects, change: 'In Progress', positive: true, icon: <Briefcase className="w-5 h-5 text-blue-500" /> },
        { label: 'Proposals Sent', value: data.stats.proposalsSent, change: 'Active Bids', positive: true, icon: <Zap className="w-5 h-5 text-accent" /> },
        { label: 'Profile Views', value: data.stats.profileViews, change: '+5.2%', positive: true, icon: <TrendingUp className="w-5 h-5 text-purple-500" /> },
    ];

    if (loading) {
        return (
            <main className="flex-1 flex items-center justify-center p-6">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-6xl mx-auto space-y-8">
                    
                    <header>
                        <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
                        <p className="text-muted-foreground mt-1">Here's what's happening with your freelance business.</p>
                    </header>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border/50 rounded-xl p-5 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg bg-muted/50">{stat.icon}</div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* ACTIVE PROJECTS TIMELINE (Mocked UI placeholder for active jobs) */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" /> Active Projects
                            </h2>
                            <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden min-h-[150px] p-6 text-center flex flex-col justify-center items-center">
                                {data.stats.activeProjects > 0 ? (
                                    <p className="text-muted-foreground">You have {data.stats.activeProjects} active project(s). Keep up the good work!</p>
                                ) : (
                                    <>
                                        <p className="text-muted-foreground mb-4">No active projects right now. Time to send some proposals!</p>
                                        <Link to="/jobs" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors text-sm">
                                            Browse Jobs
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* AI MATCHMAKER WIDGET */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-accent" /> AI Recommendations
                            </h2>
                            <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/20 blur-3xl rounded-full"></div>
                                
                                <div className="space-y-4 relative z-10">
                                    {data.recentJobs.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No new jobs posted yet. Check back later!</p>
                                    ) : (
                                        data.recentJobs.slice(0, 3).map((job, idx) => {
                                            // Mock match score for effect
                                            const matchScore = 95 - (idx * 4);
                                            return (
                                                <div key={job.id} className="bg-card border border-border/50 rounded-lg p-4 cursor-pointer hover:border-accent/50 transition-colors shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-sm font-bold line-clamp-1">{job.title}</h4>
                                                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded shrink-0">{matchScore}% Match</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
                                                    <Link to="/jobs" className="block text-center w-full py-1.5 text-xs font-medium rounded border border-border hover:bg-muted transition-colors">
                                                        View Job & Apply
                                                    </Link>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </main>
    );
}
