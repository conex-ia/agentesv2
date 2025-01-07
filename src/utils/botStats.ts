interface BotData {
  bot_status: string;
}

export const calculateBotStats = (data: BotData[]) => {
  if (!Array.isArray(data)) {
    return {
      total: 0,
      online: 0,
      offline: 0
    };
  }

  return {
    total: data.length,
    online: data.filter(bot => bot.bot_status === 'open').length,
    offline: data.filter(bot => bot.bot_status !== 'open').length
  };
};