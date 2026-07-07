import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, TrendingUp, Clock, Flame, PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockBlogs } from '../../data/mockData';
import { fetchBlogs } from '../../lib/blogs';
import BlogCard from '../../components/blog/BlogCard';
import type { Blog } from '../../types';

const categories = ['All', 'Travel', 'Sports', 'Adventure', 'Food & Travel'];
const sorts = [
  { label: 'Trending', icon: Flame },
  { label: 'Latest', icon: Clock },
  { label: 'Most Viewed', icon: TrendingUp },
];

export default function BlogsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Latest');
  const [realBlogs, setRealBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    fetchBlogs()
      .then(blogs => setRealBlogs(blogs))
      .finally(() => setLoadingBlogs(false));
  }, []);

  // Merge: real blogs first (newest), then mock blogs as filler
  const allBlogs: Blog[] = [
    ...realBlogs,
    ...mockBlogs.filter(m => !realBlogs.some(r => r.id === m.id)),
  ];

  const sorted = [...allBlogs].sort((a, b) => {
    if (activeSort === 'Most Viewed') return b.views - a.views;
    if (activeSort === 'Trending') return b.likes - a.likes;
    // Latest
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const filtered = sorted.filter(b => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat =
      activeCategory === 'All' ||
      b.category.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  const featured = filtered.filter(b => b.featured).slice(0, 2);
  const rest = filtered.filter(b => !featured.includes(b));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Explore Blogs</h1>
          <p className="text-slate-500">
            Discover stories from travelers and sports enthusiasts around the world
          </p>
        </div>
        <Link
          to="/write"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <PenSquare className="w-4 h-4" />
          Write a Blog
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search blogs, tags, authors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {sorts.map(s => (
            <button
              key={s.label}
              onClick={() => setActiveSort(s.label)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSort === s.label
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
              }`}
            >
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:border-primary-300 transition-all">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loadingBlogs && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-slate-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading blogs…
          </div>
        </div>
      )}

      {/* Real blogs banner */}
      {!loadingBlogs && realBlogs.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-primary-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse inline-block" />
          {realBlogs.length} community {realBlogs.length === 1 ? 'blog' : 'blogs'} published
        </div>
      )}

      {/* Featured blogs */}
      {featured.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">✨ Featured</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map(b => <BlogCard key={b.id} blog={b} variant="featured" />)}
          </div>
        </div>
      )}

      {/* All blogs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            All Stories <span className="text-slate-400 font-normal text-base">({filtered.length})</span>
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No blogs found</h3>
            <p className="text-slate-400">Try different search terms or category filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {(rest.length > 0 ? rest : filtered).map(b => <BlogCard key={b.id} blog={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
