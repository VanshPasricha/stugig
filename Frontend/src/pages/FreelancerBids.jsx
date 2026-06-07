import { useState, useEffect } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import api from '../utils/axiosInterceptor';
import { Link } from 'react-router-dom';

export default function FreelancerBids() {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const response = await api.get('/api/proposals/my');
                setBids(response.data);
            } catch (err) {
                console.error('Failed to fetch bids', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBids();
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
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Active Bids</h1>
                        <p className="text-muted-foreground mt-1">Track the status of proposals you've submitted.</p>
                    </div>
                    <Link to="/jobs" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Find Jobs
                    </Link>
                </header>

                <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden min-h-[200px]">
                    {bids.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">You haven't submitted any proposals yet.</div>
                    ) : bids.map((bid, index) => (
                        <div key={bid._id} className={`p-6 ${index !== bids.length - 1 ? 'border-b border-border/50' : ''}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-lg text-foreground">{bid.job?.title || 'Job Unavailable'}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Client: {bid.job?.client?.name || 'Unknown'}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {bid.status === 'accepted' && bid.job?.client?._id && (
                                        <Link 
                                            to="/dashboard/messages" 
                                            state={{ 
                                                newChatUser: { 
                                                    _id: bid.job.client._id, 
                                                    name: bid.job.client.name, 
                                                    profileImage: bid.job.client.profileImage, 
                                                    role: 'client' 
                                                } 
                                            }}
                                            className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                                        >
                                            Message Client
                                        </Link>
                                    )}
                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md ${
                                        bid.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                        bid.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                        'bg-blue-500/10 text-blue-500'
                                    }`}>
                                        {bid.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/30">
                                <h5 className="text-xs font-bold text-foreground mb-2 uppercase">Your Cover Letter</h5>
                                <p className="text-sm text-muted-foreground line-clamp-3">{bid.coverLetter}</p>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                                <div className="text-sm text-muted-foreground">
                                    Submitted on <span className="font-medium text-foreground">{new Date(bid.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Bid Amount</div>
                                    <div className="text-lg font-bold text-primary">${bid.bidAmount}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
