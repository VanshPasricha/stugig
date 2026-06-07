import { useState, useEffect } from 'react';
import { Briefcase, Loader2, CheckCircle2, User } from 'lucide-react';
import api from '../utils/axiosInterceptor';
import { Link } from 'react-router-dom';

export default function ClientJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [proposals, setProposals] = useState({});
    const [loadingProposals, setLoadingProposals] = useState(false);
    const [acceptingProposalId, setAcceptingProposalId] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/api/jobs/dashboard');
            setJobs(response.data.postedJobs);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const toggleJobProposals = async (jobId, proposalsCount) => {
        if (expandedJobId === jobId) {
            setExpandedJobId(null);
            return;
        }
        
        setExpandedJobId(jobId);
        
        if (proposalsCount > 0 && !proposals[jobId]) {
            setLoadingProposals(true);
            try {
                const response = await api.get(`/api/proposals/job/${jobId}`);
                setProposals(prev => ({ ...prev, [jobId]: response.data }));
            } catch (err) {
                console.error('Failed to fetch proposals', err);
            } finally {
                setLoadingProposals(false);
            }
        }
    };

    const handleAcceptProposal = async (proposalId, jobId) => {
        if (!window.confirm('Are you sure you want to accept this proposal and hire the freelancer?')) return;
        
        setAcceptingProposalId(proposalId);
        try {
            await api.put(`/api/proposals/${proposalId}/accept`);
            alert('Proposal accepted successfully! The freelancer has been hired.');
            // Refresh data
            await fetchDashboardData();
            // Refresh proposals for this job
            const response = await api.get(`/api/proposals/job/${jobId}`);
            setProposals(prev => ({ ...prev, [jobId]: response.data }));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept proposal');
        } finally {
            setAcceptingProposalId(null);
        }
    };

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
                        <h1 className="text-3xl font-extrabold tracking-tight">Posted Jobs</h1>
                        <p className="text-muted-foreground mt-1">Manage all the jobs you have posted on StuGig.</p>
                    </div>
                    <Link to="/jobs/new" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
                        Post New Job
                    </Link>
                </header>

                <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden min-h-[200px]">
                    {jobs.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">No jobs posted yet. Click "Post New Job" to get started!</div>
                    ) : jobs.map((job, index) => (
                        <div key={job.id} className={`${index !== jobs.length - 1 ? 'border-b border-border/50' : ''}`}>
                            <div 
                                onClick={() => toggleJobProposals(job.id, job.proposals)}
                                className="p-6 hover:bg-muted/30 transition-colors cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-lg text-foreground">{job.title}</h4>
                                        <div className="text-sm font-medium text-muted-foreground mt-1">{job.posted}</div>
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md ${
                                        job.status === 'Active' || job.status === 'open' ? 'bg-green-500/10 text-green-500' :
                                        job.status === 'In Progress' || job.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-gray-500/10 text-gray-500'
                                    }`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                                    <div className="text-sm">
                                        <span className="font-bold text-foreground text-lg">{job.proposals}</span> <span className="text-muted-foreground">Proposals Received</span>
                                        {job.proposals > 0 && (
                                            <span className="text-accent ml-2 text-xs font-medium">
                                                (Click to {expandedJobId === job.id ? 'hide' : 'view'})
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-lg font-bold text-foreground">{job.budget}</div>
                                </div>
                            </div>

                            {/* Proposals Expanded View */}
                            {expandedJobId === job.id && job.proposals > 0 && (
                                <div className="bg-muted/10 p-6 border-t border-border/30 shadow-inner">
                                    <h5 className="font-bold mb-4">Proposals for {job.title}</h5>
                                    {loadingProposals ? (
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin"/> Loading proposals...</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {proposals[job.id]?.length > 0 ? proposals[job.id].map(proposal => (
                                                <div key={proposal._id} className="bg-background border border-border rounded-lg p-5">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                                {proposal.freelancer?.name?.charAt(0) || <User className="w-5 h-5"/>}
                                                            </div>
                                                            <div>
                                                                <h6 className="font-bold text-sm">{proposal.freelancer?.name || 'Unknown Freelancer'}</h6>
                                                                <span className="text-xs text-muted-foreground">Bid: ${proposal.bidAmount} • {proposal.estimatedDays} Days</span>
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                                            proposal.status === 'accepted' ? 'text-green-500 bg-green-500/10' :
                                                            proposal.status === 'rejected' ? 'text-red-500 bg-red-500/10' :
                                                            'text-blue-500 bg-blue-500/10'
                                                        }`}>
                                                            {proposal.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-foreground/80 bg-muted/30 p-3 rounded-md mb-4 border border-border/20">
                                                        {proposal.coverLetter}
                                                    </div>
                                                    {proposal.status === 'pending' && job.status !== 'in_progress' && (
                                                        <button 
                                                            onClick={() => handleAcceptProposal(proposal._id, job.id)}
                                                            disabled={acceptingProposalId === proposal._id}
                                                            className="w-full py-2 bg-accent text-accent-foreground font-medium rounded shadow-sm hover:bg-accent/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 text-sm"
                                                        >
                                                            {acceptingProposalId === proposal._id ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>}
                                                            Accept & Hire
                                                        </button>
                                                    )}
                                                </div>
                                            )) : (
                                                <div className="text-sm text-muted-foreground">Could not load proposals.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
