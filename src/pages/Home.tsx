import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Users, Info, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [activeUsers, setActiveUsers] = useState(1240);

  useEffect(() => {
    // Listen to global stats for active users
    const statsRef = doc(db, 'stats', 'global');
    
    const unsubscribe = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        setActiveUsers(docSnap.data().activeUsers);
      } else {
        // Initialize if doesn't exist
        setDoc(statsRef, { activeUsers: 1240 });
      }
    });

    // Simulate updates to the global counter periodically
    const interval = setInterval(async () => {
      const snap = await getDoc(statsRef);
      if (snap.exists()) {
        const current = snap.data().activeUsers;
        const variance = Math.floor(Math.random() * 10) - 5;
        await setDoc(statsRef, { activeUsers: Math.max(1000, current + variance) });
      }
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium"
        >
          <Star className="h-4 w-4 fill-current" />
          <span>The Ultimate Celebrity Face Rating Platform</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl font-extrabold tracking-tight text-zinc-900"
        >
          Rate Your Favorite <span className="text-yellow-500">Celebrities</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-600 leading-relaxed"
        >
          Join thousands of users in our community-driven face rating system. 
          Discover, rate, and track your favorite celebrity faces from around the world.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4 mt-4"
        >
          <Link to="/login">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg gap-2 shadow-lg shadow-yellow-200">
              Let's Get Started <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">How to Rate</h3>
          <p className="text-zinc-500">Simply log in, view a celebrity photo, and tap on the stars to give your rating. It's that easy!</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">About Us</h3>
          <p className="text-zinc-500">We are a team of enthusiasts dedicated to creating the most accurate celebrity face rating database.</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Total Active User</h3>
          <p className="text-zinc-500">Join our growing community of <span className="font-bold text-zinc-900">{activeUsers.toLocaleString()}</span> active users rating daily.</p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="rounded-[3rem] bg-zinc-900 text-white p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
        <div className="flex-1 flex flex-col gap-6 z-10">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to start your rating journey?</h2>
          <p className="text-zinc-400 text-lg">Create an account today and get access to exclusive celebrity galleries and personalized rating history.</p>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="rounded-full px-8 w-fit">Sign Up Now</Button>
          </Link>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 z-10">
          <img src="https://picsum.photos/seed/face1/300/400" alt="Face 1" className="rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-500" />
          <img src="https://picsum.photos/seed/face2/300/400" alt="Face 2" className="rounded-2xl -rotate-6 hover:rotate-0 transition-transform duration-500 mt-8" />
        </div>
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -ml-48 -mb-48"></div>
      </section>
    </div>
  );
}
