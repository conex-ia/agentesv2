import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';
import { BotsStats, DEFAULT_STATS } from '../utils/types/bot';
import { calculateStats } from '../utils/stats';

export const useBotsStats = () => {
  const { empresaUid } = useAuth();
  const [stats, setStats] = useState<BotsStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresaUid) {
      setStats(DEFAULT_STATS);
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const fetchAndUpdateStats = async () => {
      if (!isSubscribed) return;
      
      try {
        const { data, error } = await supabase
          .from('conex-bots')
          .select('bot_status, bot_ativo')
          .eq('bot_titular', empresaUid);

        if (error) throw error;
        if (isSubscribed) {
          setStats(calculateStats(data));
        }
      } catch (err) {
        console.error('Error fetching bot stats:', err);
        if (isSubscribed) {
          setStats(DEFAULT_STATS);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchAndUpdateStats();

    const channelName = `stats-changes-${empresaUid}-${Date.now()}`;
    console.log('Creating stats channel:', channelName);

    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: true },
          presence: { key: channelName }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-bots',
          filter: `bot_titular=eq.${empresaUid}`
        },
        async () => {
          console.log('Stats update event received on channel:', channelName);
          if (isSubscribed) {
            await fetchAndUpdateStats();
          }
        }
      )
      .subscribe((status) => {
        console.log('Stats subscription status for channel', channelName, ':', status);
      });

    return () => {
      console.log('Cleaning up stats channel:', channelName);
      isSubscribed = false;
      channel.unsubscribe();
    };
  }, [empresaUid]);

  return { stats, loading };
};