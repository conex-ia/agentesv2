import React from 'react';
import { useTrainingData } from '../../hooks/useTrainingData';
import { useKnowledgeBases } from '../../hooks/useKnowledgeBases';

const Training = () => {
  const { trainings, loading: trainingsLoading } = useTrainingData();
  const { bases, loading: basesLoading } = useKnowledgeBases();

  const loading = trainingsLoading || basesLoading;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Treinamento</h1>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div>
          {/* Conteúdo da página será implementado aqui */}
        </div>
      )}
    </div>
  );
};

export default Training; 