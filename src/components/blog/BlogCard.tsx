import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Bookmark, Share2, Clock } from 'lucide-react';
import type { Blog } from '../../types';
import { Avatar, Badge } from '../ui';
import { formatNumber, formatDate } from '../../utils';

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
}

export default function BlogCard({ blog, variant = 'default' }: BlogCardProps) {
  const [liked, setLiked] = useState(blog.isLiked || false);
  const [bookmarked, setBookmarked] = useState(blog.isBookmarked || false);
  const [likes, setLikes] = useState(blog.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(l => !l);
    setLikes(n => liked ? n - 1 : n + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarked(b => !b);
  };

  if (variant === 'compact') {
    return (
      <Link to={`/blog/${blog.slug}`} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
        <img src={blog.coverImage} alt={blog.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">{blog.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">{formatDate(blog.publishedAt)}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">{blog.readTime} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/blog/${blog.slug}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-card transition-all group">
        <img src={blog.coverImage} alt={blog.title} className="w-32 h-24 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="blue">{blog.category}</Badge>
            <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
          </div>
          <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">{blog.title}</h3>
          <div className="flex items-center gap-3">
            <Avatar src={blog.author.avatar} name={blog.author.name} size="xs" />
            <span className="text-xs text-slate-600 font-medium">{blog.author.name}</span>
            <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
              <Heart className="w-3 h-3" />{formatNumber(blog.likes)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/blog/${blog.slug}`} className="relative group block rounded-2xl overflow-hidden">
        <img src={blog.coverImage} alt={blog.title} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="blue">{blog.category}</Badge>
            <span className="text-white/70 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min read</span>
          </div>
          <h2 className="text-white text-xl font-bold line-clamp-2 mb-3 group-hover:text-primary-300 transition-colors">{blog.title}</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar src={blog.author.avatar} name={blog.author.name} size="sm" />
              <div>
                <p className="text-white text-xs font-medium">{blog.author.name}</p>
                <p className="text-white/60 text-xs">{formatDate(blog.publishedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/70 text-xs">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{formatNumber(blog.likes)}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(blog.views)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <div className="card group overflow-hidden">
      <Link to={`/blog/${blog.slug}`} className="block">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="blue">{blog.category}</Badge>
            {blog.featured && <Badge variant="amber">✨ Featured</Badge>}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">{blog.readTime} min read</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">{formatDate(blog.publishedAt)}</span>
        </div>

        <Link to={`/blog/${blog.slug}`}>
          <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
            {blog.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{blog.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {blog.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author & Actions */}
        <div className="flex items-center justify-between">
          <Link to={`/profile/${blog.author.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar src={blog.author.avatar} name={blog.author.name} size="sm" />
            <div>
              <p className="text-xs font-semibold text-slate-800">{blog.author.name}</p>
              <p className="text-xs text-slate-400">@{blog.author.username}</p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${liked ? 'text-red-500 bg-red-50' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}`}
            >
              <Heart className={`w-3.5 h-3.5 transition-all ${liked ? 'fill-current scale-110' : ''}`} />
              {formatNumber(likes)}
            </button>
            <Link to={`/blog/${blog.slug}`} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
              <MessageCircle className="w-3.5 h-3.5" />
              {blog.comments}
            </Link>
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg transition-all ${bookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
