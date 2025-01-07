export interface BotData {
  uid: string;
  bot_nome: string;
  bot_status: string;
  bot_ligado: boolean;
  bot_perfil: string | null;
  bot_numero: string | null;
  bot_ativo: boolean;
}

export interface BotsStats {
  total: number;
  online: number;
  offline: number;
  active: number;
  inactive: number;
}

export const DEFAULT_STATS: BotsStats = {
  total: 0,
  online: 0,
  offline: 0,
  active: 0,
  inactive: 0
};