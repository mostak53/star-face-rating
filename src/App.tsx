import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Rating from '@/pages/Rating';
import MyRatings from '@/pages/MyRatings';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminData from '@/pages/AdminData';
import AdminUpload from '@/pages/AdminUpload';
import AdminExport from '@/pages/AdminExport';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        });
        setIsAdmin(firebaseUser.email === '252-15-974@diu.edu.bd');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
        <Navbar user={user} isAdmin={isAdmin} setUser={setUser} setIsAdmin={setIsAdmin} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} setIsAdmin={setIsAdmin} />} />
            
            {/* User Routes */}
            <Route 
              path="/rating" 
              element={user && !isAdmin ? <Rating user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/my-ratings" 
              element={user && !isAdmin ? <MyRatings user={user} /> : <Navigate to="/login" />} 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/data" 
              element={user && isAdmin ? <AdminData /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/upload" 
              element={user && isAdmin ? <AdminUpload /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/export" 
              element={user && isAdmin ? <AdminExport /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}
