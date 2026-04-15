import * as React from 'react';
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { UploadCloud, ArrowLeft, Image as ImageIcon, User, Layers, FileImage } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AdminUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [angle, setAngle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !angle || !previewUrl) return toast.error('Please fill in all fields and select an image');
    
    setIsLoading(true);
    try {
      const photoData = {
        name,
        angle,
        url: previewUrl,
        averageRating: 0,
        totalRatings: 0,
        createdAt: Date.now(),
      };

      await addDoc(collection(db, 'photos'), photoData);
      toast.success('Celebrity photo uploaded successfully to Cloud Database!');
      navigate('/admin/data');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'photos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Upload Data</h2>
          <p className="text-zinc-500">Add new celebrity photos to the database.</p>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-zinc-100 rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="p-10 pb-6">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
            <UploadCloud className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold">Photo Details</CardTitle>
          <CardDescription>Provide the metadata and upload an image for the new entry.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Celebrity Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input 
                  id="name" 
                  placeholder="e.g. Leonardo DiCaprio" 
                  className="pl-10 h-11 rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="angle">Photo Angle</Label>
              <div className="relative">
                <Layers className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input 
                  id="angle" 
                  placeholder="e.g. Front, Side, 45 Degree" 
                  className="pl-10 h-11 rounded-xl"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Celebrity Photo</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-zinc-300 transition-colors bg-zinc-50/50"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400">
                  <FileImage className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                  <p className="text-xs text-zinc-400">PNG, JPG or WEBP (MAX. 2MB)</p>
                </div>
              </div>
            </div>

            {previewUrl && (
              <div className="mt-8 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Preview</p>
                <div className="aspect-video rounded-xl overflow-hidden border border-zinc-200">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl font-bold bg-zinc-900 hover:bg-zinc-800 mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Photo to Database'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
