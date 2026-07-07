import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, BookOpen, MapPin, Star, ChevronDown, Play, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { mockBlogs, mockDestinations, mockCommunities, mockUsers, stats } from '../data/mockData';
import BlogCard from '../components/blog/BlogCard';
import DestinationCard from '../components/travel/DestinationCard';
import CommunityCard from '../components/community/CommunityCard';
import { Avatar, Badge } from '../components/ui';
import { formatNumber } from '../utils';

function AnimatedCount({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <div ref={ref}>{formatNumber(count)}+</div>;
}

const testimonials = [
  { name: 'Aisha Patel', role: 'Travel Blogger', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop', quote: 'ExploreX completely transformed how I share my travel stories. The AI planner is a game-changer!', rating: 5 },
  { name: 'James Wright', role: 'Sports Journalist', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', quote: 'The sports communities here are incredibly engaged. Best platform for combining travel and sports content.', rating: 5 },
  { name: 'Mei Lin', role: 'Adventure Seeker', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', quote: 'Found my tribe on ExploreX! Amazing people, amazing stories. Couldn\'t imagine traveling without this community.', rating: 5 },
];

const faqs = [
  { q: 'Is ExploreX free to use?', a: 'Yes! ExploreX is completely free to join. We offer premium creator tools for serious bloggers, but the core platform is free forever.' },
  { q: 'How does the AI Travel Planner work?', a: 'Our AI analyzes thousands of travel reports, budget data, and seasonal information to create personalized itineraries based on your preferences and budget.' },
  { q: 'Can I monetize my travel blog?', a: 'Absolutely! Top creators can monetize through our partnership program, brand collaborations, and exclusive content subscriptions.' },
  { q: 'What sports communities are available?', a: 'We have dedicated communities for Cricket, Football, Basketball, Badminton, Volleyball, Tennis, and many more sports.' },
  { q: 'Is there a mobile app?', a: 'Our mobile-optimized web app works great on all devices. Native iOS and Android apps are coming soon!' },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'travel' | 'sports'>('travel');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=1080&fit=crop"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/60 to-primary-900/50" />
        </div>

        {/* Animated blobs */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI-powered travel planning is here
            <ArrowRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
            Explore The World.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Share Your Story.
            </span>
          </h1>

          <p className="text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Join thousands of travelers and sports enthusiasts sharing experiences around the globe. Discover hidden gems, connect with communities, and plan your perfect adventure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-2xl hover:shadow-glow-blue text-lg">
              <Globe className="w-5 h-5" />
              Start Exploring
            </Link>
            <Link to="/write" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl transition-all border border-white/30 text-lg">
              <Play className="w-5 h-5" />
              Write Your Story
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Active Users', value: stats.users, icon: Users },
              { label: 'Blog Posts', value: stats.blogs, icon: BookOpen },
              { label: 'Destinations', value: stats.destinations, icon: MapPin },
              { label: 'Communities', value: stats.communities, icon: Zap },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <stat.icon className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">
                  <AnimatedCount value={stat.value} />
                </div>
                <div className="text-white/60 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ─── Trending Destinations ─── */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Trending</span>
              </div>
              <h2 className="section-heading">Popular Destinations</h2>
              <p className="text-slate-500 mt-2">Explore the world's most visited and loved destinations</p>
            </div>
            <Link to="/travel" className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDestinations.map(d => <DestinationCard key={d.id} destination={d} />)}
          </div>
        </div>
      </section>

      {/* ─── Featured Blogs ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-secondary-600" />
                <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wide">Latest Stories</span>
              </div>
              <h2 className="section-heading">Featured Blogs</h2>
              <p className="text-slate-500 mt-2">Stories from explorers and sports enthusiasts around the world</p>
            </div>
            <div className="hidden md:flex gap-2">
              {(['travel', 'sports'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBlogs
              .filter(b => activeTab === 'sports' ? b.category === 'Sports' : b.category !== 'Sports')
              .slice(0, 3)
              .map(b => <BlogCard key={b.id} blog={b} />)
            }
          </div>

          <div className="mt-10 text-center">
            <Link to="/blogs" className="btn-secondary">
              View all blogs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Sports Communities ─── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-primary-900 to-secondary-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-semibold text-primary-400 uppercase tracking-wide">Communities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Popular Sports Communities</h2>
            <p className="text-white/60 text-lg">Join thousands of sports fans in real-time discussions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCommunities.slice(0, 3).map(c => <CommunityCard key={c.id} community={c} />)}
          </div>

          <div className="mt-10 text-center">
            <Link to="/communities" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-all border border-white/20">
              Explore all communities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Creators ─── */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">Meet Our Top Creators</h2>
            <p className="text-slate-500 text-lg">Inspiring storytellers from around the globe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockUsers.map(creator => (
              <div key={creator.id} className="card p-6 text-center group">
                <div className="relative inline-block mb-4">
                  <Avatar src={creator.avatar} name={creator.name} size="2xl" />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {creator.badges[0]?.icon || '⭐'}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-0.5">{creator.name}</h3>
                <p className="text-slate-500 text-sm mb-3">@{creator.username} · {creator.location}</p>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">{creator.bio}</p>
                <div className="flex justify-center gap-6 text-sm mb-4">
                  <div className="text-center">
                    <div className="font-bold text-slate-900">{formatNumber(creator.followers)}</div>
                    <div className="text-slate-400 text-xs">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-900">{creator.blogs}</div>
                    <div className="text-slate-400 text-xs">Blogs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-900">{formatNumber(creator.xp)}</div>
                    <div className="text-slate-400 text-xs">XP</div>
                  </div>
                </div>
                <Link to={`/profile/${creator.username}`} className="btn-secondary w-full text-center text-sm py-2">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Travel Planner Showcase ─── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">AI-Powered</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4">
                Plan Your Perfect Trip with{' '}
                <span className="gradient-text">AI Intelligence</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Tell us your destination, budget, and travel style. Our AI creates a complete personalized itinerary with cost breakdowns, activity suggestions, and insider tips.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: '🗺️', title: 'Smart Itinerary', desc: 'Day-by-day plans optimized for your travel style' },
                  { icon: '💰', title: 'Budget Breakdown', desc: 'Detailed cost estimates for every activity and meal' },
                  { icon: '🎯', title: 'Local Recommendations', desc: 'Hidden gems and must-see spots based on real traveler data' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/ai-planner" className="btn-primary text-lg px-8 py-4">
                Try AI Planner Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* AI Preview Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur-3xl opacity-10 scale-95" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">AI Itinerary: Bali, Indonesia</p>
                    <p className="text-xs text-slate-400">7 days · $1,200 budget · 2 travelers</p>
                  </div>
                  <Badge variant="green" className="ml-auto">Generated</Badge>
                </div>

                {[
                  { day: 'Day 1', activities: ['Arrive in Denpasar', 'Check into eco resort', 'Sunset at Kuta Beach'], cost: '$180' },
                  { day: 'Day 2', activities: ['Tegallalang Rice Terraces', 'Ubud Monkey Forest', 'Traditional cooking class'], cost: '$65' },
                  { day: 'Day 3', activities: ['Mount Batur sunrise hike', 'Banjar Hot Springs', 'Lovina beach dinner'], cost: '$90' },
                ].map((day, i) => (
                  <div key={i} className={`flex gap-4 p-3 rounded-xl mb-2 ${i === 0 ? 'bg-primary-50' : 'hover:bg-slate-50'} transition-colors`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {day.day.split(' ')[1]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold mb-1 ${i === 0 ? 'text-primary-700' : 'text-slate-700'}`}>{day.day}</p>
                      <div className="flex flex-wrap gap-1">
                        {day.activities.map(a => (
                          <span key={a} className="text-xs bg-white border border-slate-200 text-slate-600 rounded-full px-2 py-0.5">{a}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">{day.cost}</span>
                  </div>
                ))}

                <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Estimated Total</span>
                  <span className="text-lg font-black text-primary-600">$1,184 / 2 people</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 bg-gradient-to-b from-surface to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">Loved by Explorers Worldwide</h2>
            <p className="text-slate-500">See what our community has to say</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <Avatar src={t.avatar} name={t.name} size="md" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know about ExploreX</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-white/80 text-lg mb-8">Join 128,000+ explorers already sharing their stories on ExploreX</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl hover:shadow-2xl transition-all text-lg">
              Create Free Account
            </Link>
            <Link to="/explore" className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-lg">
              Browse Content
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
