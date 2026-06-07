import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Save, User, Lock, Bell, Palette } from 'lucide-react';

export default function Settings() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    
    // Settings state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    return (
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your account preferences and profile.</p>
                </header>

                <div className="grid gap-8">
                    {/* PROFILE SETTINGS */}
                    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Profile Information</h2>
                        </div>
                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Role</label>
                                <input 
                                    type="text" 
                                    disabled
                                    value={user?.role || 'Guest'}
                                    className="w-full px-4 py-2 bg-muted/50 text-muted-foreground border border-border/50 rounded-lg text-sm cursor-not-allowed"
                                />
                            </div>
                            <button className="px-5 py-2 mt-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Profile
                            </button>
                        </div>
                    </div>

                    {/* PREFERENCES */}
                    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Palette className="w-5 h-5 text-accent" />
                            <h2 className="text-xl font-bold">Preferences</h2>
                        </div>
                        <div className="space-y-6 max-w-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Theme Appearance</h4>
                                    <p className="text-sm text-muted-foreground">Toggle between light and dark mode.</p>
                                </div>
                                <select 
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="px-3 py-1.5 bg-background border border-border/50 rounded-lg text-sm focus:outline-none"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5"><Bell className="w-5 h-5 text-muted-foreground" /></div>
                                    <div>
                                        <h4 className="font-medium">Email Notifications</h4>
                                        <p className="text-sm text-muted-foreground">Receive updates on bids and messages.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={notifications}
                                        onChange={() => setNotifications(!notifications)}
                                    />
                                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* SECURITY */}
                    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Lock className="w-5 h-5 text-destructive" />
                            <h2 className="text-xl font-bold">Security</h2>
                        </div>
                        <div className="space-y-4 max-w-lg">
                            <button className="w-full md:w-auto px-5 py-2 border border-border font-medium rounded-lg hover:bg-muted transition-colors text-sm">
                                Change Password
                            </button>
                            <p className="text-xs text-muted-foreground mt-2">
                                For security reasons, changing your password will log you out of all active sessions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
