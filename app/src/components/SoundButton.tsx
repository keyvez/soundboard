import { useState } from 'react';
import { Waveform } from './Waveform';
import { Trash2 } from 'lucide-react';

interface SoundButtonProps {
  label: string;
  duration: string;
  audioUrl?: string;
  isGeneratedSound?: boolean;
  showDuration: boolean;
  showWaveform: boolean;
  onPlay: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function SoundButton({
  label,
  duration,
  audioUrl,
  isGeneratedSound,
  showDuration,
  showWaveform,
  onPlay,
  onDelete,
  canDelete
}: SoundButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onPlay();
    setTimeout(() => setIsPressed(false), 150);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative px-4 py-3 font-mono text-left
        bg-[#c0c0c0]
        border-2 border-black
        transition-all
        w-full
        ${isPressed 
          ? 'shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)] translate-y-[2px]' 
          : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1),inset_1px_1px_0px_0px_rgba(255,255,255,0.8),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.3)]'
        }
        hover:bg-[#d0d0d0]
        active:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]
      `}
    >
      <div className="flex items-center gap-3">
        {/* Label */}
        <span className="truncate flex-shrink">{label}</span>

        {/* Waveform - inline */}
        {showWaveform && (
          <div className="flex-grow min-w-0 flex items-center">
            <Waveform audioUrl={audioUrl} isGeneratedSound={isGeneratedSound} />
          </div>
        )}

        {/* Duration */}
        {showDuration && (
          <span className="text-black/60 shrink-0 ml-auto">{duration}</span>
        )}

        {/* Delete Button */}
        {canDelete && (
          <button
            onClick={handleDelete}
            className="shrink-0 p-1 hover:bg-black/10 rounded"
            title="Delete sound"
          >
            <Trash2 size={14} className="text-black/60" />
          </button>
        )}
      </div>
    </button>
  );
}
