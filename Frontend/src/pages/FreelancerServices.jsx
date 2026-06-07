import { useState, useEffect } from 'react';
import { Briefcase, Loader2, Plus } from 'lucide-react';
import api from '../utils/axiosInterceptor';

export default function FreelancerServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [category, setCategory] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchServices = async () => {
        try {
            const response = await api.get('/api/services/my');
            setServices(response.data);
        } catch (err) {
            console.error('Failed to fetch services', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/api/services', {
                title,
                description,
                price: Number(price),
                deliveryTime,
                category
            });
            // Reset form and reload
            setShowForm(false);
            setTitle('');
            setDescription('');
            setPrice('');
            setDeliveryTime('');
            setCategory('');
            setLoading(true);
            fetchServices();
        } catch (error) {
            console.error('Failed to create service', error);
        } finally {
            setSubmitting(false);
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
                        <h1 className="text-3xl font-extrabold tracking-tight">My Services</h1>
                        <p className="text-muted-foreground mt-1">Manage the predefined services you offer to clients.</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Service</>}
                    </button>
                </header>

                {showForm && (
                    <div className="bg-card border border-border/50 rounded-xl shadow-sm p-6 mb-8">
                        <h3 className="text-xl font-bold mb-4">Create New Service</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Service Title</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. I will design a modern logo" 
                                        className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Category</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g. Graphic Design" 
                                        className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Price ($)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        min="5"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="50" 
                                        className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Delivery Time</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={deliveryTime}
                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                        placeholder="e.g. 3 Days" 
                                        className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Description</label>
                                <textarea 
                                    required 
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what you offer in detail..." 
                                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Service'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.length === 0 && !showForm ? (
                        <div className="col-span-full p-10 text-center text-muted-foreground border border-border/50 rounded-xl bg-card">
                            You haven't created any services yet.
                        </div>
                    ) : services.map((service) => (
                        <div key={service._id} className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs font-medium text-primary mb-2 inline-block">{service.category}</span>
                                    <h4 className="font-bold text-lg text-foreground line-clamp-2">{service.title}</h4>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                                {service.description}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4" /> {service.deliveryTime}
                                </div>
                                <div className="text-xl font-bold text-foreground">
                                    ${service.price}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
