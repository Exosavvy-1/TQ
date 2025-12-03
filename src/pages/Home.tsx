import { Camera, Calendar, Image, Shield } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-slate-900" />
            <span className="text-2xl font-bold text-slate-900">TQ Pictures</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 text-slate-900 hover:text-slate-700 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Capturing Your Moments
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Professional photography services for all occasions. We turn your special moments into timeless memories.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/booking')}
              className="px-8 py-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Book a Session
            </button>
            <button
              onClick={() => navigate('/admin-login')}
              className="px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-slate-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Professional Photography</h3>
              <p className="text-slate-600">
                High-quality photography for weddings, events, portraits, and commercial projects.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-slate-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Image className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Private Gallery Access</h3>
              <p className="text-slate-600">
                Secure online galleries where you can view and download your professional photos.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-slate-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Easy Booking</h3>
              <p className="text-slate-600">
                Simple online booking system to schedule your photoshoot at your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Print Frame Sizes</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">4x6"</h3>
              <p className="text-slate-600 mb-3">Standard Print</p>
              <div className="aspect-[4/6] bg-slate-100 rounded border-2 border-slate-300"></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">5x7"</h3>
              <p className="text-slate-600 mb-3">Portrait Size</p>
              <div className="aspect-[5/7] bg-slate-100 rounded border-2 border-slate-300"></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">8x10"</h3>
              <p className="text-slate-600 mb-3">Medium Frame</p>
              <div className="aspect-[8/10] bg-slate-100 rounded border-2 border-slate-300"></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">11x14"</h3>
              <p className="text-slate-600 mb-3">Large Display</p>
              <div className="aspect-[11/14] bg-slate-100 rounded border-2 border-slate-300"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
