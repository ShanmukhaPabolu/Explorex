import { supabase } from './supabase';
import type { Blog } from '../types';

/** Row shape returned from Supabase */
interface BlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_id: string;
  author_name: string;
  author_username: string;
  author_avatar: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  bookmarks: number;
  read_time: number;
  featured: boolean;
  published_at: string;
}

function rowToBlog(row: BlogRow): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || row.content.slice(0, 150) + '…',
    content: row.content,
    coverImage: row.cover_image ||
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=400&fit=crop',
    author: {
      id: row.author_id,
      name: row.author_name,
      username: row.author_username || row.author_name.toLowerCase().replace(/\s+/g, ''),
      email: '',
      avatar: row.author_avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(row.author_name)}&background=6366f1&color=fff&size=128`,
      followers: 0,
      following: 0,
      blogs: 0,
      joinDate: row.published_at,
      badges: [],
      xp: 0,
      role: 'user',
    },
    category: row.category,
    tags: row.tags ?? [],
    likes: row.likes,
    comments: row.comments,
    views: row.views,
    bookmarks: row.bookmarks,
    readTime: row.read_time,
    publishedAt: row.published_at,
    featured: row.featured,
  };
}

function makeSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) +
    '-' +
    Date.now()
  );
}

/** Fetch all blogs ordered newest first */
export async function fetchBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('published_at', { ascending: false });
  if (error || !data) return [];
  return (data as BlogRow[]).map(rowToBlog);
}

/** Fetch only blogs written by the current user */
export async function fetchMyBlogs(authorId: string): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('author_id', authorId)
    .order('published_at', { ascending: false });
  if (error || !data) return [];
  return (data as BlogRow[]).map(rowToBlog);
}

/** Fetch a single blog by slug */
export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;
  return rowToBlog(data as BlogRow);
}

/** Fetch a single blog by ID */
export async function fetchBlogById(id: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToBlog(data as BlogRow);
}

/** Publish a new blog */
export async function publishBlog(params: {
  title: string;
  content: string;
  category: string;
  tags: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
}): Promise<{ ok: boolean; slug?: string; error?: string }> {
  const wordCount = params.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const slug = makeSlug(params.title);
  const excerpt = params.content.replace(/\n+/g, ' ').slice(0, 160) + '…';

  const { error } = await supabase.from('blogs').insert({
    title: params.title,
    slug,
    excerpt,
    content: params.content,
    cover_image: params.coverImage,
    author_id: params.authorId,
    author_name: params.authorName,
    author_username: params.authorUsername,
    author_avatar: params.authorAvatar,
    category: params.category,
    tags: params.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean),
    read_time: readTime,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, slug };
}

/** Update an existing blog */
export async function updateBlog(
  id: string,
  params: {
    title: string;
    content: string;
    category: string;
    tags: string;
    coverImage: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  const wordCount = params.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const excerpt = params.content.replace(/\n+/g, ' ').slice(0, 160) + '…';

  const { error } = await supabase
    .from('blogs')
    .update({
      title: params.title,
      excerpt,
      content: params.content,
      cover_image: params.coverImage,
      category: params.category,
      tags: params.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      read_time: readTime,
    })
    .eq('id', id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Delete a blog by id */
export async function deleteBlog(id: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Increment view count */
export async function incrementViews(blogId: string) {
  try {
    await supabase.rpc('increment_views', { blog_id: blogId });
  } catch {}
}
