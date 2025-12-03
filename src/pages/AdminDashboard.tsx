import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase, Image as ImageType, Profile, Booking } from '../lib/supabase';
import { Upload, LogOut, Calendar, Image as ImageIcon, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageType[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    if (!user || (profile && !profile.is_admin)) {
      navigate('/admin-login');
      return;
    }

    loadData();
  }, [user, profile]);

  const loadData = async () => {
    try {
      const [imagesRes, usersRes, bookingsRes] = await Promise.all([
        supabase.from('images').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('is_admin', false),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      ]);

      if (imagesRes.data) setImages(imagesRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setUploading(true);
    setUploadSuccess('');

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: imageData, error: imageError } = await supabase
          .from('images')
          .insert({
            file_path: filePath,
            file_name: file.name,
            uploaded_by: user.id,
          })
          .select()
          .single();

        if (imageError) throw imageError;

        if (selectedUsers.length > 0 && imageData) {
          const assignments = selectedUsers.map((userId) => ({
            image_id: imageData.id,
            user_id: userId,
          }));

          const { error: assignError } = await supabase
            .from('user_images')
            .insert(assignments);

          if (assignError) throw assignError;
        }
      }

      setUploadSuccess('Images uploaded successfully!');
      setSelectedUsers([]);
      loadData();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Images</p>
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
                <p className="text-slate-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{users.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Pending Bookings</p>
                <p className="text-3xl font-bold text-slate-900">
                  {bookings.filter((b) => b.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Upload Images</h2>

          {uploadSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {uploadSuccess}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Users to Assign Images
            </label>
            <div className="grid md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-4 border border-slate-200 rounded-lg">
              {users.map((user) => (
                <label key={user.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                      }
                    }}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">
                    {user.full_name || user.email}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">
                {uploading ? 'Uploading...' : 'Click to upload images'}
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 10).map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-900">{booking.full_name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{booking.booking_date}</td>
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
        </div>
      </div>
    </div>
  );
}
