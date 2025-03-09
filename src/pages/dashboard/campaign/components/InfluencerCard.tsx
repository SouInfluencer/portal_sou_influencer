import React from 'react';
import { Users, BarChart2, MapPin, ChevronRight } from 'lucide-react';
import type { Influencer } from '../types';

interface InfluencerCardProps {
  influencer: Influencer;
  onClick: () => void;
}

export function InfluencerCard({ influencer, onClick }: InfluencerCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-6 py-6 shadow-sm hover:shadow-lg flex items-center space-x-4 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
    >
      <div className="flex-shrink-0">
        <img 
          src={influencer.avatar}
          alt={influencer.name}
          className="h-16 w-16 rounded-full ring-4 ring-white shadow-lg"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex items-center mb-2">
            <p className="text-lg font-semibold text-gray-900">{influencer.name}</p>
            <div className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
              influencer.platform === 'Instagram' ? 'bg-pink-100 text-pink-800' :
              influencer.platform === 'YouTube' ? 'bg-red-100 text-red-800' :
              'bg-black bg-opacity-10 text-gray-900'
            }`}>
              {influencer.platform}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {influencer.followers.toLocaleString()}
            </div>
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-1" />
              {influencer.engagement}%
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {influencer.categories.map(category => (
              <span
                key={category}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {category}
              </span>
            ))}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <MapPin className="h-3 w-3 mr-1" />
              {influencer.location}
            </span>
          </div>
        </div>
      </div>
      <ChevronRight className="h-6 w-6 text-indigo-400" />
    </button>
  );
}