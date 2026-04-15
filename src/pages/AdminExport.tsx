import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, ArrowLeft, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockDB } from '@/lib/mockFirebase';
import * as XLSX from 'xlsx';

export default function AdminExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      const photos = mockDB.getPhotos();
      
      // Prepare data for Excel
      const exportData = photos.map(photo => ({
        'Celebrity Name': photo.name,
        'Angle': photo.angle,
        'Average Rating': photo.averageRating,
        'Total Ratings': photo.totalRatings,
        'Photo URL': photo.url
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Celebrity Ratings');

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, `Celebrity_Face_Ratings_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Excel file exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
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
          <h2 className="text-3xl font-bold tracking-tight">Export Data</h2>
          <p className="text-zinc-500">Download rating reports in Excel format.</p>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-zinc-100 rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="p-10 pb-6">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6">
            <FileSpreadsheet className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold">Generate Report</CardTitle>
          <CardDescription>Click the button below to generate a comprehensive Excel report of all celebrity ratings.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0 space-y-8">
          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
            <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-zinc-400">Included Fields</h4>
            <ul className="grid grid-cols-2 gap-3">
              {[
                'Celebrity Name', 
                'Photo Angle', 
                'Average Rating', 
                'Total Ratings', 
                'Image Source URL',
                'Export Timestamp'
              ].map((field, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {field}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-700 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>The exported file will be in .xlsx format and can be opened in Microsoft Excel, Google Sheets, or any compatible spreadsheet software.</p>
          </div>

          <Button 
            onClick={handleExport} 
            className="w-full h-14 rounded-2xl font-bold bg-zinc-900 hover:bg-zinc-800 gap-3 text-lg"
            disabled={isExporting}
          >
            {isExporting ? (
              'Generating Report...'
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download Excel Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
