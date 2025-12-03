import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, User, Mail, Phone, FileText, Camera } from 'lucide-react';

export default function Booking() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    date: '',
    time: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: bookingError } = await supabase.from('bookings').insert({
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        booking_date: formData.date,
        booking_time: formData.time,
        reason: formData.reason,
        status: 'pending',
      });

      if (bookingError) throw bookingError;

      setSuccess(true);
      setFormData({
        fullName: profile?.full_name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        date: '',
        time: '',
        reason: '',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-slate-900" />
            <span className="text-2xl font-bold text-slate-900">TQ Pictures</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Book Your Photoshoot</h1>
            <p className="text-slate-600 mb-8">Fill out the form below to schedule your session</p>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Booking submitted successfully! Redirecting to dashboard...
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {!user && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                Please <button onClick={() => navigate('/login')} className="underline font-medium">log in</button> to make a booking.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Reason for Photoshoot
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                  placeholder="Wedding, family portrait, corporate headshots, etc."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !user}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
