import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Upload, 
  Check,
  XCircle,
  Clock,
  FileCheck,
  Image as ImageIcon,
  Package,
  CheckCircle,
  Activity,
  AlertCircle,
  Brain,
  Circle
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../../lib/supabase';
import useAuth from '../../../stores/useAuth';
import { useKnowledgeBases } from '../../../hooks/useKnowledgeBases';
import { API_CONFIG } from '../../../config/api';

interface ModalAddProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  produtoId?: string;
  currentPhase?: string;
}

interface MinioConfig {
  endPoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
}

interface FileWithDescription {
  file: File;
  description: string;
  preview: string;
}

const minioConfig: MinioConfig = {
  endPoint: 'https://newapi.conexcondo.com.br',
  accessKey: '5nZfsMSBVWH2XKSYK0md',
  secretKey: 'Dkv3HxXnBvbDwW35DMEMg4i9gRtry6cbh2mD78Xp',
  bucket: 'conex-produtos',
  region: 'us-east-1'
};

const STATUS_CONFIG = {
  aguardando: {
    icon: Clock,
    label: 'Aguardando',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  recebido: {
    icon: CheckCircle,
    label: 'Recebido',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  'recebido erro': {
    icon: AlertCircle,
    label: 'Erro no Recebimento',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  leitura: {
    icon: FileCheck,
    label: 'Em Leitura',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  'leitura erro': {
    icon: XCircle,
    label: 'Erro na Leitura',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  treinamento: {
    icon: Brain,
    label: 'Em Treinamento',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  'treinamento erro': {
    icon: AlertCircle,
    label: 'Erro no Treinamento',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  finalizado: {
    icon: Check,
    label: 'Finalizado',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  'finalizado erro': {
    icon: XCircle,
    label: 'Erro na Finalização',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  enviado: {
    icon: Upload,
    label: 'Arquivo Enviado',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  }
};

const phaseIcons = {
  aguardando: <Clock size={32} className="text-emerald-500" />,
  recebido: <FileCheck size={32} className="text-emerald-500" />,
  processando: <ImageIcon size={32} className="text-emerald-500" />,
  finalizado: <CheckCircle size={32} className="text-emerald-500" />,
  'recebido erro': <AlertCircle size={32} className="text-red-500" />,
  'processando erro': <AlertCircle size={32} className="text-red-500" />,
  'finalizado erro': <AlertCircle size={32} className="text-red-500" />,
  enviado: <Upload size={32} className="text-blue-500" />
};

const phaseMessages = {
  aguardando: 'Aguardando o Conteúdo',
  recebido: 'Imagem Recebida',
  processando: 'Processando Imagem',
  finalizado: 'Produto Cadastrado',
  'recebido erro': 'Erro no Recebimento',
  'processando erro': 'Erro no processamento',
  'finalizado erro': 'Erro na finalização',
  enviado: 'Arquivo Enviado'
};

const phaseMap = {
  'aguardando': {
    icon: <div className="bg-emerald-500/10 p-4 rounded-full">
      <Clock size={48} className="text-emerald-500" />
    </div>,
    message: 'Aguardando Leitura'
  },
  'recebimento erro': {
    icon: <div className="bg-red-500/10 p-4 rounded-full">
      <AlertCircle size={48} className="text-red-500" />
    </div>,
    message: 'Erro no recebimento dos arquivos'
  },
  'recebido': {
    icon: <div className="bg-emerald-500/10 p-4 rounded-full">
      <FileCheck size={48} className="text-emerald-500" />
    </div>,
    message: 'Arquivos recebidos com sucesso'
  },
  'leitura erro': {
    icon: <div className="bg-red-500/10 p-4 rounded-full">
      <AlertCircle size={48} className="text-red-500" />
    </div>,
    message: 'Erro na leitura dos arquivos'
  },
  'leitura': {
    icon: <div className="bg-emerald-500/10 p-4 rounded-full">
      <FileText size={48} className="text-emerald-500" />
    </div>,
    message: 'Realizando leitura dos arquivos'
  },
  'treinamento erro': {
    icon: <div className="bg-red-500/10 p-4 rounded-full">
      <AlertCircle size={48} className="text-red-500" />
    </div>,
    message: 'Erro no treinamento do modelo'
  },
  'treinamento': {
    icon: <div className="bg-emerald-500/10 p-4 rounded-full">
      <Brain size={48} className="text-emerald-500" />
    </div>,
    message: 'Treinando o modelo'
  },
  'finalizado erro': {
    icon: <div className="bg-red-500/10 p-4 rounded-full">
      <XCircle size={48} className="text-red-500" />
    </div>,
    message: 'Erro na finalização do processo'
  },
  'finalizado': {
    icon: <div className="bg-emerald-500/10 p-4 rounded-full">
      <CheckCircle size={48} className="text-emerald-500" />
    </div>,
    message: 'Processo finalizado com sucesso'
  },
  'enviado': {
    icon: <div className="bg-blue-500/10 p-4 rounded-full">
      <Upload size={48} className="text-blue-500" />
    </div>,
    message: 'Arquivo Enviado'
  }
};

// Componente do textarea totalmente reescrito
const SimpleTextArea = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <textarea
      value={localValue}
      onChange={handleChange}
      className="w-full h-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
      placeholder="Descreva esta imagem..."
    />
  );
};

const ModalAddProduto = ({
  isOpen,
  onClose,
  produtoId,
  currentPhase = 'aguardando'
}: ModalAddProdutoProps) => {
  const [stage, setStage] = useState<'upload' | 'progress'>('upload');
  const [selectedBase, setSelectedBase] = useState('');
  const [descricaoGlobal, setDescricaoGlobal] = useState('');
  const [filesWithDesc, setFilesWithDesc] = useState<FileWithDescription[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [phase, setPhase] = useState<string | null>(null);
  const [isLoadingPhase, setIsLoadingPhase] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const { empresaUid } = useAuth();
  const { bases } = useKnowledgeBases();

  // Limpar todos os states quando o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      setStage('upload');
      setSelectedBase('');
      setDescricaoGlobal('');
      setFilesWithDesc([]);
      setCurrentIndex(0);
      setUploadProgress(0);
      setIsUploading(false);
      setPhase(null);
      setIsLoadingPhase(true);
    }
  }, [isOpen]);

  // Criar um nome único para o canal usando timestamp e produtoId
  const channelName = useMemo(() => 
    `conex-treinamentos-modal-${produtoId}-${Date.now()}`,
    [produtoId]
  );

  // Atualizar fase quando currentPhase mudar
  useEffect(() => {
    if (currentPhase) {
      setPhase(currentPhase);
    }
  }, [currentPhase]);

  // Debug para verificar atualizações de fase
  useEffect(() => {
    console.log('Estado atual do modal:', {
      produtoId,
      currentPhase,
      phase,
      stage
    });
  }, [currentPhase, phase, produtoId, stage]);

  // Subscription para atualizações em tempo real
  useEffect(() => {
    if (!produtoId || !isOpen) return;

    console.log('Iniciando subscription para produto:', produtoId);

    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conex-treinamentos',
          filter: `uid=eq.${produtoId}`
        },
        (payload) => {
          console.log('Produto atualizado:', payload);
          if (payload.new && payload.new.fase) {
            console.log('Nova fase:', payload.new.fase);
            setPhase(payload.new.fase);
            setIsLoadingPhase(false);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Removendo subscription');
      supabase.removeChannel(channel);
    };
  }, [produtoId, isOpen]);

  useEffect(() => {
    if (!isOpen || !produtoId) return;

    setPhase(currentPhase);

    const channel = supabase.channel('custom-product-phase')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-produtos',
          filter: `uid=eq.${produtoId}`
        },
        (payload) => {
          if (payload.new && 'phase' in payload.new) {
            setPhase(payload.new.phase as string);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [isOpen, produtoId, currentPhase]);

  useEffect(() => {
    if (contentRef.current) {
      // Pequeno timeout para garantir que o conteúdo foi renderizado
      setTimeout(() => {
        contentRef.current?.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [currentIndex]);

  const updateDescription = useCallback((value: string) => {
    setFilesWithDesc(prev => {
      const newFiles = [...prev];
      newFiles[currentIndex] = {
        ...newFiles[currentIndex],
        description: value
      };
      return newFiles;
    });
  }, [currentIndex]);

  const handleIndexChange = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
  }, []);

  const handleAction = useCallback((action: () => void) => {
    action();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Converter os novos arquivos
    const newFiles = acceptedFiles.map(file => ({
      file,
      description: '',
      preview: URL.createObjectURL(file)
    }));

    // Combinar arquivos existentes com os novos
    const combinedFiles = [...filesWithDesc, ...newFiles];

    // Verificar limite de 10 arquivos
    if (combinedFiles.length > 10) {
      alert('Limite máximo de 10 arquivos atingido');
      return;
    }

    setFilesWithDesc(combinedFiles);
  }, [filesWithDesc]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleCancel = () => {
    setFilesWithDesc([]);
    setUploadProgress(0);
    setIsUploading(false);
    setCurrentIndex(0);
  };

  const removeFile = (index: number) => {
    setFilesWithDesc(prev => prev.filter((_, i) => i !== index));
  };

  const truncateFileName = (name: string, maxLength: number = 30) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.slice(0, -(extension?.length || 0) - 1);
    return `${nameWithoutExt.slice(0, maxLength - 3)}...${extension}`;
  };

  const uploadToMinio = async (file: File, fileName: string): Promise<string> => {
    try {
      const presignedUrl = await fetch('http://localhost:3500/api/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucket: minioConfig.bucket,
          key: fileName,
          contentType: file.type
        })
      }).then(res => res.json());

      if (!presignedUrl.url) {
        throw new Error('Erro ao gerar URL pré-assinada');
      }

      const uploadResponse = await fetch(presignedUrl.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Erro ao fazer upload do arquivo');
      }

      return `${minioConfig.endPoint}/${minioConfig.bucket}/${fileName}`;
    } catch (error) {
      console.error('Error uploading to MinIO:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!empresaUid) {
      console.error('EmpresaUid não encontrado');
      return;
    }
    if (filesWithDesc.length === 0) {
      console.error('Nenhum arquivo selecionado');
      return;
    }
    if (descricaoGlobal.trim() === '') {
      console.error('Descrição global vazia');
      return;
    }

    // Começamos com estado fixo de "enviado"
    setStage('progress');
    setPhase('enviado');
    setIsLoadingPhase(false);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles: { url: string; nome: string; descricao: string }[] = [];
      let currentProgress = 0;

      for (const file of filesWithDesc) {
        console.log('Fazendo upload do arquivo:', file.file.name);
        const fileName = `${Date.now()}-${file.file.name}`;
        const fileUrl = await uploadToMinio(file.file, fileName);
        
        uploadedFiles.push({
          url: fileUrl,
          nome: file.file.name,
          descricao: file.description
        });
        
        currentProgress += (100 / filesWithDesc.length);
        setUploadProgress(currentProgress);
        console.log('Progresso:', currentProgress);
      }

      console.log('Enviando payload para API:', {
        acao: 'adicionar',
        baseUid: selectedBase,
        produtoUid: produtoId,
        empresaUid: empresaUid,
        descricaoGlobal,
        arquivos: uploadedFiles
      });

      const response = await fetch('https://webhook.conexcondo.com.br/webhook/conex-midias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          acao: 'adicionar',
          baseUid: selectedBase,
          produtoUid: produtoId,
          empresaUid: empresaUid,
          descricaoGlobal,
          arquivos: uploadedFiles
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar arquivos');
      }

      console.log('Upload concluído com sucesso!');
      
      // Após o upload bem sucedido, começamos a monitorar as atualizações
      setIsLoadingPhase(true);
      const { data } = await supabase
        .from('conex-treinamentos')
        .select('fase')
        .eq('uid', produtoId)
        .single();

      if (data?.fase) {
        setPhase(data.fase);
      }
      setIsLoadingPhase(false);

    } catch (err) {
      console.error('Error processing files:', err);
      setStage('upload');
      setPhase(null);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (stage === 'progress') {
      setIsLoadingPhase(true);
      setPhase(null);
      
      // Buscar estado inicial
      const fetchInitialState = async () => {
        try {
          const { data, error } = await supabase
            .from('conex-treinamentos')
            .select('fase')
            .eq('uid', produtoId)
            .single();

          if (error) throw error;

          if (data && data.fase) {
            console.log('Estado inicial após upload:', data.fase);
            setPhase(data.fase);
          } else {
            console.log('Usando fase padrão após upload:', 'aguardando');
            setPhase('aguardando');
          }
        } catch (error) {
          console.error('Erro ao buscar estado inicial após upload:', error);
          setPhase('aguardando');
        } finally {
          setIsLoadingPhase(false);
        }
      };

      fetchInitialState();
    }
  }, [stage, produtoId]);

  const ProgressStage = () => {
    // Se ainda estiver carregando ou não tivermos uma fase, mostra loading
    if (isLoadingPhase || !phase) {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8">
          <div className="p-4 rounded-full bg-gray-800">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-white text-center">
            Carregando status...
          </h3>
        </div>
      );
    }

    const status = STATUS_CONFIG[phase as keyof typeof STATUS_CONFIG];
    if (!status) {
      console.log('Status não encontrado para fase:', phase);
      return null;
    }

    const StatusIcon = status.icon;

    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-8">
        {/* Debug - Remover depois */}
        <div className="text-xs text-gray-500 mb-4">
          fase atual: {phase}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${status.bgColor}`}>
            <StatusIcon size={48} className={`${status.color} ${phase === 'aguardando' ? 'animate-spin' : ''}`} />
          </div>
          <h3 className="text-lg font-medium text-white text-center">
            {status.label}
          </h3>
          <p className="text-sm text-gray-400 text-center">
            {phase.includes('erro') 
              ? 'Ocorreu um erro durante o processamento'
              : 'Aguarde enquanto processamos seu produto'}
          </p>
        </div>
      </div>
    );
  };

  // Debug do estado atual
  useEffect(() => {
    console.log('Estado atual:', {
      produtoId,
      currentPhase,
      stage
    });
  }, [produtoId, currentPhase, stage]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header fixo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  {stage === 'upload' ? 'Adicionar Produto' : 'Status do Processamento'}
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto p-6">
              {stage === 'upload' ? (
                <div className="space-y-6">
                  {/* Base de Conhecimento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Base de Conhecimento
                    </label>
                    <select
                      value={selectedBase}
                      onChange={(e) => setSelectedBase(e.target.value)}
                      className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">Selecione uma base</option>
                      {bases?.map((base) => (
                        <option key={base.uid} value={base.uid}>
                          {base.nome.split('_')[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Descrição Global */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição do Produto
                    </label>
                    <textarea
                      value={descricaoGlobal}
                      onChange={(e) => setDescricaoGlobal(e.target.value)}
                      placeholder="Descreva este produto com o máximo de detalhes"
                      className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[120px]"
                    />
                  </div>

                  {/* File Uploader - só aparece se tiver descrição global */}
                  {descricaoGlobal.trim() !== '' && (
                    <div className="space-y-6">
                      <div
                        {...getRootProps()}
                        className={`
                          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                          transition-colors duration-200
                          ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700 hover:border-emerald-500/50'}
                        `}
                      >
                        <input {...getInputProps()} />
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-400">
                          Arraste e solte imagens aqui, ou clique para selecionar
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Formatos aceitos: JPG, JPEG, PNG
                        </p>
                      </div>

                      {/* Lista de arquivos */}
                      <div className="space-y-2">
                        {filesWithDesc.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-800 rounded-lg p-2"
                          >
                            <div className="flex items-center gap-2">
                              <ImageIcon size={20} className="text-gray-400" />
                              <span className="text-sm text-gray-300">
                                {file.file.name}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                const newFiles = [...filesWithDesc];
                                newFiles.splice(index, 1);
                                setFilesWithDesc(newFiles);
                                if (currentIndex >= newFiles.length) {
                                  setCurrentIndex(Math.max(0, newFiles.length - 1));
                                }
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Grid de preview e descrição */}
                      {filesWithDesc.length > 0 && (
                        <div className="mt-6">
                          {/* Navegação entre imagens */}
                          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            {filesWithDesc.map((item, index) => {
                              const hasDescription = item.description.trim() !== '';
                              
                              return (
                                <button
                                  key={index}
                                  onClick={() => setCurrentIndex(index)}
                                  className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 min-w-[120px]
                                    border-2
                                    ${currentIndex === index 
                                      ? 'bg-emerald-500 text-white border-emerald-700' 
                                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                    }
                                    ${hasDescription 
                                      ? 'border-emerald-700' 
                                      : 'border-red-400/50'
                                    }
                                  `}
                                >
                                  <div className="relative">
                                    <img 
                                      src={item.preview}
                                      alt={item.file.name}
                                      className="w-8 h-8 object-contain rounded"
                                    />
                                    {!hasDescription && (
                                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                                    )}
                                  </div>
                                  <span className="text-sm whitespace-nowrap">
                                    Imagem {index + 1}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Preview e descrição */}
                          <div className="grid grid-cols-2 gap-6 min-h-[300px]">
                            {/* Preview */}
                            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                              <img 
                                src={filesWithDesc[currentIndex].preview}
                                alt={filesWithDesc[currentIndex].file.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>

                            {/* Descrição */}
                            <textarea
                              value={filesWithDesc[currentIndex].description}
                              onChange={(e) => updateDescription(e.target.value)}
                              className="w-full h-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                              placeholder="Descreva esta imagem..."
                            />
                          </div>

                          {/* Navegação */}
                          <div className="flex justify-between mt-4">
                            {currentIndex > 0 && (
                              <button
                                onClick={() => setCurrentIndex(currentIndex - 1)}
                                className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors"
                              >
                                ← Anterior
                              </button>
                            )}
                            {currentIndex < filesWithDesc.length - 1 && (
                              <button
                                onClick={() => setCurrentIndex(currentIndex + 1)}
                                className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors ml-auto"
                              >
                                Próxima →
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <ProgressStage />
              )}
            </div>

            {/* Footer fixo */}
            <div className="bg-gray-800 px-4 py-3 sm:px-6 flex items-center justify-between">
              {/* Alerta de descrição */}
              {stage === 'upload' && filesWithDesc.some(f => !f.description) && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-red-500">
                    Adicione a descrição
                  </span>
                </div>
              )}
              {/* Espaço vazio quando não há alerta */}
              {(stage !== 'upload' || !filesWithDesc.some(f => !f.description)) && (
                <div></div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none"
                  onClick={onClose}
                >
                  {stage === 'upload' ? 'Cancelar' : 'Fechar'}
                </button>
                {stage === 'upload' && (
                  <button
                    onClick={handleUpload}
                    disabled={!selectedBase || descricaoGlobal.trim() === '' || filesWithDesc.length === 0 || filesWithDesc.some(f => !f.description) || isUploading}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium
                      ${(!selectedBase || descricaoGlobal.trim() === '' || filesWithDesc.length === 0 || filesWithDesc.some(f => !f.description) || isUploading)
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }
                    `}
                  >
                    {isUploading ? 'Enviando...' : 'Enviar'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalAddProduto;
