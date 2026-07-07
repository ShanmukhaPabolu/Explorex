import { Link } from 'react-router-dom';
import { Star, MapPin, DollarSign } from 'lucide-react';
import type { Destination } from '../../types';
import { formatNumber } from '../../utils';

interface DestinationCardProps {
  destination: Destination;
  variant?: 'default' | 'compact';
}

export default function DestinationCard({ destination, variant = 'default' }: DestinationCardProps) {
  const budgetColors = { budget: 'text-green-600', 'mid-range': 'text-amber-600', luxury: 'text-purple-600' };
  const budgetLabels = { budget: 'Budget', 'mid-range': 'Mid-Range', luxury: 'Luxury' };

  if (variant === 'compact') {
    return (
      <Link to={`/travel/${destination.id}`} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
        <img src={destination.image} alt={destination.name} className="w-14 h-14 rounded-xl object-cover" />
        <div>
          <p className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{destination.name}</p>
          <p className="text-xs text-slate-500">{destination.country}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-xs text-slate-600 font-medium">{destination.rating}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/travel/${destination.id}`} className="card group overflow-hidden block">
      <div className="relative overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">{destination.name}</h3>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                {destination.country}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="text-white text-sm font-bold">{destination.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{destination.description}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <DollarSign className={`w-3.5 h-3.5 ${budgetColors[destination.budget]}`} />
            <span className={`font-medium ${budgetColors[destination.budget]}`}>{budgetLabels[destination.budget]}</span>
          </div>
          <span className="text-slate-400">{formatNumber(destination.reviewCount)} reviews</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {destination.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
