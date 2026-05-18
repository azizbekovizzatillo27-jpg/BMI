import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastNotifications from './components/ToastNotifications';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StaffPage from './pages/StaffPage';
import StaffDetailPage from './pages/StaffDetailPage';
import ProgramsPage from './pages/ProgramsPage';
import SchedulePage from './pages/SchedulePage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ResearchPage from './pages/ResearchPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import OAuthSuccess from './pages/OAuthSuccess';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

import FloatingBot from './components/FloatingBot';

function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
      <FloatingBot />
      <ToastNotifications />
    </div>
  );
}

function AdminLayout({ children }) {
  return (
    <div>
      {children}
      <ToastNotifications />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Admin - separate layout */}
          <Route path="/admin/*" element={
            <AdminLayout>
              <AdminPage />
            </AdminLayout>
          } />

          {/* Public pages - main layout */}
          <Route path="/*" element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/staff/:id" element={<StaffDetailPage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/auth-success" element={<OAuthSuccess />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppLayout>
          } />
        </Routes>
      </Router>
    </AppProvider>
  );
}
