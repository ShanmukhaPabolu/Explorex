export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  followers: number;
  following: number;
  blogs: number;
  joinDate: string;
  badges: Badge[];
  xp: number;
  role: 'user' | 'creator' | 'admin';
  socialLinks?: { twitter?: string; instagram?: string; github?: string };
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: User;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  bookmarks: number;
  readTime: number;
  publishedAt: string;
  featured: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  budget: 'budget' | 'mid-range' | 'luxury';
  bestTime: string;
  tags: string[];
  coordinates: { lat: number; lng: number };
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  sport: string;
  description: string;
  coverImage: string;
  icon: string;
  members: number;
  posts: number;
  isJoined?: boolean;
  color: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'community';
  message: string;
  user: { name: string; avatar: string };
  time: string;
  read: boolean;
  link?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}
