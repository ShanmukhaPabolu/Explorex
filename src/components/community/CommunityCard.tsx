import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare } from 'lucide-react';
import type { Community } from '../../types';
import { formatNumber } from '../../utils';
import { Button } from '../ui';

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  const [joined, setJoined] = useState(community.isJoined || false);

  return (
    <div className="card overflow-hidden group">
      <div className="relative h-24 overflow-hidden">
        <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${community.color}40, transparent)` }} />
      </div>

      <div className="px-5 pb-5 -mt-6 relative">
        <div className="flex items-end justify-between mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl border-2 border-white">
            {community.icon}
          </div>
          <Button
            variant={joined ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setJoined(j => !j)}
          >
            {joined ? '✓ Joined' : '+ Join'}
          </Button>
        </div>

        <Link to={`/communities/${community.slug}`}>
          <h3 className="font-bold text-slate-900 hover:text-primary-600 transition-colors mb-1">{community.name}</h3>
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{community.description}</p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-primary-400" />
            <span className="font-semibold text-slate-700">{formatNumber(community.members)}</span> members
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-secondary-400" />
            <span className="font-semibold text-slate-700">{formatNumber(community.posts)}</span> posts
          </span>
        </div>
      </div>
    </div>
  );
}
