export const DISPOSITIVO_NORMALIZADO = {
  'android': 'Android',
  'whatsapp android': 'Android',
  'desktop': 'WhatsApp Web',
  'whatsapp': 'WhatsApp Web',
  'whatsapp unknown': 'WhatsApp Web',
  'ios': 'iOS',
  'whatsapp web': 'WhatsApp Web',
  'typebot': 'Typebot',
  'unknown': 'Desconhecido',
  'web': 'WhatsApp Web'
} as const;

export type DispositivoNormalizado = typeof DISPOSITIVO_NORMALIZADO;

export const normalizarDispositivo = (dispositivo: string | null): string => {
  if (!dispositivo) return 'Desconhecido';
  
  const dispositivoLower = dispositivo.toLowerCase().trim();
  return DISPOSITIVO_NORMALIZADO[dispositivoLower as keyof DispositivoNormalizado] || 'Desconhecido';
}; 