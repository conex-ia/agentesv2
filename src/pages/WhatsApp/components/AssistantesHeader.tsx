import React, { useState } from 'react';
import { LayoutGrid, List, Plus } from 'lucide-react';

interface AssistantesHeaderProps {
  viewType: 'grid' | 'table';
  onViewChange: (type: 'grid' | 'table') => void;
  onAddAssistant: (name: string) => void;
}

const AssistantesHeader: React.FC<AssistantesHeaderProps> = ({
  viewType,
  onViewChange,
  onAddAssistant,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAssistantName, setNewAssistantName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssistantName.trim()) {
      onAddAssistant(newAssistantName.trim());
      setNewAssistantName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
         style={{ 
           backgroundColor: 'var(--bg-primary)',
           padding: '1rem',
           borderRadius: '0.75rem',
           border: '1px solid var(--border-color)'
         }}>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Assistentes
        </h2>
        <div className="flex items-center gap-2 p-1 rounded-lg" 
             style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={() => onViewChange('table')}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: viewType === 'table' ? 'var(--bg-primary)' : 'transparent',
              color: viewType === 'table' ? 'var(--accent-color)' : 'var(--text-secondary)',
              boxShadow: viewType === 'table' ? 'var(--shadow-elevation-low)' : 'none',
              border: viewType === 'table' ? '1px solid var(--border-color)' : 'none'
            }}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => onViewChange('grid')}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: viewType === 'grid' ? 'var(--bg-primary)' : 'transparent',
              color: viewType === 'grid' ? 'var(--accent-color)' : 'var(--text-secondary)',
              boxShadow: viewType === 'grid' ? 'var(--shadow-elevation-low)' : 'none',
              border: viewType === 'grid' ? '1px solid var(--border-color)' : 'none'
            }}
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      <div className="w-full sm:w-auto">
        {isAdding ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newAssistantName}
              onChange={(e) => setNewAssistantName(e.target.value)}
              placeholder="Nome do assistente"
              className="flex-1 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                outline: 'none'
              }}
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ 
                backgroundColor: 'var(--accent-color)',
                color: 'white'
              }}
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewAssistantName('');
              }}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              Cancelar
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: 'var(--accent-color)',
              color: 'white'
            }}
          >
            <Plus size={20} />
            Novo Assistente
          </button>
        )}
      </div>
    </div>
  );
};

export default AssistantesHeader; 