import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Mail, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mockReviews = [
    { id: 1, author: 'TechStart Inc.', rating: 5, date: '2 weeks ago', text: 'Alex delivered the React dashboard ahead of schedule and the code quality was phenomenal. Highly recommend!' },
    { id: 2, author: 'Sarah M.', rating: 5, date: '1 month ago', text: 'Great communication and exactly what I needed. Will definitely hire again.' },
    { id: 3, author: 'Design Co', rating: 4, date: '2 months ago', text: 'Good work, just needed one minor revision on the responsive layout.' }
];

const mockPortfolio = [
    { id: 1, title: 'E-commerce Redesign', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' },
    { id: 2, title: 'Fintech Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' },
    { id: 3, title: 'Social Media App', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600' },
];

export default function PublicProfile({ isOwnProfile = false }) {
    const { user } = useAuth();
    
    // For preview, fallback to mock data if user is missing
    const profileName = isOwnProfile ? (user?.name || 'Student Freelancer') : 'Alex Chen';
    const profileRole = 'Full Stack Developer';
    const profileUniversity = 'Stanford University';

    return (
        <main className="flex-1 overflow-y-auto bg-background">
            {/* Header / Cover */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 relative">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl -mt-20 pb-20 relative z-10">
                {/* Profile Card */}
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-start mb-8 backdrop-blur-xl">
                    <div className="relative">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${profileName}&size=200&background=random`} 
                            alt={profileName} 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-card shadow-lg object-cover"
                        />
                        <div className="absolute -bottom-3 -right-3 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full border-2 border-card flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Available
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold flex items-center gap-2">
                                    {profileName} 
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </h1>
                                <p className="text-lg text-muted-foreground mt-1">{profileRole}</p>
                                
                                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileUniversity}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined Sep 2023</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 min-w-[200px]">
                                {isOwnProfile ? (
                                    <button className="w-full py-2.5 bg-muted text-foreground font-medium rounded-lg border border-border hover:bg-muted/80 transition-colors">
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
                                            Invite to Job
                                        </button>
                                        <button className="w-full py-2.5 bg-background text-foreground font-medium rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2">
                                            <Mail className="w-4 h-4" /> Message
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-6">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Reputation</p>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    <span className="text-xl font-bold">4.9</span>
                                    <span className="text-sm text-muted-foreground">(24 Reviews)</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Jobs Completed</p>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    <span className="text-xl font-bold">18</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">On-Time Delivery</p>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span className="text-xl font-bold">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: About & Skills */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4">About Me</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                I'm a senior Computer Science student passionate about building scalable web applications. I specialize in the MERN stack (MongoDB, Express, React, Node.js) and have a strong eye for UI/UX design. I love helping startups turn their ideas into reality!
                            </p>
                        </div>
                        
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'Node.js', 'Tailwind CSS', 'MongoDB', 'Figma', 'TypeScript'].map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-muted text-foreground text-xs font-medium rounded-md">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Portfolio & Reviews */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {/* Portfolio */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Portfolio</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {mockPortfolio.map((item, i) => (
                                    <motion.div 
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative rounded-xl overflow-hidden cursor-pointer border border-border"
                                    >
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                            <span className="text-white font-medium">View Project</span>
                                        </div>
                                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                                            <h4 className="text-white font-medium">{item.title}</h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Client Reviews</h3>
                            <div className="space-y-4">
                                {mockReviews.map((review) => (
                                    <div key={review.id} className="bg-card border border-border rounded-xl p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                                                    ))}
                                                </div>
                                                <span className="font-bold text-sm ml-1">{review.rating}.0</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{review.date}</span>
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{review.text}"</p>
                                        <div className="text-xs font-medium text-muted-foreground">
                                            — {review.author}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
