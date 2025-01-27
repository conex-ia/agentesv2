import React, { useState, useCallback, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Upload, 
  Check,
  XCircle,
  Clock,
  FileCheck,
  BookOpen,
  Brain,
  CheckCircle,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../../lib/supabase';
import useAuth from '../../../stores/useAuth';
import { useKnowledgeBases } from '../../../hooks/useKnowledgeBases';

interface ModalAddTreinamentoProps {
  isOpen: boolean;
  onClose: () => void;
  trainingId?: string;
  currentPhase?: string;
}

const phaseIcons = {
  aguardando: <Clock size={32} className="text-emerald-500" />,
  recebido: <FileCheck size={32} className="text-emerald-500" />,
  leitura: <BookOpen size={32} className="text-emerald-500" />,
  treinamento: <Brain size={32} className="text-emerald-500" />,
  finalizado: <CheckCircle size={32} className="text-emerald-500" />,
  'recebido erro': <AlertCircle size={32} className="text-red-500" />,
  'leitura erro': <AlertCircle size={32} className="text-red-500" />,
  'treinamento erro': <AlertCircle size={32} className="text-red-500" />,
  'finalizado erro': <AlertCircle size={32} className="text-red-500" />
};

const phaseMessages = {
  aguardando: 'Aguardando o Conteúdo',
  recebido: 'Conteúdo Recebido',
  leitura: 'Leitura Realizada',
  treinamento: 'Treinando o Assistente',
  finalizado: 'Treinamento Realizado',
  'recebido erro': 'Erro no Recebimento',
  'leitura erro': 'Erro na leitura',
  'treinamento erro': 'Erro no treinamento',
  'finalizado erro': 'Erro na finalização'
};

const ModalAddTreinamento = ({
  isOpen,
  onClose,
  trainingId,
  currentPhase = 'aguardando'
}: ModalAddTreinamentoProps) => {
  const { empresaUid } = useAuth();
  const { bases } = useKnowledgeBases();
  const [selectedBase, setSelectedBase] = useState('');
  const [treinoAcao, setTreinoAcao] = useState('Adicionar Treinamento');
  const [treinoFonte, setTreinoFonte] = useState('Treinar por PDF');
  const [url, setUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phase, setPhase] = useState(currentPhase);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPhase(currentPhase);
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadComplete(false);
      setUrl('');
      setIsUploading(false);
      setSummary('');
      setShowSummary(false);
      setSelectedBase('');
    }
  }, [isOpen, currentPhase]);

  useEffect(() => {
    if (!isOpen || !trainingId) return;

    setPhase(currentPhase);

    const channel = supabase.channel('custom-training-phase')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-treinamentos',
          filter: `uid=eq.${trainingId}`
        },
        (payload) => {
          if (payload.new && 'phase' in payload.new) {
            setPhase(payload.new.phase as string);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, trainingId, currentPhase]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setSelectedFile(file);
    
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione apenas arquivos PDF.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('empresaUid', empresaUid || '');
      formData.append('baseUid', trainingId || '');
      
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-uploadfile', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setUploadComplete(true);
        setUploadProgress(100);
        setUrl(data.url);
      } else {
        throw new Error(data.message || 'Erro ao fazer upload do arquivo');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Erro ao fazer upload do arquivo. Por favor, tente novamente.');
    } finally {
      setIsUploading(false);
    }
  }, [empresaUid, trainingId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div 
        className="relative w-full max-w-xl p-6 rounded-lg shadow-lg"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {treinoAcao}
          </h2>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            {treinoFonte}
          </p>
        </div>

        {phase === 'aguardando' ? (
          <>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-emerald-500' : 'border-gray-600'}
                ${selectedFile ? 'bg-emerald-500/10' : 'hover:bg-[var(--bg-secondary)]'}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center gap-2">
                {selectedFile ? (
                  <>
                    <FileText size={32} className="text-emerald-500" />
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {selectedFile.name}
                    </p>
                    {isUploading ? (
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-emerald-500 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    ) : uploadComplete ? (
                      <Check size={24} className="text-emerald-500" />
                    ) : null}
                  </>
                ) : (
                  <>
                    <Upload size={32} style={{ color: 'var(--text-secondary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {isDragActive
                        ? 'Solte o arquivo aqui'
                        : 'Arraste e solte um arquivo PDF aqui, ou clique para selecionar'}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Base de Conhecimento
              </label>
              <select
                value={selectedBase}
                onChange={(e) => setSelectedBase(e.target.value)}
                className="w-full p-2.5 rounded-lg border text-sm"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">Selecione uma base</option>
                {bases.map((base) => (
                  <option key={base.uid} value={base.uid}>
                    {base.nome}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            {phaseIcons[phase as keyof typeof phaseIcons]}
            <h3 
              className="mt-4 text-lg font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {phaseMessages[phase as keyof typeof phaseMessages]}
            </h3>
            {phase.includes('erro') && (
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Fechar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalAddTreinamento;
