import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import BlogsPage from './pages/blog/BlogsPage';
import BlogDetailPage from './pages/blog/BlogDetailPage';
import {
  TravelPage,
  SportsPage,
  CommunitiesPage,
  ProfilePage,
  WritePage,
  AnalyticsPage,
  BookmarksPage,
  ExplorePage,
  AITravelPlannerPage,
  LeaderboardPage,
  SettingsPage,
  DestinationDetailPage,
  SportsDetailPage,
  CommunityDetailPage,
} from './pages/AllPages';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Dashboard layout (with sidebar)
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 ml-64 pt-16 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}

// Public layout (with navbar + footer)
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const authPages = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public landing */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ExplorePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BlogsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BlogDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <WritePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/travel"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TravelPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/travel/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DestinationDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SportsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sports/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SportsDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CommunitiesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities/:slug"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CommunityDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BookmarksPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-planner"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AITravelPlannerPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <LeaderboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="text-8xl mb-6">🗺️</div>
                <h1 className="text-4xl font-black text-slate-900 mb-3">Page Not Found</h1>
                <p className="text-slate-500 mb-8 text-lg">Looks like this destination doesn't exist on our map.</p>
                <a href="/" className="btn-primary text-lg px-8 py-4">Back to Home</a>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
