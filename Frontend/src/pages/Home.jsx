import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Star, TrendingUp, Users, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const categories = [
    { name: 'Web Development', icon: '💻', count: '1.2k+ jobs' },
    { name: 'Graphic Design', icon: '🎨', count: '850+ jobs' },
    { name: 'Content Writing', icon: '📝', count: '920+ jobs' },
    { name: 'Video Editing', icon: '🎬', count: '430+ jobs' },
    { name: 'Digital Marketing', icon: '📈', count: '670+ jobs' },
    { name: 'Tutoring', icon: '📚', count: '1.5k+ jobs' },
];

const featuredServices = [
    {
        title: 'Full Stack React & Node Web App',
        author: 'Alex Chen',
        rating: 4.9,
        reviews: 124,
        price: 'From $150',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400',
        avatar: 'https://i.pravatar.cc/150?u=alex'
    },
    {
        title: 'Modern UI/UX Figma Design',
        author: 'Sarah Johnson',
        rating: 5.0,
        reviews: 89,
        price: 'From $80',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400',
        avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
        title: 'SEO Optimized Blog Posts',
        author: 'Michael Smith',
        rating: 4.8,
        reviews: 210,
        price: 'From $25',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400',
        avatar: 'https://i.pravatar.cc/150?u=michael'
    },
    {
        title: 'Python Scripting & Automation',
        author: 'Emma Davis',
        rating: 4.9,
        reviews: 156,
        price: 'From $50',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400',
        avatar: 'https://i.pravatar.cc/150?u=emma'
    }
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/jobs?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="flex flex-col w-full overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative min-h-[85vh] flex flex-col justify-center px-4 overflow-hidden pt-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
                
                <div className="container mx-auto max-w-6xl relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border shadow-xl shadow-primary/10 mb-8 backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 group-hover:opacity-70 transition-opacity"></div>
                            <Sparkles className="w-5 h-5 text-primary relative z-10" />
                            <span className="text-sm font-bold tracking-wide text-foreground relative z-10">Powered by AI Matchmaking</span>
                        </div>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-foreground max-w-5xl mx-auto leading-tight"
                    >
                        The freelance hub <br className="block md:hidden" />
                        for <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">ambitious students</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-center leading-relaxed"
                    >
                        Connect with peers, offer your skills, and build your professional portfolio before you even graduate.
                    </motion.p>

                    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-xl rounded-full opacity-50"></div>
                        <div className="relative flex items-center bg-card border border-border rounded-full p-2 shadow-2xl backdrop-blur-xl">
                            <Search className="w-6 h-6 text-muted-foreground ml-4 shrink-0" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="What service are you looking for?" 
                                className="flex-1 bg-transparent border-none px-4 py-3 text-foreground focus:outline-none placeholder:text-muted-foreground text-center md:text-left"
                            />
                            <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 shrink-0">
                                Search
                            </button>
                        </div>
                    </form>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-muted-foreground text-sm font-medium"
                    >
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Verified Student Network</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Secure Escrow Payments</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Zero Upfront Fees</div>
                    </motion.div>
                </div>
            </section>

            {/* SOCIAL PROOF / TRUST */}
            <section className="py-12 border-b border-border bg-background">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">Trusted by students from top universities</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-all duration-500">
                        {['Stanford', 'MIT', 'Harvard', 'UC Berkeley', 'Oxford', 'Cambridge'].map(uni => (
                            <div key={uni} className="text-xl md:text-2xl font-black tracking-tighter text-foreground/80 hover:text-primary cursor-default transition-colors">{uni}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI MATCHMAKER SHOWCASE */}
            <section className="py-24 bg-muted/30 border-y border-border">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 mb-6">
                                <Zap className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">AI Integration</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Meet your Smart Bidding Assistant
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                StuGig's proprietary AI analyzes client requirements and your portfolio to generate high-converting proposals, suggest optimal pricing, and calculate your win probability instantly.
                            </p>
                            <Link to="/signup" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all">
                                Try it now <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 blur-2xl rounded-3xl"></div>
                            <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">🤖</div>
                                        <div>
                                            <h4 className="font-bold">AI Analysis Complete</h4>
                                            <p className="text-sm text-muted-foreground">Based on your skills: React, Node.js</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-500">87%</div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Win Probability</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                                        <p className="text-sm font-medium text-foreground mb-1">Suggested Pricing</p>
                                        <p className="text-2xl font-bold text-primary">$150 - $200</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50 relative overflow-hidden group cursor-pointer hover:border-accent/50 transition-colors">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                        <p className="text-sm font-medium text-foreground mb-2">Generated Proposal</p>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            Hi there! I noticed you need a full-stack developer with React and Node.js experience. Given my recent work building scalable student platforms, I'm confident I can deliver this within your 2-week timeframe...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* POPULAR CATEGORIES */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
                            <p className="text-muted-foreground">Find the specific skills you need for your project.</p>
                        </div>
                        <Link to="/categories" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div 
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-primary/5"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-bottom-left">{cat.icon}</div>
                                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                                <p className="text-sm text-muted-foreground">{cat.count}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How StuGig Works</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-16">Your journey to earning and learning is simple, secure, and fast.</p>
                    
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 -translate-y-1/2 -z-10"></div>
                        
                        {[
                            { step: '1', title: 'Create a Profile', desc: 'Sign up and showcase your skills, portfolio, and major.' },
                            { step: '2', title: 'Find Gigs or Hire', desc: 'Browse curated student jobs or post your own project requirements.' },
                            { step: '3', title: 'Work & Get Paid', desc: 'Collaborate securely. Payments are held in escrow until completion.' }
                        ].map((item, i) => (
                            <motion.div 
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-card border border-border p-8 rounded-3xl relative z-10 hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-6 mx-auto shadow-lg shadow-primary/25">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED SERVICES */}
            <section className="py-24 bg-muted/10 border-t border-border">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Featured Services</h2>
                            <p className="text-muted-foreground">Top-rated work from our most talented student freelancers.</p>
                        </div>
                        <Link to="/services" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
                            Explore marketplace <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredServices.map((service, i) => (
                            <motion.div 
                                key={service.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex flex-col rounded-2xl overflow-hidden bg-card border border-border group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={service.avatar} alt={service.author} className="w-8 h-8 rounded-full border border-border" />
                                        <span className="text-sm font-medium">{service.author}</span>
                                    </div>
                                    <h3 className="font-bold text-foreground mb-4 line-clamp-2 hover:text-primary transition-colors">{service.title}</h3>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="font-bold">{service.rating}</span>
                                            <span className="text-muted-foreground">({service.reviews})</span>
                                        </div>
                                        <div className="font-bold text-primary">{service.price}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 blur-[100px] rounded-full opacity-50 pointer-events-none"></div>
                
                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">Ready to kickstart your freelance career?</h2>
                    <p className="text-xl text-muted-foreground mb-10">
                        Join thousands of ambitious students building their portfolios, earning income, and making connections.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:scale-105 active:scale-95">
                            Get Started for Free
                        </Link>
                        <Link to="/services" className="w-full sm:w-auto px-8 py-4 rounded-full bg-card border border-border text-foreground font-bold text-lg hover:bg-muted transition-all hover:scale-105 active:scale-95">
                            Browse Services
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
