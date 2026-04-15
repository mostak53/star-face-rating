import { useState, useEffect } from 'react';
import { mockDB, CelebrityPhoto } from '@/lib/mockFirebase';
import StarRating from '@/components/StarRating';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface RatingProps {
  user: any;
}

export default function Rating({ user }: RatingProps) {
  const [photos, setPhotos] = useState<CelebrityPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const allPhotos = mockDB.getPhotos();
      const userRatings = mockDB.getUserRatings(user.id);
      const unratedPhotos = allPhotos.filter(p => !userRatings.some(r => r.photoId === p.id));
      setPhotos(unratedPhotos);
      setIsLoading(false);
    };

    loadData();
    window.addEventListener('face_rating_updated', loadData);
    return () => window.removeEventListener('face_rating_updated', loadData);
  }, [user.id]);

  const handleRate = (rating: number) => {
    const currentPhoto = photos[currentIndex];
    mockDB.ratePhoto(user.id, currentPhoto.id, rating);
    
    toast.success(`Rated ${currentPhoto.name} ${rating} stars!`);
    
    // Move to next photo after a short delay
    setTimeout(() => {
      if (currentIndex < photos.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // No more photos
        setPhotos([]);
      }
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-bold">All Caught Up!</h2>
        <p className="text-zinc-500 max-w-md">You've rated all available photos. Check back later for more or view your ratings in the "My Ratings" section.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full">
          Refresh List
        </Button>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rate Photos</h2>
          <p className="text-zinc-500">Showing {currentIndex + 1} of {photos.length} unrated photos</p>
        </div>
        <div className="text-sm font-medium px-3 py-1 bg-zinc-100 rounded-full">
          {currentPhoto.angle} View
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-none shadow-2xl shadow-zinc-200 rounded-[2.5rem] overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={currentPhoto.url} 
                  alt={currentPhoto.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                  <h3 className="text-2xl font-bold">{currentPhoto.name}</h3>
                  <p className="text-zinc-300 text-sm opacity-80">{currentPhoto.angle} Angle</p>
                </div>
              </div>
              
              <div className="p-10 flex flex-col items-center gap-6">
                <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Tap a star to rate</p>
                <StarRating rating={0} onRate={handleRate} size="lg" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex justify-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentIndex(prev => (prev + 1) % photos.length)}
          className="text-zinc-400 hover:text-zinc-900"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}
