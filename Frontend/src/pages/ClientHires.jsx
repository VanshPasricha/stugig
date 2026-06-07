import { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';
import api from '../utils/axiosInterceptor';
import { Link } from 'react-router-dom';

export default function ClientHires() {
    const [hires, setHires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/api/jobs/dashboard');
                setHires(response.data.activeHires);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <main className="flex-1 flex items-center justify-center p-6">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-extrabold tracking-tight">Active Hires</h1>
                    <p className="text-muted-foreground mt-1">Track the progress of freelancers you have hired.</p>
                </header>

                <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden min-h-[200px]">
                    {hires.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">No active hires yet. Accept a proposal on one of your jobs to get started!</div>
                    ) : hires.map((hire, index) => (
                        <div key={hire.id} className={`p-6 flex gap-5 ${index !== hires.length - 1 ? 'border-b border-border/50' : ''}`}>
                            <img src={hire.avatar} alt={hire.name} className="w-16 h-16 rounded-full border-2 border-border" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg text-foreground">{hire.name}</h4>
                                        <p className="text-sm text-muted-foreground">{hire.role}</p>
                                    </div>
                                    <Link 
                                        to="/dashboard/messages" 
                                        state={{ 
                                            newChatUser: { 
                                                _id: hire.freelancerId, 
                                                name: hire.name, 
                                                profileImage: hire.avatar, 
                                                role: 'freelancer' 
                                            } 
                                        }}
                                        className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        Message
                                    </Link>
                                </div>
                                <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/30">
                                    <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-accent"></span> 
                                        {hire.job}
                                    </p>
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-accent h-2 rounded-full" 
                                            style={{ width: `${hire.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs font-medium text-muted-foreground">
                                        <span>Project started</span>
                                        <span>{hire.progress}% Complete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
