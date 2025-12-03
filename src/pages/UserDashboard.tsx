import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase, Image as ImageType, Booking } from '../lib/supabase';
import { LogOut, Calendar, Image as ImageIcon, Download } from 'lucide-react';

export default function UserDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageType[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (profile?.is_admin) {
      navigate('/admin');
      return;
    }

    loadData();
  }, [user, profile]);

  const loadData = async () => {
    if (!user) return;

    try {
      const { data: userImagesData } = await supabase
        .from('user_images')
        .select('image_id, images(*)')
        .eq('user_id', user.id);

      if (userImagesData) {
        const imgs = userImagesData.map((ui: any) => ui.images).filter(Boolean);
        setImages(imgs);

        const urls: Record<string, string> = {};
        for (const img of imgs) {
          const { data } = await supabase.storage
            .from('photos')
            .createSignedUrl(img.file_path, 3600);
          if (data) {
            urls[img.id] = data.signedUrl;
          }
        }
        setImageUrls(urls);
      }

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (bookingsData) setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDownload = async (imageId: string, fileName: string) => {
    const url = imageUrls[imageId];
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome, {profile?.full_name || 'User'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/booking')}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              New Booking
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">My Images</p>
                <p className="text-3xl font-bold text-slate-900">{images.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">My Bookings</p>
                <p className="text-3xl font-bold text-slate-900">{bookings.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">My Gallery</h2>
          {images.length === 0 ? (
            <p className="text-slate-600 text-center py-8">
              No images assigned yet. Check back later!
            </p>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
                    {imageUrls[image.id] && (
                      <img
                        src={imageUrls[image.id]}
                        alt={image.file_name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleDownload(image.id, image.file_name)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="w-4 h-4 text-slate-700" />
                  </button>
                  <p className="mt-2 text-sm text-slate-600 truncate">{image.file_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-slate-600 text-center py-8">
              No bookings yet.{' '}
              <button
                onClick={() => navigate('/booking')}
                className="text-slate-900 font-medium underline"
              >
                Create your first booking
              </button>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Reason</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-900">{booking.booking_date}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{booking.booking_time}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{booking.reason}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
