export type ViewType = 'table' | 'grid';

export interface LaboratorioData {
  uid: string;
  nome: string;
  descricao?: string;
  dataCriacao: string;
  projeto: string;
  status: string;
}
