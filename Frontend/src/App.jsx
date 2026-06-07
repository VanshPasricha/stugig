import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import AiMatchmaker from './pages/AiMatchmaker';
import AuthSuccess from './pages/AuthSuccess';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="stugig-ui-theme">
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/services" element={<Services />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/new" element={
                  <ProtectedRoute>
                    <PostJob />
                  </ProtectedRoute>
                } />
                <Route path="/ai-matchmaker" element={<AiMatchmaker />} />
                <Route path="/auth-success" element={<AuthSuccess />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
