import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const createBotsSubscription = (
  empresaUid: string,
  onUpdate: () => void
): RealtimeChannel => {
  return supabase.channel('custom-stats-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conex-bots',
        filter: `bot_titular=eq.${empresaUid}`
      },
      onUpdate
    )
    .subscribe();
};