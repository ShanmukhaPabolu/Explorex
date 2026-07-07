import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, PenSquare, Menu, X, Compass, LogOut, User, Settings, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';
import { mockNotifications } from '../../data/mockData';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const unread = mockNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isLanding
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xl font-black tracking-tight ${!scrolled && isLanding ? 'text-white' : 'text-slate-900'}`}>
              Explore<span className="text-primary-600">X</span>
            </span>
          </Link>

          {/* Search - desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations, blogs, communities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Nav links - desktop */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/explore" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!scrolled && isLanding ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>Explore</Link>
                <Link to="/blogs" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!scrolled && isLanding ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>Blogs</Link>
                <Link to="/sports" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!scrolled && isLanding ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>Sports</Link>

                {/* Write button */}
                <button
                  onClick={() => navigate('/write')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors ml-1"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  Write
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    className={`relative p-2 rounded-lg transition-colors ${!scrolled && isLanding ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    <Bell className="w-5 h-5" />
                    {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unread}</span>}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-down">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                        {mockNotifications.map(n => (
                          <div key={n.id} className={`flex gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                            {n.user.avatar ? (
                              <Avatar src={n.user.avatar} name={n.user.name} size="sm" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm">🏏</div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-700 leading-relaxed">
                                <span className="font-semibold">{n.user.name}</span> {n.message}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1 shrink-0" />}
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-100">
                        <Link to="/notifications" className="block text-center text-sm text-primary-600 font-medium hover:underline" onClick={() => setNotifOpen(false)}>View all notifications</Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    className="ml-1"
                  >
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-down">
                      <div className="p-4 border-b border-slate-100">
                        <p className="font-semibold text-slate-900 text-sm">{user?.name}</p>
                        <p className="text-xs text-slate-500">@{user?.username}</p>
                      </div>
                      <div className="p-2">
                        {[
                          { to: '/profile', icon: User, label: 'Profile' },
                          { to: '/dashboard', icon: BarChart2, label: 'Dashboard' },
                          { to: '/settings', icon: Settings, label: 'Settings' },
                        ].map(item => (
                          <Link key={item.to} to={item.to} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setProfileOpen(false)}>
                            <item.icon className="w-4 h-4 text-slate-400" />
                            {item.label}
                          </Link>
                        ))}
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${!scrolled && isLanding ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}>
                  Sign in
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen
              ? <X className={`w-5 h-5 ${!scrolled && isLanding ? 'text-white' : 'text-slate-700'}`} />
              : <Menu className={`w-5 h-5 ${!scrolled && isLanding ? 'text-white' : 'text-slate-700'}`} />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-slide-down">
          <div className="p-4 space-y-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none" />
            </div>
            {isAuthenticated ? (
              <>
                {[
                  { to: '/dashboard', label: 'Dashboard' },
                  { to: '/explore', label: 'Explore' },
                  { to: '/blogs', label: 'Blogs' },
                  { to: '/sports', label: 'Sports' },
                  { to: '/travel', label: 'Travel' },
                  { to: '/profile', label: 'Profile' },
                  { to: '/write', label: 'Write a Blog' },
                ].map(item => (
                  <Link key={item.to} to={item.to} className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" className="btn-secondary w-full text-center py-3">Sign in</Link>
                <Link to="/signup" className="btn-primary w-full text-center py-3">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-[-1]" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </nav>
  );
}
