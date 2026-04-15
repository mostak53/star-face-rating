import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit, Trash2, Search, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminData() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'photos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPhotos(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'photos');
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this photo from the Cloud Database?')) {
      try {
        await deleteDoc(doc(db, 'photos', id));
        toast.success('Photo deleted successfully');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `photos/${id}`);
      }
    }
  };

  const handleEdit = (photo: any) => {
    setEditingPhoto({ ...photo });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPhoto) return;
    try {
      const { id, ...data } = editingPhoto;
      await updateDoc(doc(db, 'photos', id), data);
      setIsEditDialogOpen(false);
      toast.success('Photo updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `photos/${editingPhoto.id}`);
    }
  };

  const filteredPhotos = photos.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Total Data</h2>
          <p className="text-zinc-500">Manage all celebrity photos in the system.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-zinc-100/50 border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search by celebrity name..." 
              className="pl-10 rounded-xl h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-sm text-zinc-400 font-medium">{filteredPhotos.length} Photos Found</p>
        </div>

        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="w-[100px]">Photo</TableHead>
              <TableHead>Celebrity Name</TableHead>
              <TableHead>Angle</TableHead>
              <TableHead>Avg Rating</TableHead>
              <TableHead>Total Ratings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPhotos.map((photo) => (
              <TableRow key={photo.id} className="hover:bg-zinc-50/50 transition-colors">
                <TableCell>
                  <img 
                    src={photo.url} 
                    alt={photo.name} 
                    className="h-12 w-12 rounded-lg object-cover border border-zinc-100"
                    referrerPolicy="no-referrer"
                  />
                </TableCell>
                <TableCell className="font-bold text-zinc-900">{photo.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-zinc-100 rounded-md text-xs font-medium text-zinc-600">
                    {photo.angle}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-bold text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    {photo.averageRating}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-500">{photo.totalRatings}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(photo)} className="h-9 w-9 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(photo.id)} className="h-9 w-9 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-[2rem] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Photo Data</DialogTitle>
          </DialogHeader>
          {editingPhoto && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Celebrity Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingPhoto.name} 
                  onChange={(e) => setEditingPhoto({...editingPhoto, name: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-angle">Angle</Label>
                <Input 
                  id="edit-angle" 
                  value={editingPhoto.angle} 
                  onChange={(e) => setEditingPhoto({...editingPhoto, angle: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">Photo URL</Label>
                <Input 
                  id="edit-url" 
                  value={editingPhoto.url} 
                  onChange={(e) => setEditingPhoto({...editingPhoto, url: e.target.value})}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleUpdate} className="rounded-xl bg-zinc-900">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
