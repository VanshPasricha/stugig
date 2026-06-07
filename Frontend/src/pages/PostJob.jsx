import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowLeft, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInterceptor';

const STEPS = [
    { id: 1, name: 'Job Details' },
    { id: 2, name: 'Budget & Scope' },
    { id: 3, name: 'Review' }
];

export default function PostJob() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [budgetType, setBudgetType] = useState('fixed'); // fixed or hourly
    const [budget, setBudget] = useState('');

    const handleNext = async () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(c => c + 1);
        } else {
            // Submit form to API
            setIsSubmitting(true);
            setError('');
            try {
                await api.post('/api/jobs', {
                    title,
                    description,
                    category,
                    budgetType,
                    budget: Number(budget)
                });
                navigate('/dashboard'); 
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to post job');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(c => c - 1);
        }
    };

    return (
        <div className="flex-1 bg-background pt-8 pb-20">
            <div className="container mx-auto px-4 max-w-3xl">
                
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Post a New Job</h1>
                    <p className="text-muted-foreground">Find the perfect student freelancer for your needs.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: '0%' }}
                            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="relative flex justify-between">
                        {STEPS.map((step) => (
                            <div key={step.id} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                                    currentStep > step.id ? 'bg-primary text-primary-foreground' :
                                    currentStep === step.id ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                                    'bg-card border-2 border-border text-muted-foreground'
                                }`}>
                                    {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                                </div>
                                <span className={`text-xs font-medium hidden sm:block ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wizard Container */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        
                        {/* STEP 1: DETAILS */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Job Details</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Let's start with a strong title and description.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Job Title</label>
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Build a responsive React dashboard"
                                        className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select 
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="web">Web Development</option>
                                        <option value="design">UI/UX Design</option>
                                        <option value="writing">Content Writing</option>
                                        <option value="marketing">Digital Marketing</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea 
                                        rows="5"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Describe your project in detail..."
                                        className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: BUDGET & SCOPE */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Budget & Scope</h2>
                                    <p className="text-sm text-muted-foreground mb-6">How much are you looking to spend?</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div 
                                        onClick={() => setBudgetType('fixed')}
                                        className={`cursor-pointer rounded-xl border-2 p-5 text-center transition-all ${budgetType === 'fixed' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                                    >
                                        <h4 className="font-bold text-foreground mb-1">Fixed Price</h4>
                                        <p className="text-xs text-muted-foreground">Pay a set amount for the entire project.</p>
                                    </div>
                                    <div 
                                        onClick={() => setBudgetType('hourly')}
                                        className={`cursor-pointer rounded-xl border-2 p-5 text-center transition-all ${budgetType === 'hourly' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                                    >
                                        <h4 className="font-bold text-foreground mb-1">Hourly Rate</h4>
                                        <p className="text-xs text-muted-foreground">Pay per hour of work tracked.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Estimated Budget ($)</label>
                                    <input 
                                        type="number" 
                                        value={budget}
                                        onChange={e => setBudget(e.target.value)}
                                        placeholder={budgetType === 'fixed' ? 'e.g. 500' : 'e.g. 25/hr'}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div className="pt-4">
                                    <label className="block text-sm font-medium mb-2">Attachments (Optional)</label>
                                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center">
                                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                                        <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, PNG, JPG (max. 10MB)</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: REVIEW */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Review & Post</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Make sure everything looks good before posting.</p>
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
                                        {error}
                                    </div>
                                )}

                                <div className="bg-background rounded-xl border border-border p-6 space-y-4">
                                    <div>
                                        <h4 className="text-xs uppercase text-muted-foreground font-bold tracking-wider mb-1">Title</h4>
                                        <p className="text-foreground font-medium text-lg">{title || 'Untitled Job'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                        <div>
                                            <h4 className="text-xs uppercase text-muted-foreground font-bold tracking-wider mb-1">Category</h4>
                                            <p className="text-foreground font-medium capitalize">{category || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase text-muted-foreground font-bold tracking-wider mb-1">Budget</h4>
                                            <p className="text-foreground font-medium">${budget || '0'} {budgetType === 'hourly' && '/ hr'}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border/50">
                                        <h4 className="text-xs uppercase text-muted-foreground font-bold tracking-wider mb-1">Description</h4>
                                        <p className="text-foreground text-sm whitespace-pre-wrap">{description || 'No description provided.'}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm text-accent-foreground flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-accent" />
                                    <p>Your job will be reviewed by our team and posted to the marketplace within 1 hour. AI matching will begin immediately upon approval.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-10 flex justify-between border-t border-border/50 pt-6">
                        <button 
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                            className="px-6 py-2.5 rounded-lg font-medium border border-border hover:bg-muted transition-colors disabled:opacity-0 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="px-8 py-2.5 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Posting...' : currentStep === STEPS.length ? 'Post Job Now' : 'Continue'}
                            {currentStep !== STEPS.length && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
