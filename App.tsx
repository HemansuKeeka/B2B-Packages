import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase.ts';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import HomePage from './pages/HomePage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import HistoryPage from './pages/HistoryPage.tsx';
import SuccessPage from './pages/SuccessPage.tsx';
import Navigation from './components/Navigation.tsx';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {session && <Navigation />}
        <main className={session ? "pt-4" : ""}>
          <Routes>
            <Route 
              path="/" 
              element={session ? <Navigate to="/home" /> : <LoginPage />} 
            />
            <Route 
              path="/register" 
              element={session ? <Navigate to="/home" /> : <RegisterPage />} 
            />
            <Route 
              path="/home" 
              element={session ? <HomePage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/dashboard" 
              element={session ? <DashboardPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/history" 
              element={session ? <HistoryPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/success" 
              element={session ? <SuccessPage /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;