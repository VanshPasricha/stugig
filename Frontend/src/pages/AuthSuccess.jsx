import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginWithToken } = useAuth(); // We need to add this to AuthContext

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const userStr = queryParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                
                // Store in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // We'll update the AuthContext state by forcing a reload 
                // or if we have a loginWithToken method, we can call it.
                // For simplicity, a page reload guarantees the context picks it up from localStorage.
                window.location.href = '/dashboard';
            } catch (err) {
                console.error('Failed to parse OAuth user data', err);
                navigate('/login?error=invalid_oauth_data');
            }
        } else {
            navigate('/login?error=missing_oauth_data');
        }
    }, [location, navigate]);

    return (
        <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-bold">Authenticating securely...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we log you in.</p>
        </main>
    );
}
