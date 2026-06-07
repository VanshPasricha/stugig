import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Briefcase, FileText, Users, Loader2 } from 'lucide-react';
import api from '../utils/axiosInterceptor';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
    const [data, setData] = useState({
        stats: { totalSpent: 0, activeHires: 0, jobsPosted: 0, proposalsReceived: 0 },
        postedJobs: [],
        activeHires: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/api/jobs/dashboard');
                setData(response.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Spent', value: `$${data.stats.totalSpent.toFixed(2)}`, icon: <DollarSign className="w-5 h-5 text-green-500" /> },
        { label: 'Active Hires', value: data.stats.activeHires, icon: <Users className="w-5 h-5 text-blue-500" /> },
        { label: 'Jobs Posted', value: data.stats.jobsPosted, icon: <Briefcase className="w-5 h-5 text-purple-500" /> },
        { label: 'Proposals Received', value: data.stats.proposalsReceived, icon: <FileText className="w-5 h-5 text-accent" /> },
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
                    
                    <header className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Client Hub</h1>
                            <p className="text-muted-foreground mt-1">Manage your active hires and job postings.</p>
                        </div>
                        <Link to="/jobs/new" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
                            Post New Job
                        </Link>
                    </header>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((stat, i) => (
                            <motion.div 
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border/50 rounded-xl p-5 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg bg-muted/50">{stat.icon}</div>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* RECENTLY POSTED JOBS */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" /> Posted Jobs
                            </h2>
                            <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden min-h-[100px]">
                                {data.postedJobs.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground text-sm">No jobs posted yet.</div>
                                ) : data.postedJobs.map((job, index) => (
                                    <div key={job.id} className={`p-5 ${index !== data.postedJobs.length - 1 ? 'border-b border-border/50' : ''} hover:bg-muted/30 transition-colors cursor-pointer`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-foreground">{job.title}</h4>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                                job.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                                job.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-gray-500/10 text-gray-500'
                                            }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">{job.proposals}</span> Proposals
                                            </div>
                                            <div className="text-sm font-medium text-muted-foreground">{job.posted}</div>
                                            <div className="text-sm font-medium text-foreground">{job.budget}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ACTIVE HIRES */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-accent" /> Active Hires
                            </h2>
                            <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden min-h-[100px]">
                                {data.activeHires.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground text-sm">No active hires yet. Accept a proposal to get started!</div>
                                ) : data.activeHires.map((hire, index) => (
                                    <div key={hire.id} className={`p-5 flex gap-4 ${index !== data.activeHires.length - 1 ? 'border-b border-border/50' : ''}`}>
                                        <img src={hire.avatar} alt={hire.name} className="w-12 h-12 rounded-full border border-border" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h4 className="font-bold text-foreground">{hire.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{hire.role}</p>
                                                </div>
                                                <Link to="/dashboard/messages" className="text-xs text-primary font-medium hover:underline">Message</Link>
                                            </div>
                                            <p className="text-sm font-medium text-foreground mt-3 mb-2">{hire.job}</p>
                                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className="bg-accent h-1.5 rounded-full" 
                                                    style={{ width: `${hire.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
            </div>
        </main>
    );
}
