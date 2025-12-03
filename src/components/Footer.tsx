import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TQ Pictures</h3>
            <p className="text-slate-400">
              Capturing life's precious moments with professional photography services.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">Login</a>
              </li>
              <li>
                <a href="/signup" className="hover:text-white transition-colors">Sign Up</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/tqpictures"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/tqpictures"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/tqpictures"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/tqpictures"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} TQ Pictures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
