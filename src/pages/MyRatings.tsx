import { useState, useEffect } from 'react';
import { mockDB, CelebrityPhoto, UserRating } from '@/lib/mockFirebase';
import StarRating from '@/components/StarRating';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Edit2, Trash2, Star } from 'lucide-react';

interface MyRatingsProps {
  user: any;
}

export default function MyRatings({ user }: MyRatingsProps) {
  const [ratedPhotos, setRatedPhotos] = useState<(CelebrityPhoto & { userRating: number })[]>([]);

  useEffect(() => {
    loadRatings();
  }, [user.id]);

  const loadRatings = () => {
    const allPhotos = mockDB.getPhotos();
    const userRatings = mockDB.getUserRatings(user.id);
    
    const combined = userRatings.map(rating => {
      const photo = allPhotos.find(p => p.id === rating.photoId);
      return photo ? { ...photo, userRating: rating.rating } : null;
    }).filter(Boolean) as (CelebrityPhoto & { userRating: number })[];
    
    setRatedPhotos(combined);
  };

  const handleUpdateRating = (photoId: string, newRating: number) => {
    mockDB.ratePhoto(user.id, photoId, newRating);
    toast.success('Rating updated successfully');
    loadRatings();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h2 className="text-4xl font-bold tracking-tight">My Ratings</h2>
        <p className="text-zinc-500 mt-2">Manage and update your previously rated celebrity photos.</p>
      </div>

      {ratedPhotos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-zinc-200">
          <Star className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-900">No ratings yet</h3>
          <p className="text-zinc-500 mt-2">Start rating photos to see them here!</p>
          <Button className="mt-6 rounded-full" onClick={() => window.location.href = '/rating'}>
            Go to Rating
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ratedPhotos.map((photo) => (
            <Card key={photo.id} className="border-none shadow-lg shadow-zinc-100 rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-0 flex h-48">
                <div className="w-1/3 h-full">
                  <img 
                    src={photo.url} 
                    alt={photo.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-zinc-900">{photo.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-100 rounded text-zinc-500">
                        {photo.angle}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mt-1">Your Rating:</p>
                    <div className="mt-2">
                      <StarRating 
                        rating={photo.userRating} 
                        onRate={(r) => handleUpdateRating(photo.id, r)}
                        size="sm" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-50">
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>Avg: {photo.averageRating}</span>
                    </div>
                    <p className="text-[10px] text-zinc-300">Click stars to update</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
