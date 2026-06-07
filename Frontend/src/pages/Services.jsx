import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockServices = [
    { id: 1, title: 'Full Stack React & Node Web App', author: 'Alex Chen', rating: 4.9, reviews: 124, price: '150', category: 'Web Development', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { id: 2, title: 'Modern UI/UX Figma Design', author: 'Sarah Johnson', rating: 5.0, reviews: 89, price: '80', category: 'Design', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 3, title: 'SEO Optimized Blog Posts', author: 'Michael Smith', rating: 4.8, reviews: 210, price: '25', category: 'Writing', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400', avatar: 'https://i.pravatar.cc/150?u=michael' },
    { id: 4, title: 'Python Scripting & Automation', author: 'Emma Davis', rating: 4.9, reviews: 156, price: '50', category: 'Web Development', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400', avatar: 'https://i.pravatar.cc/150?u=emma' },
    { id: 5, title: 'Social Media Management', author: 'Olivia Wilson', rating: 4.7, reviews: 92, price: '120', category: 'Marketing', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400', avatar: 'https://i.pravatar.cc/150?u=olivia' },
    { id: 6, title: 'Video Editing for YouTube', author: 'James Lee', rating: 4.9, reviews: 178, price: '90', category: 'Video', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=400', avatar: 'https://i.pravatar.cc/150?u=james' },
];

const categories = ['All Categories', 'Web Development', 'Design', 'Writing', 'Marketing', 'Video'];

export default function Services() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [priceRange, setPriceRange] = useState(500);

    const filteredServices = mockServices.filter(s => 
        (selectedCategory === 'All Categories' || s.category === selectedCategory) &&
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        parseInt(s.price) <= priceRange
    );

    return (
        <div className="flex-1 bg-background pt-8 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header & Search */}
                <div className="mb-10 text-center md:text-left md:flex md:items-end justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Explore Services</h1>
                        <p className="text-lg text-muted-foreground">Find the perfect student freelancer for your project.</p>
                    </div>
                    
                    <div className="mt-6 md:mt-0 relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for services..."
                            className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0 space-y-8">
                        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm sticky top-24">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                                <SlidersHorizontal className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Filters</h3>
                            </div>

                            {/* Categories */}
                            <div className="mb-8">
                                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Category</h4>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center w-5 h-5">
                                                <input 
                                                    type="radio" 
                                                    name="category" 
                                                    value={cat}
                                                    checked={selectedCategory === cat}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-4 h-4 rounded-full border border-muted-foreground group-hover:border-primary peer-checked:border-primary peer-checked:border-4 transition-all"></div>
                                            </div>
                                            <span className={`text-sm transition-colors ${selectedCategory === cat ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Max Price: ${priceRange}</h4>
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="500" 
                                    step="10"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full accent-primary"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>$10</span>
                                    <span>$500+</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Services Grid */}
                    <main className="flex-1">
                        {filteredServices.length === 0 ? (
                            <div className="text-center py-20 bg-card border border-border/50 rounded-2xl">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold mb-2">No services found</h3>
                                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredServices.map((service, i) => (
                                    <motion.div 
                                        key={service.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                        className="flex flex-col rounded-2xl overflow-hidden bg-card border border-border/50 group cursor-pointer hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="h-48 overflow-hidden relative">
                                            <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-background/80 backdrop-blur-md rounded-md text-xs font-medium">
                                                {service.category}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
                                                <span className="text-white font-medium flex items-center gap-1">View Details <ArrowRight className="w-4 h-4" /></span>
                                            </div>
                                            <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex items-center gap-3 mb-3">
                                                <img src={service.avatar} alt={service.author} className="w-8 h-8 rounded-full border border-border" />
                                                <span className="text-sm font-medium">{service.author}</span>
                                            </div>
                                            <h3 className="font-bold text-foreground mb-4 line-clamp-2 leading-tight">{service.title}</h3>
                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span className="font-bold text-foreground">{service.rating}</span>
                                                    <span className="text-muted-foreground">({service.reviews})</span>
                                                </div>
                                                <div className="font-bold text-lg text-primary">From ${service.price}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
