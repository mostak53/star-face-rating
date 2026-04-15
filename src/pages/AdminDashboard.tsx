import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  UploadCloud, 
  Download, 
  Users, 
  Star, 
  Image as ImageIcon,
  ArrowUpRight
} from 'lucide-react';
import { mockDB } from '@/lib/mockFirebase';

export default function AdminDashboard() {
  const photos = mockDB.getPhotos();
  const ratings = mockDB.getAllRatings();
  
  const stats = [
    { title: 'Total Photos', value: photos.length, icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Ratings', value: ratings.length, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Active Users', value: 1240, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const menuItems = [
    { title: 'Total Data', description: 'View, edit or delete existing celebrity photos', icon: Database, link: '/admin/data', color: 'bg-indigo-500' },
    { title: 'Upload Data', description: 'Add new celebrity photos to the system', icon: UploadCloud, link: '/admin/upload', color: 'bg-emerald-500' },
    { title: 'Export Data', description: 'Download rating reports in Excel format', icon: Download, link: '/admin/export', color: 'bg-amber-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10">
        <h2 className="text-4xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-zinc-500 mt-2">Manage your celebrity face rating system and analyze data.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-lg shadow-zinc-100 rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`h-16 w-16 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-3xl font-bold text-zinc-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Menu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {menuItems.map((item, i) => (
          <Link key={i} to={item.link} className="group">
            <Card className="h-full border-none shadow-xl shadow-zinc-100 rounded-[2.5rem] overflow-hidden bg-white hover:translate-y-[-4px] transition-all duration-300">
              <CardHeader className="p-8 pb-0">
                <div className={`h-14 w-14 rounded-2xl ${item.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-${item.color.split('-')[1]}-200`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl font-bold flex items-center justify-between">
                  {item.title}
                  <ArrowUpRight className="h-5 w-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <p className="text-zinc-500 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section (Mock) */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
        <Card className="border-none shadow-lg shadow-zinc-100 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-50">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 text-xs font-bold">
                      U{i+1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">User_{Math.floor(Math.random()*1000)} rated Scarlett Johansson</p>
                      <p className="text-xs text-zinc-400">{i+1} hour ago</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-3 w-3 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
