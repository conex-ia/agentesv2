import { 
  Clock, 
  FileCheck, 
  BookOpen, 
  Brain, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

export const ITEMS_PER_PAGE = 6;

export const phaseIcons = {
  aguardando: Clock,
  recebido: FileCheck,
  leitura: BookOpen,
  treinamento: Brain,
  finalizado: CheckCircle,
  'recebido erro': AlertCircle,
  'leitura erro': AlertCircle,
  'treinamento erro': AlertCircle,
  'finalizado erro': AlertCircle
};

export const phaseMessages = {
  aguardando: 'Aguardando',
  recebido: 'Recebido',
  leitura: 'Em Leitura',
  treinamento: 'Treinando',
  finalizado: 'Finalizado',
  'recebido erro': 'Erro no Recebimento',
  'leitura erro': 'Erro na leitura',
  'treinamento erro': 'Erro no treinamento',
  'finalizado erro': 'Erro na finalização'
};
