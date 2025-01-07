export interface Bot {
  uid: string;
  bot_nome: string;
  bot_status: string;
  bot_ligado: boolean;
  bot_perfil: string | null;
  bot_numero: string | null;
}

export interface ConfirmModalState {
  isOpen: boolean;
  botId?: string;
  botName?: string;
  botImage?: string | null;
  action?: 'pause' | 'delete';
}

export interface SyncModalState {
  isOpen: boolean;
  botId?: string;
  botName?: string;
  botImage?: string | null;
}

export interface KnowledgeBaseOption {
  value: string;
  label: string;
}