import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import React from 'react';
import { supabase } from "../../lib/supabase.ts";

interface Member {
  id: string;
  full_name: string;
  profile_type: 'influencer' | 'brand';
  created_at: string;
}

export function useCommunityStats() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalAdvertisers, setTotalAdvertisers] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCommunityStats = async () => {
    try {
      // Get total count of members
      const { count: totalMembers } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })
          .eq('profile_type', 'influencer');
      setTotalMembers(totalMembers || 0);

      const { count: totalAdvertisers } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })
          .eq('profile_type', 'brand');
      setTotalAdvertisers(totalAdvertisers || 0);

      // Get recent members
      const { data: members } = await supabase
          .from('waitlist')
          .select('id, full_name, profile_type, created_at')
          .order('created_at', { ascending: false })
          .limit(6);
      setRecentMembers(members || []);

      // Get total followers count
      const { data: followersData } = await supabase
          .from('influencer_profiles')
          .select('followers_count', { count: 'exact' })
          .eq('verified', true);

      const totalFollowers = followersData?.reduce(
          (sum, follower) => sum + (follower.followers_count || 0),
          0
      );
      setTotalFollowers(totalFollowers || 0);
    } catch (error) {
      console.error('Error fetching community stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityStats();

    // Set up real-time subscription for updates
    const subscription = supabase
        .channel('community_stats')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'waitlist'
        }, (payload) => {
          if (payload.new && payload.new.full_name) {
            const firstName = payload.new.full_name.split(' ')[0];
            toast.custom(() => {
              const content = React.createElement('div', { className: 'flex items-center gap-3' },
                  React.createElement('div', {
                    className: 'w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-purple-200 flex items-center justify-center text-sm font-medium text-purple-600'
                  }, firstName.charAt(0).toUpperCase()),
                  React.createElement('div', { className: 'flex flex-col' },
                      React.createElement('span', { className: 'font-medium text-gray-900' }, firstName),
                      React.createElement('span', { className: 'text-sm text-gray-600' }, 'acabou de entrar para a comunidade')
                  )
              );
              return content;
            }, {
              duration: 4000,
              position: 'bottom-left',
              className: 'bg-white shadow-lg border border-purple-100 rounded-xl p-3'
            });
          }
          fetchCommunityStats();
        })
        .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    totalMembers,
    totalAdvertisers,
    totalFollowers,
    recentMembers,
    isLoading
  };
}
