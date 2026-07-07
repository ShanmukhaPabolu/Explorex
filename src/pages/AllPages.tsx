import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Sparkles, Send, BarChart2, Eye, Heart, Users, BookOpen, Bookmark, TrendingUp, Trophy, Brain, PenSquare, Bold, Italic, List, Image as ImageIcon, Tag, Save, Globe, Trash2, Edit, ArrowLeft, MessageSquare } from 'lucide-react';
import { mockDestinations, mockCommunities, mockBlogs, mockUsers } from '../data/mockData';
import DestinationCard from '../components/travel/DestinationCard';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { publishBlog, fetchMyBlogs, deleteBlog, updateBlog, fetchBlogBySlug, fetchBlogById } from '../lib/blogs';
import CommunityCard from '../components/community/CommunityCard';
import BlogCard from '../components/blog/BlogCard';
import { Avatar, Button, Badge, Input, Select, EmptyState } from '../components/ui';
import { formatNumber } from '../utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// ─────────────────────────────────────
// TRAVEL PAGE
// ─────────────────────────────────────
export function TravelPage() {
  const [search, setSearch] = useState('');
  const [budget, setBudget] = useState('all');
  const [continent, setContinent] = useState('all');

  const filtered = mockDestinations.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    const matchBudget = budget === 'all' || d.budget === budget;
    const matchContinent = continent === 'all' || d.continent === continent;
    return matchSearch && matchBudget && matchContinent;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 mb-1">Explore Destinations</h1>
        <p className="text-slate-500">Discover amazing places to visit around the world</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" />
        </div>
        <select value={budget} onChange={e => setBudget(e.target.value)} className="input w-auto">
          <option value="all">All Budgets</option>
          <option value="budget">Budget</option>
          <option value="mid-range">Mid-Range</option>
          <option value="luxury">Luxury</option>
        </select>
        <select value={continent} onChange={e => setContinent(e.target.value)} className="input w-auto">
          <option value="all">All Continents</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="South America">South America</option>
          <option value="Africa">Africa</option>
        </select>
      </div>

      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden h-56">
        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <Badge variant="cyan" className="mb-3">✈️ Featured Destination</Badge>
            <h2 className="text-3xl font-black text-white mb-2">Discover Southeast Asia</h2>
            <p className="text-white/80 mb-4">Ancient temples, vibrant markets, pristine beaches</p>
            <Link to="/ai-planner" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-700 font-bold rounded-xl text-sm hover:shadow-lg transition-all">
              <Sparkles className="w-4 h-4" /> Plan with AI
            </Link>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-500 mb-4">{filtered.length} destinations found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(d => <DestinationCard key={d.id} destination={d} />)}
        </div>
        {filtered.length === 0 && (
          <EmptyState icon={<MapPin />} title="No destinations found" description="Try different search terms or filters" />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// SPORTS PAGE
// ─────────────────────────────────────
const sportsNews = [
  {
    id: '1',
    title: 'Cricket World Cup 2024: India vs Australia Semi-Final Highlights',
    category: 'Cricket',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop',
    views: 45200,
    content: `What an absolute thriller of a match at the World Cup! India secured their place in the finals after a nail-biting encounter with Australia.

India, batting first, put up a massive score of 287/4 in their 50 overs, led by an outstanding century from the skipper. Australia put up a stellar chase, matching the run rate but losing crucial wickets at key moments. The Indian spin attack turned the game in the middle overs, restricting Australia to 245/8.

Key Performances:
- Rohit Sharma: 104 runs (92 balls)
- Mitchell Starc: 3/45 (10 overs)
- Jasprit Bumrah: 4/38 (9.2 overs)`
  },
  {
    id: '2',
    title: 'Premier League GW20: Top 5 Goals of the Week',
    category: 'Football',
    time: '4h ago',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop',
    views: 32100,
    content: `Game Week 20 of the Premier League season delivered some of the most sensational goals of the year. Here is our breakdown of the top 5 finishes:

1. **The Bicycle Kick**: A stunning overhead volley from 18 yards out that left the keeper completely motionless.
2. **The Solo Run**: A brilliant counter-attack where the winger dribbled past three defenders before curling it into the top corner.
3. **The Long-Range Screamer**: A 35-yard half-volley that rocketed off the crossbar and in.
4. **The Team Play**: A 15-pass buildup culminating in a simple tap-in.
5. **The Free Kick**: A curling set-piece that went around the wall and into the bottom corner.`
  },
  {
    id: '3',
    title: 'NBA: LeBron James Scores Career-High in Overtime Thriller',
    category: 'Basketball',
    time: '6h ago',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=450&fit=crop',
    views: 28700,
    content: `LeBron James put on a historic performance in an overtime thriller against the Warriors, scoring a season-high to carry his team to victory.

At 39 years old, LeBron continues to defy time and gravity, scoring 12 of his team's 14 points in the overtime period to seal the game. The game was a back-and-forth masterpiece with multiple lead changes in the fourth quarter.

Stats of the Match:
- Points: 46
- Rebounds: 11
- Assists: 9`
  }
];

const liveScores = [
  { team1: 'India', score1: '287/4', team2: 'Australia', score2: '245/8', sport: '🏏', status: 'LIVE', overs: '43.2/50' },
  { team1: 'Man City', score1: '2', team2: 'Arsenal', score2: '1', sport: '⚽', status: 'LIVE', overs: "72'" },
  { team1: 'Lakers', score1: '98', team2: 'Warriors', score2: '102', sport: '🏀', status: 'Q4', overs: '3:42' },
];

export function SportsPage() {
  const [activeLeague, setActiveLeague] = useState('All');
  const [newsList, setNewsList] = useState<any[]>(sportsNews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.espn.com%2Fespn%2Frss%2Fnews')
      .then(res => res.json())
      .then(data => {
        if (data && data.items && data.items.length > 0) {
          const formatted = data.items.map((item: any, idx: number) => ({
            id: item.guid || String(idx + 4),
            title: item.title,
            category: item.categories?.[0] || 'Sports',
            time: new Date(item.pubDate).toLocaleDateString() || 'Recently',
            image: item.thumbnail || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
            views: Math.floor(Math.random() * 40000) + 5000,
            content: item.content || item.description || 'No additional details available.',
            link: item.link
          }));
          setNewsList(formatted);
        }
      })
      .catch(() => {
        setNewsList(sportsNews);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 mb-1">Sports Hub</h1>
        <p className="text-slate-500">Live scores, sports communities, and match discussions</p>
      </div>

      {/* Live Scores */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          Live Scores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveScores.map((score, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{score.sport}</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <Badge variant="red">{score.status}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="font-bold text-slate-900">{score.team1}</p>
                  <p className="text-2xl font-black text-primary-600 mt-1">{score.score1}</p>
                </div>
                <div className="px-4 text-center">
                  <p className="text-xs text-slate-400 font-medium">vs</p>
                  <p className="text-xs text-slate-500 mt-1">{score.overs}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="font-bold text-slate-900">{score.team2}</p>
                  <p className="text-2xl font-black text-secondary-600 mt-1">{score.score2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest News */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Latest Sports News</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <svg className="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        ) : (
          <div className="space-y-4">
            {newsList.map((news, i) => (
              <Link to={`/sports/${news.id}`} key={i} className="card p-4 flex gap-4 hover:border-primary-200 border border-slate-100 block transition-all group">
                <img src={news.image} alt={news.title} className="w-24 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="blue">{news.category}</Badge>
                    <span className="text-xs text-slate-400">{news.time}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{news.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Eye className="w-3 h-3" />
                    {formatNumber(news.views)} views
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Communities */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Sports Communities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCommunities.map(c => <CommunityCard key={c.id} community={c} />)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// COMMUNITIES PAGE
// ─────────────────────────────────────
export function CommunitiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Communities</h1>
          <p className="text-slate-500">Join passionate sports and travel communities</p>
        </div>
        <Button variant="primary" icon={<Users className="w-4 h-4" />}>Create Community</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCommunities.map(c => <CommunityCard key={c.id} community={c} />)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────
export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blogs');
  const [myBlogs, setMyBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !username || username === user?.username;
  const profile = isOwnProfile
    ? user
    : (mockUsers.find(u => u.username === username) || mockUsers[0]);

  useEffect(() => {
    if (isOwnProfile && user) {
      setLoading(true);
      fetchMyBlogs(user.id)
        .then(blogs => setMyBlogs(blogs))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isOwnProfile, user, username]);

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    const res = await deleteBlog(id);
    if (res.ok) {
      setMyBlogs(prev => prev.filter(b => b.id !== id));
      if (refreshUser) await refreshUser();
    } else {
      alert(res.error || 'Failed to delete blog.');
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Please log in to view your profile.</p>
      </div>
    );
  }

  const coverUrl = profile.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=400&fit=crop';

  return (
    <div>
      {/* Cover */}
      <div className="relative rounded-2xl overflow-hidden h-44 mb-0">
        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Profile header */}
      <div className="card -mt-8 mx-0 p-6 mb-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <Avatar src={profile.avatar} name={profile.name} size="2xl" className="-mt-16 ring-4 ring-white" />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-black text-slate-900">{profile.name}</h1>
              {profile.badges?.map(b => <span key={b.id} title={b.name} className="text-xl">{b.icon}</span>)}
            </div>
            <p className="text-slate-500">@{profile.username} {profile.location && `· ${profile.location}`}</p>
            <p className="text-slate-700 text-sm mt-2 max-w-lg">{profile.bio || 'No bio yet.'}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Message</Button>
            <Button variant="primary">Follow</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6 pt-6 border-t border-slate-100">
          {[
            { label: 'Followers', value: formatNumber(profile.followers || 0) },
            { label: 'Following', value: formatNumber(profile.following || 0) },
            { label: 'Blogs', value: profile.blogs || 0 },
            { label: 'XP', value: formatNumber(profile.xp || 0) },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'blogs', label: 'Blogs', icon: BookOpen },
          { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
          { id: 'communities', label: 'Communities', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'blogs' && (
        <div>
          {loading && (
            <div className="flex justify-center py-8">
              <svg className="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          )}
          {isOwnProfile && myBlogs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBlogs.map(b => (
                <div key={b.id} className="relative group">
                  <BlogCard blog={b} />
                  {/* Owner Controls */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1.5 rounded-xl shadow-md z-10">
                    <button
                      onClick={() => navigate(`/write?edit=${b.id}`)}
                      className="p-2 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      title="Edit Blog"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(b.id)}
                      className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete Blog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isOwnProfile && myBlogs.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="font-bold text-slate-800 mb-1">No blogs written yet</h3>
              <p className="text-slate-400 text-sm mb-4">Share your travel and sports stories with the world.</p>
              <Link to="/write" className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors">
                Write a Blog
              </Link>
            </div>
          )}
          {!isOwnProfile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBlogs.filter(b => b.author.username === profile.username).map(b => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'bookmarks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBlogs.filter(b => b.isBookmarked).map(b => <BlogCard key={b.id} blog={b} />)}
        </div>
      )}
      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCommunities.filter(c => c.isJoined).map(c => <CommunityCard key={c.id} community={c} />)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// WRITE PAGE
// ─────────────────────────────────────
export function WritePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('travel');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load blog details if editing
  useEffect(() => {
    if (editId) {
      setLoadingEdit(true);
      fetchBlogById(editId)
        .then(blog => {
          if (blog) {
            setTitle(blog.title);
            setContent(blog.content);
            setCategory(blog.category.toLowerCase());
            setTags(blog.tags.join(', '));
            setCoverImage(blog.coverImage);
          }
        })
        .finally(() => setLoadingEdit(false));
    }
  }, [editId]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverImage(url);
  };

  const handlePublish = async () => {
    setError('');
    if (!user) { setError('You must be logged in to publish.'); return; }
    if (!title.trim()) { setError('Please add a title before publishing.'); return; }
    if (!content.trim() || content.trim().split(/\s+/).length < 10) {
      setError('Please write at least a few sentences before publishing.');
      return;
    }
    setPublishing(true);
    
    let result;
    if (editId) {
      result = await updateBlog(editId, {
        title,
        content,
        category,
        tags,
        coverImage,
      });
    } else {
      result = await publishBlog({
        title,
        content,
        category,
        tags,
        coverImage,
        authorId: user.id,
        authorName: user.name,
        authorUsername: user.username,
        authorAvatar: user.avatar,
      });
    }

    setPublishing(false);
    if (!result.ok) {
      setError(result.error ?? 'Failed to save. Please try again.');
      return;
    }
    await refreshUser();
    setPublished(true);
    
    if (!editId && (result as any).slug) {
      setTimeout(() => navigate(`/blog/${(result as any).slug}`), 1500);
    } else if (editId) {
      setTimeout(() => navigate('/profile'), 1500);
    }
  };

  if (loadingEdit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-slate-500 font-medium">Loading blog content…</p>
      </div>
    );
  }

  if (published) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl">🎉</div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {editId ? 'Changes Saved!' : 'Blog Published!'}
          </h2>
          <p className="text-slate-500">
            {editId ? 'Your updates are now live.' : 'Your story is now live for the world to read.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="gradient" onClick={() => { setPublished(false); setTitle(''); setContent(''); setCoverImage(''); setTags(''); }}>
            Write Another
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/blogs'}>
            View All Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hidden file input for cover image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <PenSquare className="w-6 h-6 text-primary-600" />
          Write a Blog
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
            {saved ? '✓ Saved' : 'Save Draft'}
          </Button>
          <Button
            variant="gradient"
            size="sm"
            icon={<Globe className="w-4 h-4" />}
            onClick={handlePublish}
            loading={publishing}
          >
            Publish
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="card p-6 space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Your compelling blog title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-3xl font-black text-slate-900 placeholder-slate-300 border-none outline-none bg-transparent resize-none"
          />
          {title && <p className="text-xs text-slate-400 mt-1">{title.length} characters</p>}
        </div>

        <hr className="border-slate-100" />

        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-slate-50 rounded-xl">
          {[
            { icon: Bold, label: 'Bold' },
            { icon: Italic, label: 'Italic' },
            { icon: List, label: 'List' },
            { icon: ImageIcon, label: 'Image' },
            { icon: Tag, label: 'Tag' },
          ].map(({ icon: Icon, label }) => (
            <button key={label} title={label} className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all">
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
            <span>{content.split(/\s+/).filter(Boolean).length} words</span>
            <span>·</span>
            <span>{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200) || 0} min read</span>
          </div>
        </div>

        {/* Content */}
        <textarea
          rows={20}
          placeholder="Tell your story... Start with an engaging introduction, share your experiences, add tips, and conclude with your takeaways."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full text-slate-700 placeholder-slate-300 border-none outline-none bg-transparent resize-none leading-relaxed text-base"
        />
      </div>

      {/* Settings */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Blog Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input">
              <option value="travel">Travel</option>
              <option value="sports">Sports</option>
              <option value="adventure">Adventure</option>
              <option value="food">Food & Travel</option>
            </select>
          </div>
          <Input label="Tags (comma separated)" placeholder="e.g. Asia, Backpacking, Budget" value={tags} onChange={e => setTags(e.target.value)} icon={<Tag className="w-4 h-4" />} />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              className="input flex-1"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
            />
            <Button
              variant="secondary"
              size="md"
              icon={<ImageIcon className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload
            </Button>
          </div>
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover preview"
              className="mt-3 w-full h-48 object-cover rounded-xl border border-slate-200"
              onError={() => setCoverImage('')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// ANALYTICS PAGE
// ─────────────────────────────────────
const viewsData = [
  { month: 'Aug', views: 1200, likes: 89, comments: 23 },
  { month: 'Sep', views: 2100, likes: 156, comments: 45 },
  { month: 'Oct', views: 1800, likes: 134, comments: 38 },
  { month: 'Nov', views: 3200, likes: 245, comments: 67 },
  { month: 'Dec', views: 4100, likes: 312, comments: 89 },
  { month: 'Jan', views: 5800, likes: 445, comments: 112 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-primary-600" />
          Creator Analytics
        </h1>
        <p className="text-slate-500">Track your content performance and audience growth</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: '24.5K', change: '+18%', icon: Eye, color: 'blue' },
          { label: 'Total Likes', value: '1,484', change: '+24%', icon: Heart, color: 'red' },
          { label: 'Followers', value: '12.4K', change: '+8%', icon: Users, color: 'purple' },
          { label: 'Avg Read Time', value: '8.2m', change: '+2%', icon: TrendingUp, color: 'green' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              s.color === 'blue' ? 'bg-blue-100' : s.color === 'red' ? 'bg-red-100' : s.color === 'purple' ? 'bg-purple-100' : 'bg-green-100'
            }`}>
              <s.icon className={`w-5 h-5 ${s.color === 'blue' ? 'text-blue-600' : s.color === 'red' ? 'text-red-500' : s.color === 'purple' ? 'text-purple-600' : 'text-green-600'}`} />
            </div>
            <div className="text-2xl font-black text-slate-900">{s.value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-500">{s.label}</span>
              <span className="text-xs text-green-600 font-semibold">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Views chart */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-900 mb-6">Views Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={viewsData}>
            <defs>
              <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={2} fill="url(#viewGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement chart */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-900 mb-6">Engagement Breakdown</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="likes" fill="#2563EB" radius={[6, 6, 0, 0]} />
            <Bar dataKey="comments" fill="#7C3AED" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top blogs table */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-900 mb-6">Top Performing Blogs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Blog', 'Views', 'Likes', 'Comments', 'Read Time'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockBlogs.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <img src={b.coverImage} alt={b.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-900 line-clamp-1 max-w-xs">{b.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{formatNumber(b.views)}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{formatNumber(b.likes)}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{b.comments}</td>
                  <td className="py-3 text-sm text-slate-600">{b.readTime}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// BOOKMARKS PAGE
// ─────────────────────────────────────
export function BookmarksPage() {
  const [activeTab, setActiveTab] = useState('blogs');
  const bookmarkedBlogs = mockBlogs.filter(b => b.isBookmarked);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-500" />
          Bookmarks
        </h1>
        <p className="text-slate-500">Your saved content in one place</p>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'blogs', label: 'Blogs', count: bookmarkedBlogs.length },
          { id: 'destinations', label: 'Destinations', count: 2 },
          { id: 'communities', label: 'Communities', count: 1 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'}`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {activeTab === 'blogs' && (
        bookmarkedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedBlogs.map(b => <BlogCard key={b.id} blog={b} />)}
          </div>
        ) : (
          <EmptyState icon={<Bookmark />} title="No bookmarks yet" description="Save blogs, destinations, and communities to find them here quickly" action={<Link to="/blogs" className="btn-primary">Explore Blogs</Link>} />
        )
      )}

      {activeTab === 'destinations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDestinations.slice(0, 2).map(d => <DestinationCard key={d.id} destination={d} />)}
        </div>
      )}

      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCommunities.filter(c => c.isJoined).slice(0, 1).map(c => <CommunityCard key={c.id} community={c} />)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// EXPLORE PAGE
// ─────────────────────────────────────
export function ExplorePage() {
  const [search, setSearch] = useState('');

  const filtered = mockBlogs.filter(b =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="text-center py-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
        <h1 className="text-3xl font-black text-slate-900 mb-3">Explore ExploreX</h1>
        <p className="text-slate-500 mb-6">Discover trending content from around the world</p>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search blogs, destinations, creators..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-12 text-base py-4" />
        </div>
      </div>

      {/* Trending blogs */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-5">🔥 Trending Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(b => <BlogCard key={b.id} blog={b} />)}
        </div>
      </div>

      {/* Destinations */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-5">🗺️ Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDestinations.slice(0, 3).map(d => <DestinationCard key={d.id} destination={d} />)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// AI TRAVEL PLANNER PAGE
// ─────────────────────────────────────
export function AITravelPlannerPage() {
  const [form, setForm] = useState({ destination: '', days: '7', budget: '1500', style: 'balanced' });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<null | { destination: string; days: number; budget: number; itinerary: Array<{ day: number; theme: string; activities: string[]; cost: number }> }>(null);

  const handleGenerate = async () => {
    if (!form.destination) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));

    const itinerary = Array.from({ length: parseInt(form.days) }, (_, i) => ({
      day: i + 1,
      theme: ['Arrival & Orientation', 'Cultural Exploration', 'Nature & Adventure', 'Food & Markets', 'Hidden Gems', 'Relaxation', 'Departure'][i % 7],
      activities: [
        `Morning: Visit ${['local temple', 'famous landmark', 'historical museum', 'botanical garden'][i % 4]}`,
        `Afternoon: ${['street food tour', 'guided city walk', 'local cooking class', 'boat trip'][i % 4]}`,
        `Evening: ${['rooftop dinner', 'night market', 'cultural show', 'sunset viewpoint'][i % 4]}`,
      ],
      cost: Math.floor(parseInt(form.budget) / parseInt(form.days) * (0.8 + Math.random() * 0.4)),
    }));

    setPlan({ destination: form.destination, days: parseInt(form.days), budget: parseInt(form.budget), itinerary });
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary-600" />
          AI Travel Planner
        </h1>
        <p className="text-slate-500">Get a personalized itinerary powered by artificial intelligence</p>
      </div>

      {/* Input form */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Plan Your Trip
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Destination"
            placeholder="e.g. Bali, Paris, Tokyo..."
            value={form.destination}
            onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
            icon={<MapPin className="w-4 h-4" />}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Days</label>
            <select value={form.days} onChange={e => setForm(f => ({ ...f, days: e.target.value }))} className="input">
              {[3, 5, 7, 10, 14, 21].map(d => <option key={d} value={d}>{d} days</option>)}
            </select>
          </div>
          <Input
            label="Total Budget (USD)"
            type="number"
            placeholder="e.g. 1500"
            value={form.budget}
            onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Travel Style</label>
            <select value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))} className="input">
              <option value="budget">Budget Backpacker</option>
              <option value="balanced">Balanced Explorer</option>
              <option value="comfort">Comfort Traveler</option>
              <option value="luxury">Luxury Seeker</option>
            </select>
          </div>
        </div>

        <Button variant="gradient" className="w-full text-base py-3.5" onClick={handleGenerate} loading={loading} icon={<Sparkles className="w-5 h-5" />}>
          {loading ? 'Generating your perfect itinerary...' : 'Generate AI Itinerary'}
        </Button>
      </div>

      {/* Generated Plan */}
      {plan && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-slate-900">{plan.destination} Itinerary</h2>
              <Badge variant="green">✓ Generated</Badge>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <span><strong>{plan.days}</strong> days</span>
              <span>Total budget: <strong className="text-primary-600">${plan.budget}</strong></span>
              <span>Per day avg: <strong>${Math.floor(plan.budget / plan.days)}</strong></span>
            </div>
          </div>

          {plan.itinerary.map(day => (
            <div key={day.day} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-black">
                    {day.day}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Day {day.day}</p>
                    <p className="text-xs text-slate-500">{day.theme}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">~${day.cost}</span>
              </div>
              <div className="space-y-2">
                {day.activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-primary-400 mt-0.5">•</span>
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="card p-5 bg-gradient-to-r from-primary-50 to-secondary-50">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">💡 AI Travel Tips</h3>
            <div className="space-y-2 text-sm text-slate-700">
              {[
                'Book accommodation at least 2-3 weeks in advance for better rates.',
                'Download offline maps before your trip — they work without data.',
                'Exchange some local currency at the airport for small purchases.',
                'Travel insurance is highly recommended for international trips.',
              ].map((tip, i) => <p key={i} className="flex gap-2"><span>→</span>{tip}</p>)}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" className="flex-1" icon={<BookOpen className="w-4 h-4" />}>Save Itinerary</Button>
            <Button variant="secondary" icon={<Send className="w-4 h-4" />}>Share</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// LEADERBOARD PAGE
// ─────────────────────────────────────
export function LeaderboardPage() {
  const leaders = [
    { rank: 1, name: 'Alex Morgan', username: 'alexmorgan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop', xp: 8750, blogs: 47, followers: 12400, badge: '🥇' },
    { rank: 2, name: 'Priya Sharma', username: 'priyasharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop', xp: 5200, blogs: 32, followers: 8900, badge: '🥈' },
    { rank: 3, name: 'Marcus Johnson', username: 'marcusjohnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop', xp: 3800, blogs: 21, followers: 5600, badge: '🥉' },
    { rank: 4, name: 'Sarah Chen', username: 'sarahchen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop', xp: 3200, blogs: 18, followers: 4200, badge: '🏅' },
    { rank: 5, name: 'James Wright', username: 'jameswright', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop', xp: 2900, blogs: 15, followers: 3800, badge: '🏅' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Leaderboard
        </h1>
        <p className="text-slate-500">Top creators ranked by XP, blogs, and followers</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 items-end">
        {[leaders[1], leaders[0], leaders[2]].map((leader, i) => (
          <div key={leader.rank} className={`card p-5 text-center ${i === 1 ? 'ring-2 ring-amber-400' : ''}`}>
            <span className="text-3xl mb-2 block">{leader.badge}</span>
            <Avatar src={leader.avatar} name={leader.name} size={i === 1 ? '2xl' : 'xl'} className="mx-auto mb-3" />
            <p className="font-bold text-slate-900 text-sm">{leader.name}</p>
            <p className="text-xs text-slate-400">@{leader.username}</p>
            <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold ${i === 1 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
              {formatNumber(leader.xp)} XP
            </div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {['Rank', 'Creator', 'XP', 'Blogs', 'Followers'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leaders.map(l => (
              <tr key={l.rank} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <span className="text-lg font-black text-slate-400">#{l.rank}</span>
                </td>
                <td className="p-4">
                  <Link to={`/profile/${l.username}`} className="flex items-center gap-3">
                    <Avatar src={l.avatar} name={l.name} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{l.name}</p>
                      <p className="text-xs text-slate-400">@{l.username}</p>
                    </div>
                  </Link>
                </td>
                <td className="p-4">
                  <span className="font-bold text-primary-600">{formatNumber(l.xp)}</span>
                </td>
                <td className="p-4 text-slate-600 text-sm">{l.blogs}</td>
                <td className="p-4 text-slate-600 text-sm">{formatNumber(l.followers)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────
export function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState(user?.name || '');
  const [usernameInput, setUsernameInput] = useState(user?.username || '');
  const [locationInput, setLocationInput] = useState(user?.location || '');
  const [bioInput, setBioInput] = useState(user?.bio || '');

  // Account Form States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');
  const [updatingAccount, setUpdatingAccount] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    likes: true,
    comments: true,
    followers: true,
    communities: true,
    digest: false,
  });

  // Privacy Preferences State
  const [privacy, setPrivacy] = useState<Record<string, boolean>>({
    publicProfile: true,
    showActive: true,
    allowIndexing: false,
    analyticsSharing: true,
  });

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError('');
    setAccountSuccess('');
    if (!newPassword || !confirmPassword) {
      setAccountError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAccountError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setAccountError('Password must be at least 6 characters.');
      return;
    }

    setUpdatingAccount(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingAccount(false);

    if (error) {
      setAccountError(error.message);
    } else {
      setAccountSuccess('Password successfully updated!');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key: string) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-8">Settings</h1>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 overflow-x-auto">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeSection === s.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'profile' && (
        <div className="card p-6 space-y-6">
          <h2 className="font-bold text-slate-900 text-lg">Profile Information</h2>
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar} name={fullName} size="xl" />
            <Button variant="secondary" size="sm">Change Photo</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
            <Input label="Username" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} />
            <Input label="Email" type="email" defaultValue={user?.email} disabled />
            <Input label="Location" value={locationInput} onChange={e => setLocationInput(e.target.value)} icon={<MapPin className="w-4 h-4" />} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea rows={4} value={bioInput} onChange={e => setBioInput(e.target.value)} className="input resize-none" />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSaveProfile}>{saved ? '✓ Saved!' : 'Save Changes'}</Button>
          </div>
        </div>
      )}

      {activeSection === 'account' && (
        <div className="card p-6 space-y-6">
          <h2 className="font-bold text-slate-900 text-lg">Account Security</h2>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm">Update Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            {accountError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {accountError}
              </div>
            )}

            {accountSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                {accountSuccess}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" loading={updatingAccount}>
                Update Password
              </Button>
            </div>
          </form>

          <hr className="border-slate-100" />

          <div className="space-y-3">
            <h3 className="font-semibold text-red-600 text-sm">Danger Zone</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Once you delete your account, all of your blogs, comments, and profile data will be permanently deleted from our servers. This action is irreversible.
            </p>
            <Button variant="secondary" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
              Delete Account
            </Button>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-lg mb-2">Notification Preferences</h2>
          {[
            { id: 'likes', label: 'Someone likes your blog', desc: 'Get notified when your content is liked' },
            { id: 'comments', label: 'New comment on your blog', desc: 'Get notified about new comments' },
            { id: 'followers', label: 'New follower', desc: 'Get notified when someone follows you' },
            { id: 'communities', label: 'Community updates', desc: 'Get updates from communities you joined' },
            { id: 'digest', label: 'Weekly digest', desc: 'Receive a weekly summary of your performance' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleNotification(item.id)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  notifications[item.id] ? 'bg-primary-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    notifications[item.id] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'privacy' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-lg mb-2">Privacy & Visibility</h2>
          {[
            { id: 'publicProfile', label: 'Public Profile Visibility', desc: 'Allow anyone to view your profile and browse your published blogs.' },
            { id: 'showActive', label: 'Show Online Status', desc: 'Allow members of your communities to see when you are online.' },
            { id: 'allowIndexing', label: 'Search Engine Indexing', desc: 'Allow Google and other search engines to index your profile and posts.' },
            { id: 'analyticsSharing', label: 'Creator Research Analytics', desc: 'Share anonymous performance metadata to help improve creator services.' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="pr-4">
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePrivacy(item.id)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  privacy[item.id] ? 'bg-primary-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    privacy[item.id] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// DESTINATION DETAIL PAGE
// ─────────────────────────────────────
export function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = mockDestinations.find(d => d.id === id);

  if (!destination) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Destination not found</h1>
        <Link to="/travel" className="text-primary-600 hover:underline">← Back to Travel</Link>
      </div>
    );
  }

  // Find blogs related to this destination
  const relatedBlogs = mockBlogs.filter(b => 
    b.title.toLowerCase().includes(destination.name.toLowerCase()) ||
    (b.category.toLowerCase().includes('travel') && b.tags.some(t => t.toLowerCase() === destination.name.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button onClick={() => navigate('/travel')} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden h-96 shadow-lg">
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="blue">{destination.continent}</Badge>
              <Badge variant="cyan" className="capitalize">{destination.budget}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">{destination.name}</h1>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4 text-primary-400" />
              <span>{destination.country}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-2xl p-4 ring-1 ring-white/30">
            <div className="text-center">
              <div className="flex items-center gap-1 text-amber-300 font-black text-lg justify-center">
                <Star className="w-5 h-5 fill-current" />
                <span>{destination.rating}</span>
              </div>
              <div className="text-xs text-white/80 font-medium">{formatNumber(destination.reviewCount)} reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">About {destination.name}</h2>
              <p className="text-slate-600 leading-relaxed text-base">{destination.description}</p>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="font-bold text-slate-900 mb-3">Quick Facts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs text-slate-400 font-medium mb-1">Best Time to Visit</div>
                  <div className="text-sm font-bold text-slate-800">{destination.bestTime}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs text-slate-400 font-medium mb-1">Budget Category</div>
                  <div className="text-sm font-bold text-slate-800 capitalize">{destination.budget}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs text-slate-400 font-medium mb-1">Region</div>
                  <div className="text-sm font-bold text-slate-800">{destination.continent}</div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h3 className="font-bold text-slate-900 mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {destination.tags.map(t => (
                  <span key={t} className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI travel planner hook */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="relative z-10 space-y-4 max-w-lg">
              <Badge variant="cyan" className="bg-white/20 text-white border-none">✨ AI Powered</Badge>
              <h3 className="text-2xl font-black">Plan your trip to {destination.name} in seconds</h3>
              <p className="text-white/80 text-sm leading-relaxed">Get a personalized daily itinerary including restaurants, transport, attractions, and hotels customized to your travel budget.</p>
              <Link to="/ai-planner" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-primary-700 font-bold rounded-xl text-sm hover:shadow-lg transition-all">
                <Sparkles className="w-4 h-4" /> Start Planning Now
              </Link>
            </div>
          </div>
        </div>

        {/* Right sidebar - Travel blogs about this destination */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              Related Stories
            </h3>
            {relatedBlogs.length > 0 ? (
              <div className="space-y-4">
                {relatedBlogs.map(b => (
                  <BlogCard key={b.id} blog={b} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-400">No blog posts about {destination.name} yet.</p>
                <Link to="/write" className="mt-3 inline-block text-xs text-primary-600 font-semibold hover:underline">
                  Be the first to write!
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// SPORTS DETAIL PAGE
// ─────────────────────────────────────
export function SportsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local mock data first
    const mock = sportsNews.find(n => n.id === id);
    if (mock) {
      setArticle(mock);
      setLoading(false);
      return;
    }

    // 2. Fetch live data
    setLoading(true);
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.espn.com%2Fespn%2Frss%2Fnews')
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          const found = data.items.find((item: any) => item.guid === id);
          if (found) {
            setArticle({
              id: found.guid,
              title: found.title,
              category: found.categories?.[0] || 'Sports',
              time: new Date(found.pubDate).toLocaleDateString() || 'Recently',
              image: found.thumbnail || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop',
              views: Math.floor(Math.random() * 40000) + 5000,
              content: found.content || found.description || 'No additional details available.',
              link: found.link
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">⚽</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Article not found</h1>
        <Link to="/sports" className="text-primary-600 hover:underline">← Back to Sports Hub</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <button onClick={() => navigate('/sports')} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Sports Hub
      </button>

      {/* Article container */}
      <article className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="blue">{article.category}</Badge>
            <span className="text-xs text-slate-400">{article.time}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-100">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatNumber(article.views)} views</span>
          </div>
        </div>

        {/* Banner image */}
        {article.image && (
          <div className="rounded-3xl overflow-hidden shadow-lg h-72 md:h-[400px]">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-slate max-w-none text-slate-750 leading-relaxed text-sm bg-white p-6 rounded-2xl border border-slate-100">
          <p className="whitespace-pre-line leading-relaxed mb-6">{article.content}</p>
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Read full coverage on ESPN ➔
            </a>
          )}
        </div>
      </article>
    </div>
  );
}

// ─────────────────────────────────────
// COMMUNITY DETAIL PAGE
// ─────────────────────────────────────
export function CommunityDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const community = mockCommunities.find(c => c.slug === slug);

  const [joined, setJoined] = useState(community?.isJoined || false);
  const [newPostText, setNewPostText] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop'
      },
      content: 'Hey everyone! Planning a backpacking trip across Southeast Asia next month. What are the absolute must-visit islands in Thailand that are less crowded? 🌴',
      likes: 12,
      comments: 4,
      time: '2 hours ago'
    },
    {
      id: 2,
      author: {
        name: 'James Wright',
        username: 'jameswright',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'
      },
      content: 'Just returned from Kyoto! If anyone is going soon, definitely check out the early morning bamboo grove walk at Arashiyama (around 6:30 AM). It is completely empty and magical.',
      likes: 24,
      comments: 9,
      time: '5 hours ago'
    }
  ]);

  if (!community) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">👥</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Community not found</h1>
        <Link to="/communities" className="text-primary-600 hover:underline">← Back to Communities</Link>
      </div>
    );
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: user?.name || 'You',
        username: user?.username || 'explorer',
        avatar: user?.avatar || ''
      },
      content: newPostText,
      likes: 0,
      comments: 0,
      time: 'Just now'
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button onClick={() => navigate('/communities')} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Communities
      </button>

      {/* Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden h-48 md:h-64 shadow-md">
        <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-3xl md:text-4xl border-4 border-white flex-shrink-0">
            {community.icon}
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="blue" className="mb-2">{community.sport}</Badge>
            <h1 className="text-xl md:text-3xl font-black text-white leading-tight truncate mb-1">{community.name}</h1>
            <p className="text-white/80 text-xs md:text-sm truncate max-w-2xl">{community.description}</p>
          </div>
          <Button
            variant={joined ? 'secondary' : 'primary'}
            onClick={() => setJoined(j => !j)}
            className="flex-shrink-0"
          >
            {joined ? '✓ Joined' : '+ Join'}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Card */}
          {joined ? (
            <div className="card p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Start a Conversation</h3>
              <form onSubmit={handleCreatePost} className="flex gap-3 items-start">
                <Avatar src={user?.avatar} name={user?.name || 'You'} size="sm" />
                <div className="flex-1 space-y-3">
                  <textarea
                    value={newPostText}
                    onChange={e => setNewPostText(e.target.value)}
                    placeholder={`Post something in ${community.name}...`}
                    rows={3}
                    className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none resize-none bg-slate-50 p-3 rounded-xl border border-slate-100"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" icon={<Send className="w-3.5 h-3.5" />}>Post</Button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="card p-6 text-center bg-slate-50 border border-slate-100 space-y-3">
              <div className="text-3xl">🔒</div>
              <h3 className="font-bold text-slate-800">Join to participate</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">You must join the {community.name} community to post threads and comment on discussions.</p>
              <Button variant="primary" size="sm" onClick={() => setJoined(true)}>Join Community</Button>
            </div>
          )}

          {/* Feed list */}
          <div className="space-y-4">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              Discussions
            </h2>
            {posts.map(post => (
              <div key={post.id} className="card p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar src={post.author.avatar} name={post.author.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{post.author.name}</p>
                    <p className="text-xs text-slate-400">@{post.author.username} · {post.time}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                <div className="flex gap-4 pt-2 border-t border-slate-50 text-xs text-slate-500">
                  <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments} comments</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info Sidebar */}
        <div className="space-y-6">
          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">About Community</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{community.description}</p>
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Members</span>
                <span className="font-bold text-slate-700">{formatNumber(community.members + (joined && !community.isJoined ? 1 : 0))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Weekly Posts</span>
                <span className="font-bold text-slate-700">{formatNumber(community.posts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Category</span>
                <span className="font-bold text-slate-700 capitalize">{community.sport}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
