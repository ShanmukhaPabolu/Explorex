import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Users, BookOpen, MapPin, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockBlogs, mockDestinations, mockCommunities } from '../../data/mockData';
import BlogCard from '../../components/blog/BlogCard';
import DestinationCard from '../../components/travel/DestinationCard';
import { Avatar, Badge, Skeleton } from '../../components/ui';
import { formatNumber } from '../../utils';

export default function DashboardHome() {
  const { user } = useAuth();
  const [loading] = useState(false);

  const trending = mockBlogs.slice(0, 4);
  const recommended = mockBlogs.slice(2, 5);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white mb-1">
              Good morning, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-white/70 text-sm">Ready for your next adventure? You have 3 new notifications.</p>
          </div>
          <Link to="/write" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-bold rounded-xl hover:shadow-lg transition-all text-sm">
            <Plus className="w-4 h-4" />
            Write Blog
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: '24.5K', change: '+12%', icon: TrendingUp, color: 'blue' },
          { label: 'Followers', value: formatNumber(user?.followers || 0), change: '+8%', icon: Users, color: 'purple' },
          { label: 'Blog Posts', value: String(user?.blogs || 0), change: '+2', icon: BookOpen, color: 'cyan' },
          { label: 'Destinations', value: '12', change: '+1', icon: MapPin, color: 'green' },
        ].map(stat => (
          <div key={stat.label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center ${
              stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'purple' ? 'bg-purple-100' : stat.color === 'cyan' ? 'bg-cyan-100' : 'bg-green-100'
            }`}>
              <stat.icon className={`w-4.5 h-4.5 w-5 h-5 ${
                stat.color === 'blue' ? 'text-blue-600' : stat.color === 'purple' ? 'text-purple-600' : stat.color === 'cyan' ? 'text-cyan-600' : 'text-green-600'
              }`} />
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-500">{stat.label}</span>
              <span className="text-xs text-green-600 font-semibold">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Trending blogs */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-slate-900 text-lg">Trending Now</h2>
            </div>
            <Link to="/blogs" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2].map(i => <div key={i} className="card p-4 space-y-3"><Skeleton className="h-40 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trending.slice(0,4).map(b => <BlogCard key={b.id} blog={b} />)}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Recommended for you */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>⚡</span> Recommended
            </h3>
            <div className="space-y-1">
              {recommended.map(b => (
                <BlogCard key={b.id} blog={b} variant="compact" />
              ))}
            </div>
          </div>

          {/* Trending Destinations */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><span>🗺️</span> Hot Destinations</h3>
              <Link to="/travel" className="text-xs text-primary-600 hover:underline">All</Link>
            </div>
            <div className="space-y-1">
              {mockDestinations.slice(0, 4).map(d => <DestinationCard key={d.id} destination={d} variant="compact" />)}
            </div>
          </div>

          {/* Communities you might like */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span>👥</span> Join Communities</h3>
            <div className="space-y-3">
              {mockCommunities.filter(c => !c.isJoined).slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${c.color}20` }}>
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/communities/${c.slug}`} className="text-sm font-semibold text-slate-900 hover:text-primary-600 transition-colors truncate block">{c.name}</Link>
                    <p className="text-xs text-slate-500">{formatNumber(c.members)} members</p>
                  </div>
                  <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap">Join</button>
                </div>
              ))}
            </div>
            <Link to="/communities" className="mt-4 block text-center text-sm text-slate-500 hover:text-primary-600 transition-colors">
              Browse all communities
            </Link>
          </div>

          {/* Top creators */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span>⭐</span> Top Creators</h3>
            <div className="space-y-3">
              {[
                { name: 'Alex Morgan', username: 'alexmorgan', followers: 12400, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop', badge: '🌟' },
                { name: 'Priya Sharma', username: 'priyasharma', followers: 8900, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop', badge: '🏆' },
                { name: 'Marcus Johnson', username: 'marcusjohnson', followers: 5600, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop', badge: '🎯' },
              ].map((creator, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar src={creator.avatar} name={creator.name} size="sm" />
                    <span className="absolute -bottom-0.5 -right-0.5 text-xs">{creator.badge}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${creator.username}`} className="text-sm font-semibold text-slate-900 hover:text-primary-600 truncate block">{creator.name}</Link>
                    <p className="text-xs text-slate-400">{formatNumber(creator.followers)} followers</p>
                  </div>
                  <Badge variant="blue" className="text-xs">#{i+1}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
