import React from 'react';
import { useKnowledgeBases } from '../../hooks/useKnowledgeBases';
import { LoadingState } from '../../components/LoadingState';
import { KnowledgeBasePage } from './components/KnowledgeBase/KnowledgeBasePage';
import WelcomeBar from './components/WelcomeBar';
import useAuth from '../../stores/useAuth';

interface KnowledgeBasesProps {
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
  userName?: string;
}

const KnowledgeBases: React.FC<KnowledgeBasesProps> = ({
  viewType,
  onViewTypeChange,
  userName = ''
}) => {
  const { loading: basesLoading } = useKnowledgeBases();
  const { userUid } = useAuth();

  if (basesLoading) {
    return <LoadingState />;
  }

  return (
    <div className="px-6">
      <WelcomeBar
        userName={userName}
        message="Bem-vindo ao seu painel de controle"
        activeScreen="knowledge-bases"
      />
      <div className="max-w-7xl mx-auto space-y-6">
        <KnowledgeBasePage
          viewType={viewType}
          onViewTypeChange={onViewTypeChange}
        />
      </div>
    </div>
  );
};

export default KnowledgeBases;
