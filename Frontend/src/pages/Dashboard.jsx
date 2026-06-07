import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/features/DashboardSidebar';
import FreelancerDashboard from './FreelancerDashboard';
import FreelancerServices from './FreelancerServices';
import FreelancerBids from './FreelancerBids';
import ClientDashboard from './ClientDashboard';
import ClientJobs from './ClientJobs';
import ClientHires from './ClientHires';
import Settings from './Settings';
import Messages from './Messages';
import Wallet from './Wallet';
import PublicProfile from './PublicProfile';

export default function Dashboard() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const role = user?.role || 'freelancer'; // Default for preview

    return (
        <div className="flex flex-1 min-h-[calc(100vh-4rem)] bg-background">
            <DashboardSidebar />
            <div className="flex-1 overflow-hidden flex flex-col">
                <Routes>
                    <Route 
                        path="/" 
                        element={role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />} 
                    />
                    <Route path="/jobs" element={<ClientJobs />} />
                    <Route path="/hires" element={<ClientHires />} />
                    <Route path="/services" element={<FreelancerServices />} />
                    <Route path="/bids" element={<FreelancerBids />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/earnings" element={<Wallet />} />
                    <Route path="/billing" element={<Wallet />} />
                    <Route path="/reviews" element={<PublicProfile isOwnProfile={true} />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </div>
    );
}
