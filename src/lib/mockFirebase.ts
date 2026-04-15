
// Real-time simulation using BroadcastChannel and localStorage
export interface CelebrityPhoto {
  id: string;
  name: string;
  angle: string;
  url: string; // This will now store Base64 data or external URLs
  averageRating: number;
  totalRatings: number;
}

export interface UserRating {
  id: string;
  userId: string;
  photoId: string;
  rating: number;
  timestamp: number;
}

const INITIAL_PHOTOS: CelebrityPhoto[] = [
  {
    id: '1',
    name: 'Leonardo DiCaprio',
    angle: 'Front',
    url: 'https://picsum.photos/seed/leo/400/500',
    averageRating: 4.5,
    totalRatings: 120,
  },
  {
    id: '2',
    name: 'Scarlett Johansson',
    angle: 'Side',
    url: 'https://picsum.photos/seed/scarlett/400/500',
    averageRating: 4.8,
    totalRatings: 250,
  },
];

class MockDB {
  private photos: CelebrityPhoto[] = [];
  private ratings: UserRating[] = [];
  private channel = new BroadcastChannel('face_rating_sync');
  private activeUsersCount = 1; // Default to 1

  constructor() {
    this.loadFromStorage();
    this.setupSync();
    this.simulateActiveUsers();
  }

  private loadFromStorage() {
    const savedPhotos = localStorage.getItem('face_rating_photos');
    const savedRatings = localStorage.getItem('face_rating_ratings');
    
    this.photos = savedPhotos ? JSON.parse(savedPhotos) : INITIAL_PHOTOS;
    this.ratings = savedRatings ? JSON.parse(savedRatings) : [];
  }

  private saveToStorage() {
    localStorage.setItem('face_rating_photos', JSON.stringify(this.photos));
    localStorage.setItem('face_rating_ratings', JSON.stringify(this.ratings));
    this.channel.postMessage({ type: 'SYNC_DATA' });
  }

  private setupSync() {
    this.channel.onmessage = (event) => {
      if (event.data.type === 'SYNC_DATA') {
        this.loadFromStorage();
        // Trigger a custom event for React components to listen to
        window.dispatchEvent(new CustomEvent('face_rating_updated'));
      }
      if (event.data.type === 'ACTIVE_USERS_UPDATE') {
        this.activeUsersCount = event.data.count;
        window.dispatchEvent(new CustomEvent('active_users_updated', { detail: this.activeUsersCount }));
      }
    };
  }

  private simulateActiveUsers() {
    // Simulate a dynamic number of active users
    setInterval(() => {
      const base = 1240;
      const variance = Math.floor(Math.random() * 50) - 25;
      this.activeUsersCount = base + variance;
      this.channel.postMessage({ type: 'ACTIVE_USERS_UPDATE', count: this.activeUsersCount });
      window.dispatchEvent(new CustomEvent('active_users_updated', { detail: this.activeUsersCount }));
    }, 5000);
  }

  registerUser(username: string, password: string) {
    const users = JSON.parse(localStorage.getItem('face_rating_users') || '[]');
    if (users.find((u: any) => u.username === username)) {
      throw new Error('Username already exists');
    }
    const newUser = { id: 'user_' + Math.random().toString(36).substr(2, 5), username, password };
    users.push(newUser);
    localStorage.setItem('face_rating_users', JSON.stringify(users));
    return newUser;
  }

  loginUser(username: string, password: string) {
    const users = JSON.parse(localStorage.getItem('face_rating_users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    return user;
  }

  getActiveUsers() {
    return this.activeUsersCount;
  }

  getPhotos() {
    return this.photos;
  }

  addPhoto(photo: Omit<CelebrityPhoto, 'id' | 'averageRating' | 'totalRatings'>) {
    const newPhoto: CelebrityPhoto = {
      ...photo,
      id: Math.random().toString(36).substr(2, 9),
      averageRating: 0,
      totalRatings: 0,
    };
    this.photos.push(newPhoto);
    this.saveToStorage();
    return newPhoto;
  }

  deletePhoto(id: string) {
    this.photos = this.photos.filter(p => p.id !== id);
    this.ratings = this.ratings.filter(r => r.photoId !== id);
    this.saveToStorage();
  }

  updatePhoto(id: string, updates: Partial<CelebrityPhoto>) {
    this.photos = this.photos.map(p => p.id === id ? { ...p, ...updates } : p);
    this.saveToStorage();
  }

  ratePhoto(userId: string, photoId: string, rating: number) {
    const existingIndex = this.ratings.findIndex(r => r.userId === userId && r.photoId === photoId);
    if (existingIndex > -1) {
      this.ratings[existingIndex].rating = rating;
      this.ratings[existingIndex].timestamp = Date.now();
    } else {
      this.ratings.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        photoId,
        rating,
        timestamp: Date.now(),
      });
    }
    this.updateAverages(photoId);
    this.saveToStorage();
  }

  private updateAverages(photoId: string) {
    const photoRatings = this.ratings.filter(r => r.photoId === photoId);
    const total = photoRatings.length;
    const sum = photoRatings.reduce((acc, r) => acc + r.rating, 0);
    const average = total > 0 ? sum / total : 0;
    
    this.photos = this.photos.map(p => p.id === photoId ? {
      ...p,
      averageRating: Number(average.toFixed(1)),
      totalRatings: total,
    } : p);
  }

  getUserRatings(userId: string) {
    return this.ratings.filter(r => r.userId === userId);
  }

  getAllRatings() {
    return this.ratings;
  }
}

export const mockDB = new MockDB();
