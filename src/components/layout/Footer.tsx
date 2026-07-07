import { Link } from 'react-router-dom';
import { Compass, Twitter, Instagram, Github, Youtube, Heart } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Explore', to: '/explore' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'Travel', to: '/travel' },
    { label: 'Sports', to: '/sports' },
    { label: 'Communities', to: '/communities' },
  ],
  Features: [
    { label: 'AI Travel Planner', to: '/ai-planner' },
    { label: 'Creator Analytics', to: '/analytics' },
    { label: 'Leaderboards', to: '/leaderboard' },
    { label: 'Bookmarks', to: '/bookmarks' },
    { label: 'Write a Blog', to: '/write' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
    { label: 'Press', to: '/press' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Cookie Policy', to: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black text-white">Explore<span className="text-primary-400">X</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              The world's best platform for travel bloggers and sports communities. Explore. Share. Connect.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Github, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all group">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2024 ExploreX. All rights reserved.</p>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> for explorers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
