import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, Sparkles, Target, DollarSign, Send, X, AlertCircle } from 'lucide-react';
import api from '../utils/axiosInterceptor';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AiMatchmaker() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [proposalText, setProposalText] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch all open jobs (in a real app, this would hit an AI matching endpoint)
                const { data } = await api.get('/api/jobs');
                setJobs(data);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleAiGenerate = async () => {
        setIsAiGenerating(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/generate-proposal', {
                jobTitle: selectedJob.title,
                jobDescription: selectedJob.description,
                budget: selectedJob.budget,
                freelancerSkills: user?.skills?.join(', ') || ''
            });
            
            setProposalText(data.coverLetter || '');
            setBidAmount(data.suggestedBid ? String(data.suggestedBid) : '');
        } catch (err) {
            setError('Failed to generate AI proposal. Please try again.');
        } finally {
            setIsAiGenerating(false);
        }
    };

    const handleSubmitProposal = async () => {
        if (!proposalText || !bidAmount) {
            setError('Please provide a bid amount and cover letter.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await api.post('/api/proposals', {
                jobId: selectedJob._id,
                coverLetter: proposalText,
                bidAmount: Number(bidAmount),
                estimatedDays: 7
            });
            
            setSelectedJob(null);
            setProposalText('');
            setBidAmount('');
            alert('Proposal submitted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit proposal');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="flex-1 flex items-center justify-center p-6 bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </main>
        );
    }

    return (
        <div className="flex-1 bg-background pt-8 pb-20">
            <div className="container mx-auto px-4 max-w-5xl space-y-12">
                <header className="text-center space-y-4 pt-10 pb-6">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6"
                    >
                        <Sparkles className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI Matchmaker</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We've analyzed your skills and portfolio to find the perfect freelance opportunities for you.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground border border-border/50 rounded-2xl bg-card">
                            No active matches found right now. Check back later!
                        </div>
                    ) : jobs.slice(0, 6).map((job, idx) => {
                        // Generate a mock match score (98% down to 80%)
                        const matchScore = 98 - (idx * 3);
                        return (
                            <motion.div 
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:border-purple-500/50 hover:shadow-md transition-all flex flex-col relative overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 font-bold text-sm rounded-full">
                                        {matchScore}% Match
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-2 line-clamp-1">{job.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                                    {job.description}
                                </p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <div className="font-bold text-lg">${job.budget}</div>
                                    <button 
                                        onClick={() => setSelectedJob(job)} 
                                        className="px-4 py-2 bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Zap className="w-4 h-4" /> Smart Bid
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* PROPOSAL MODAL */}
            <AnimatePresence>
                {selectedJob && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                            onClick={() => setSelectedJob(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-[5%] left-1/2 -translate-x-1/2 w-full max-w-3xl bg-card border border-border shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                                <div>
                                    <h2 className="text-xl font-bold">Submit Proposal</h2>
                                    <p className="text-sm text-muted-foreground mt-1">for "{selectedJob.title}"</p>
                                </div>
                                <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
                                {/* Left: Form */}
                                <div className="flex-1 space-y-6">
                                    {error && (
                                        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-sm">
                                            <AlertCircle className="w-4 h-4" /> {error}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Your Bid ($)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <input 
                                                type="number" 
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="e.g. 500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Cover Letter</label>
                                        <textarea 
                                            rows="8"
                                            value={proposalText}
                                            onChange={(e) => setProposalText(e.target.value)}
                                            className="block w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            placeholder="Introduce yourself and explain why you're a great fit for this job..."
                                        />
                                    </div>
                                </div>

                                {/* Right: AI Assistant */}
                                <div className="md:w-72 shrink-0 bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-5 self-start">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="w-5 h-5 text-purple-500" />
                                        <h3 className="font-bold text-purple-500">Smart Bidding</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                                        Let AI analyze the job description and your profile to craft a winning proposal and optimal bid amount.
                                    </p>
                                    
                                    {proposalText ? (
                                        <div className="space-y-4">
                                            <div className="p-3 bg-card border border-border/50 rounded-lg">
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Win Probability</div>
                                                <div className="text-2xl font-bold text-green-500">82%</div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                AI suggests a bid between <strong className="text-foreground">$600 - $750</strong> for this specific job.
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleAiGenerate}
                                            disabled={isAiGenerating}
                                            className="w-full flex justify-center items-center py-2 px-4 border border-purple-500/50 text-sm font-medium rounded-lg text-purple-500 bg-purple-500/10 hover:bg-purple-500 hover:text-white transition-colors disabled:opacity-50"
                                        >
                                            {isAiGenerating ? 'Analyzing...' : 'Generate AI Proposal'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
                                <button onClick={() => setSelectedJob(null)} className="px-5 py-2.5 font-medium rounded-lg hover:bg-muted transition-colors">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSubmitProposal}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
