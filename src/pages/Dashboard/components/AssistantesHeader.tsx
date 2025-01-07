import React, { useState } from 'react';
import { LayoutGrid, Table } from 'lucide-react';

interface AssistantesHeaderProps {
  onAddAssistant: (name: string) => Promise<{ success: boolean; error?: string }>;
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

const AssistantesHeader: React.FC<AssistantesHeaderProps> = ({
  onAddAssistant,
  viewType,
  onViewTypeChange,
}) => {
  const [isAddingAssistant, setIsAddingAssistant] = useState(false);
  const [newAssistantName, setNewAssistantName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssistantName.trim()) {
      setError('O nome do assistente é obrigatório');
      return;
    }

    setIsAddingAssistant(true);
    const result = await onAddAssistant(newAssistantName);
    setIsAddingAssistant(false);

    if (result.success) {
      setNewAssistantName('');
      setError(null);
    } else {
      setError(result.error || 'Erro ao criar assistente');
    }
  };

  return (
    <div 
      className="p-4 rounded-lg border backdrop-blur-sm"
      style={{ 
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Assistentes
          </h2>

          <div 
            className="inline-flex rounded-lg p-1"
            style={{ backgroundColor: 'var(--button-secondary-bg)' }}
          >
            <button
              onClick={() => onViewTypeChange('table')}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: viewType === 'table' ? 'var(--button-primary-bg)' : 'transparent',
                color: viewType === 'table' ? 'var(--button-primary-text)' : 'var(--text-secondary)'
              }}
            >
              <Table size={20} />
            </button>
            <button
              onClick={() => onViewTypeChange('grid')}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: viewType === 'grid' ? 'var(--button-primary-bg)' : 'transparent',
                color: viewType === 'grid' ? 'var(--button-primary-text)' : 'var(--text-secondary)'
              }}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={newAssistantName}
              onChange={(e) => setNewAssistantName(e.target.value)}
              placeholder="Nome do assistente"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              style={{ 
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
            {error && (
              <p className="mt-1 text-sm" style={{ color: 'var(--error-color)' }}>
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isAddingAssistant}
            className="px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            style={{ 
              backgroundColor: 'var(--button-primary-bg)',
              color: 'var(--button-primary-text)'
            }}
          >
            {isAddingAssistant ? 'Criando...' : 'Criar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssistantesHeader;
