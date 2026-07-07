import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, BookOpen, MapPin, Zap, Users, Bookmark, BarChart2, User, Settings, PenSquare, Trophy, Brain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Progress } from '../ui';
import { formatNumber } from '../../utils';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/blogs', icon: BookOpen, label: 'Blogs' },
  { to: '/travel', icon: MapPin, label: 'Travel' },
  { to: '/sports', icon: Zap, label: 'Sports' },
  { to: '/communities', icon: Users, label: 'Communities' },
  { to: '/ai-planner', icon: Brain, label: 'AI Planner' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const nextLevelXp = 10000;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-100 flex flex-col overflow-hidden">
      {/* User card */}
      <div className="p-4 border-b border-slate-100">
        <Link to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group">
          <Avatar src={user?.avatar} name={user?.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary-600 transition-colors">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">@{user?.username}</p>
          </div>
        </Link>
        <div className="mt-3 px-2">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>{formatNumber(user?.xp || 0)} XP</span>
            <span>{formatNumber(nextLevelXp)} XP</span>
          </div>
          <Progress value={user?.xp || 0} max={nextLevelXp} />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        <div className="space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 w-5 h-5 flex-shrink-0 transition-colors ${active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
                {item.label}
                {item.to === '/bookmarks' && (
                  <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">3</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Write CTA */}
      <div className="p-4 border-t border-slate-100">
        <Link to="/write" className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md">
          <PenSquare className="w-4 h-4" />
          Write a Blog
        </Link>
      </div>
    </aside>
  );
}
