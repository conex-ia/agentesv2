import { BotData, BotsStats, DEFAULT_STATS } from './types/bot';

export const calculateStats = (data: BotData[] | null): BotsStats => {
  if (!data || !Array.isArray(data)) {
    return DEFAULT_STATS;
  }

  return {
    total: data.length,
    online: data.filter(bot => bot.bot_status === 'open').length,
    offline: data.filter(bot => bot.bot_status !== 'open').length,
    active: data.filter(bot => bot.bot_ativo).length,
    inactive: data.filter(bot => !bot.bot_ativo).length
  };
};