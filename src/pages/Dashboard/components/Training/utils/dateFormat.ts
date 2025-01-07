import { format, addHours, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string) => {
  try {
    const date = addHours(new Date(dateString), 0);
    if (!isValid(date)) {
      console.warn('Data inválida:', dateString);
      return 'Data inválida';
    }
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};
