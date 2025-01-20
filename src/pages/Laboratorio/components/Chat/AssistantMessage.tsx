import React from 'react';
import { Bot } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import FormattedText from '../../../../components/FormattedText';

interface AssistantMessageProps {
  content: string;
  timestamp: string;
  onImprove: () => void;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ 
  content, 
  timestamp,
  onImprove
}) => {
  return (
    <div className="flex flex-col items-start">
      <div 
        className="rounded-lg p-3 max-w-[80%] relative"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        }}
      >
        <FormattedText text={content} />
        <span className="text-xs mt-1 block" style={{ color: 'var(--text-secondary)' }}>
          {new Date(timestamp).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div 
            className="ml-3 mt-1 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onImprove}
          >
            <div className="p-2 rounded-full bg-emerald-500/10">
              <Bot className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Melhorar resposta
            </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-lg px-3 py-2 text-sm bg-neutral-900 text-neutral-50 animate-fadeIn"
            sideOffset={5}
          >
            Clique para melhorar o treinamento
            <Tooltip.Arrow className="fill-neutral-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  );
};

export default AssistantMessage;
