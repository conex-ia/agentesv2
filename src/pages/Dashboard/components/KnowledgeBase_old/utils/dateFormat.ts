import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string) => {
  const date = addHours(new Date(dateString), -3);
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};