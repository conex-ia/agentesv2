import { useState } from 'react';
import { BotData } from '../../../hooks/useBots';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';
import { ProjetoOption } from '../../../hooks/useProjetosSelect';
import { useProject } from '../../../contexts/ProjectContext';
import AssistantTable from './AssistantTable';
import AssistantCards from './AssistantCards';
import { ChevronRight, ChevronLeft, Bot as BotIcon } from 'lucide-react';
import ConfirmationModal from '../../../pages/Dashboard/components/ConfirmationModal';
import { EmptyState } from '../../../components/EmptyState';

const ITEMS_PER_PAGE = 6;

interface AssistantGridProps {
  bots: BotData[];
  bases: KnowledgeBase[];
  projetos: ProjetoOption[];
  viewType: 'grid' | 'table';
  onBaseChange: (botUid: string, baseUid: string) => void;
  onSync: (bot: BotData) => void;
  onPause: (bot: BotData) => void;
  onDelete: (bot: BotData) => void;
  onCustomize: (bot: BotData) => void;
  onProjectChange: (botUid: string, projectId: string) => void;
}

const AssistantGrid = ({
  bots,
  bases,
  projetos,
  viewType,
  onBaseChange,
  onSync,
  onPause,
  onDelete,
  onCustomize,
  onProjectChange
}: AssistantGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(currentPage.toString());
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [modalType, setModalType] = useState<'pause' | 'delete' | null>(null);
  const { selectedProject } = useProject();

  // Encontra o nome do projeto selecionado
  const selectedProjectName = selectedProject !== 'all' 
    ? projetos.find(p => p.uid === selectedProject)?.nome 
    : null;

  // Verifica se não há bots para exibir
  if (bots.length === 0) {
    return (
      <EmptyState
        icon={BotIcon}
        title={selectedProject === 'all' 
          ? "Nenhum assistente encontrado" 
          : `Nenhum assistente vinculado ao projeto ${selectedProjectName}`}
        description={selectedProject === 'all'
          ? "Crie seu primeiro assistente clicando no botão 'Novo Assistente'"
          : "Vincule um assistente a este projeto ou crie um novo assistente"}
      />
    );
  }

  // Calcula o total de páginas
  const totalPages = Math.ceil(bots.length / ITEMS_PER_PAGE);

  // Obtém os bots da página atual
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBots = bots.slice(startIndex, endIndex);

  // Handler para mudança de página via input
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  // Handler para submissão da página via input
  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(inputPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  // Handler para navegação via botão
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage(page.toString());
    }
  };

  // Handlers para os modais
  const handlePauseClick = (bot: BotData) => {
    setSelectedBot(bot);
    setModalType('pause');
  };

  const handleDeleteClick = (bot: BotData) => {
    setSelectedBot(bot);
    setModalType('delete');
  };

  const handleModalClose = () => {
    setSelectedBot(null);
    setModalType(null);
  };

  const handleModalConfirm = async () => {
    if (!selectedBot || !modalType) return { success: false, message: 'Erro ao processar ação.' };

    try {
      if (modalType === 'pause') {
        await onPause(selectedBot);
        return { success: true, message: 'Assistente pausado com sucesso!' };
      } else {
        await onDelete(selectedBot);
        return { success: true, message: 'Assistente excluído com sucesso!' };
      }
    } catch (error) {
      return { success: false, message: 'Erro ao processar ação.' };
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div 
        className={viewType === 'table' ? 'overflow-x-auto rounded-lg bg-[var(--bg-primary)]' : ''}
      >
        {viewType === 'table' ? (
          <AssistantTable
            bots={currentBots}
            bases={bases}
            projetos={projetos}
            onBaseChange={onBaseChange}
            onSync={onSync}
            onPause={handlePauseClick}
            onDelete={handleDeleteClick}
            onCustomize={onCustomize}
            onProjectChange={onProjectChange}
          />
        ) : (
          <AssistantCards
            bots={currentBots}
            bases={bases}
            projetos={projetos}
            onBaseChange={onBaseChange}
            onSync={onSync}
            onPause={handlePauseClick}
            onDelete={handleDeleteClick}
            onCustomize={onCustomize}
            onProjectChange={onProjectChange}
          />
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {currentPage > 1 && (
            <ChevronLeft 
              className="cursor-pointer"
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ 
                color: 'var(--text-primary)'
              }}
            />
          )}
          <input
            type="text"
            value={inputPage}
            onChange={handlePageInputChange}
            onBlur={handlePageInputSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handlePageInputSubmit()}
            className="w-12 text-center rounded-lg p-1"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>de {totalPages}</span>
          {currentPage < totalPages && (
            <ChevronRight 
              className="cursor-pointer"
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ 
                color: 'var(--text-primary)'
              }}
            />
          )}
        </div>
      )}

      {/* Modal de Confirmação */}
      {selectedBot && modalType && (
        <ConfirmationModal
          isOpen={true}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          title={modalType === 'pause' ? 'Pausar Assistente' : 'Excluir Assistente'}
          assistantName={selectedBot.bot_nome.split('.')[0]}
          assistantImage={selectedBot.bot_perfil || null}
          actionType={modalType}
        />
      )}
    </div>
  );
};

export default AssistantGrid; 