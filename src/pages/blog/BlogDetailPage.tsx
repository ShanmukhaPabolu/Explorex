import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, Clock, Eye, ArrowLeft, Send, Twitter, Linkedin, Copy, Compass, Trash2, Edit } from 'lucide-react';
import { mockBlogs } from '../../data/mockData';
import { fetchBlogBySlug, deleteBlog } from '../../lib/blogs';
import { Avatar, Badge, Button } from '../../components/ui';
import BlogCard from '../../components/blog/BlogCard';
import { formatNumber, formatDate } from '../../utils';
import type { Blog } from '../../types';
import { useAuth } from '../../context/AuthContext';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: '1', author: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop', text: 'Absolutely stunning photography and incredible storytelling! Adding this to my bucket list immediately! 🌟', time: '2 hours ago', likes: 24 },
    { id: '2', author: 'James Wright', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop', text: 'Great tips on the budget breakdown. Very helpful for planning similar trips. Did you use any travel apps?', time: '5 hours ago', likes: 18 },
  ]);

  const handleDelete = async () => {
    if (!blog) return;
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    const res = await deleteBlog(blog.id);
    if (res.ok) {
      if (refreshUser) await refreshUser();
      navigate('/blogs');
    } else {
      alert(res.error || 'Failed to delete blog.');
    }
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetchBlogBySlug(slug)
      .then(found => {
        if (found) {
          setBlog(found);
          setLiked(found.isLiked ?? false);
          setLikes(found.likes);
          setBookmarked(found.isBookmarked ?? false);
        } else {
          // Fall back to mock data
          const mock = mockBlogs.find(b => b.slug === slug) || mockBlogs[0];
          setBlog(mock);
          setLiked(mock.isLiked ?? false);
          setLikes(mock.likes);
          setBookmarked(mock.isBookmarked ?? false);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleComment = () => {
    if (!comment.trim()) return;
    setComments(c => [{
      id: Date.now().toString(),
      author: 'You',
      avatar: '',
      text: comment,
      time: 'just now',
      likes: 0,
    }, ...c]);
    setComment('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center animate-pulse">
          <Compass className="w-6 h-6 text-primary-600" />
        </div>
        <svg className="w-6 h-6 animate-spin text-primary-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Blog not found</h1>
        <Link to="/blogs" className="text-primary-600 hover:underline">← Back to Blogs</Link>
      </div>
    );
  }

  const isAuthor = user && blog && user.id === blog.author.id;

  const related = mockBlogs
    .filter(b => b.id !== blog.id && (b.category === blog.category || b.tags.some(t => blog.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <Link to="/blogs" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Blogs
      </Link>

      {/* Article */}
      <article>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="blue">{blog.category}</Badge>
            {blog.tags.map(tag => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-slate-100">
            <Link to={`/profile/${blog.author.username}`} className="flex items-center gap-3 hover:opacity-80">
              <Avatar src={blog.author.avatar} name={blog.author.name} size="md" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">{blog.author.name}</p>
                <p className="text-xs text-slate-400">@{blog.author.username}</p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 ml-auto">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.readTime} min read</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{formatNumber(blog.views)} views</span>
              <span>{formatDate(blog.publishedAt)}</span>
              {isAuthor && (
                <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                  <button
                    onClick={() => navigate(`/write?edit=${blog.id}`)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-50 transition-all flex items-center gap-1"
                    title="Edit Post"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-semibold">Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all flex items-center gap-1"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-semibold">Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover image */}
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-72 md:h-96 object-cover rounded-2xl mb-8 shadow-lg"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}

        {/* Content */}
        <div className="prose prose-slate max-w-none mb-10 text-slate-700 leading-relaxed space-y-4">
          {blog.content.split('\n\n').map((para, i) => {
            if (para.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-slate-900 mt-8 mb-4">{para.slice(3)}</h2>;
            if (para.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-slate-900 mt-8 mb-4">{para.slice(2)}</h1>;
            return <p key={i} className="text-base">{para}</p>;
          })}
        </div>

        {/* Author card */}
        <div className="card p-6 mb-8 flex flex-col sm:flex-row gap-4 items-start">
          <Avatar src={blog.author.avatar} name={blog.author.name} size="xl" />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{blog.author.name}</h3>
                <p className="text-slate-500 text-sm">@{blog.author.username} · {formatNumber(blog.author.followers)} followers</p>
              </div>
              <Button variant="primary" size="sm">Follow</Button>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{blog.author.bio || 'Traveler & storyteller.'}</p>
          </div>
        </div>

        {/* Action bar */}
        <div className="sticky bottom-4 z-10">
          <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${liked ? 'text-red-500 bg-red-50' : 'text-slate-600 hover:text-red-500 hover:bg-red-50'}`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {formatNumber(likes)}
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all">
                <MessageCircle className="w-4 h-4" />
                {comments.length}
              </button>
              <button
                onClick={() => setBookmarked(b => !b)}
                className={`p-2 rounded-xl transition-all ${bookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Share:</span>
              {[
                { icon: Twitter, color: 'text-sky-500 hover:bg-sky-50' },
                { icon: Linkedin, color: 'text-blue-600 hover:bg-blue-50' },
                { icon: Copy, color: 'text-slate-500 hover:bg-slate-100' },
              ].map(({ icon: Icon, color }, i) => (
                <button key={i} className={`p-2 rounded-xl transition-all ${color}`}><Icon className="w-4 h-4" /></button>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Comments */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Comments ({comments.length})</h2>

        <div className="card p-4 mb-6">
          <div className="flex gap-3">
            <Avatar name="You" size="sm" />
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none"
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={handleComment} icon={<Send className="w-3.5 h-3.5" />}>Comment</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <Avatar src={c.avatar} name={c.author} size="sm" />
              <div className="flex-1">
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-900 text-sm">{c.author}</span>
                    <span className="text-slate-400 text-xs">{c.time}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{c.text}</p>
                </div>
                <div className="flex gap-3 mt-1.5 px-1">
                  <button className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {c.likes}
                  </button>
                  <button className="text-xs text-slate-400 hover:text-primary-500 transition-colors">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(b => <BlogCard key={b.id} blog={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}
