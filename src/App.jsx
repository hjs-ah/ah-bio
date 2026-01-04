
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ThemeToggle from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/lib/ThemeContext';
import PublicProfile from '@/pages/PublicProfile';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import { fetchAndSyncData } from '@/lib/storage';

function App() {
  
  // Hydrate local storage from Supabase on app load
  useEffect(() => {
    fetchAndSyncData();
  }, []);

  return (
    <ThemeProvider>
      <Helmet>
        <title>Antone Holmes - Teacher & Coach</title>
        <meta name="description" content="Antone Holmes - Teacher, Coach, and Author. Explore my work and connect with me." />
      </Helmet>
      
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300">
        <ThemeToggle />
        
        <Router>
          <Routes>
            <Route path="/" element={<PublicProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
