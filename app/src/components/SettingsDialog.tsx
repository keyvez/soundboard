interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    showDuration: boolean;
    showWaveform: boolean;
    soundBehavior: 'restart' | 'resume';
  };
  onSettingsChange: (settings: {
    showDuration: boolean;
    showWaveform: boolean;
    soundBehavior: 'restart' | 'resume';
  }) => void;
}

export function SettingsDialog({ isOpen, onClose, settings, onSettingsChange }: SettingsDialogProps) {
  if (!isOpen) return null;

  const handleToggle = (key: 'showDuration' | 'showWaveform') => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleBehaviorChange = (behavior: 'restart' | 'resume') => {
    onSettingsChange({
      ...settings,
      soundBehavior: behavior,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        {/* Title Bar */}
        <div className="bg-white border-b-2 border-black flex items-center px-1 py-1">
          <div className="flex-1 flex items-center justify-center gap-[2px] px-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-[2px] h-3 bg-black"></div>
            ))}
          </div>
        </div>
        
        <div className="text-center py-1 border-b-2 border-black bg-white">
          <span className="font-mono">Settings</span>
        </div>
        
        <div className="p-4 bg-[#c0c0c0] space-y-4">
          {/* Appearance Section */}
          <div className="bg-white border-2 border-black p-3">
            <p className="font-mono mb-3">Appearance:</p>
            
            <div className="space-y-2">
              {/* Show Duration Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle('showDuration')}
                  className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center"
                >
                  {settings.showDuration && (
                    <div className="w-2 h-2 bg-black"></div>
                  )}
                </button>
                <label className="font-mono">Show Duration</label>
              </div>

              {/* Show Waveform Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle('showWaveform')}
                  className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center"
                >
                  {settings.showWaveform && (
                    <div className="w-2 h-2 bg-black"></div>
                  )}
                </button>
                <label className="font-mono">Show Waveform</label>
              </div>
            </div>
          </div>

          {/* Behavior Section */}
          <div className="bg-white border-2 border-black p-3">
            <p className="font-mono mb-3">Sound Behavior:</p>
            
            <div className="space-y-2">
              {/* Restart Radio */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleBehaviorChange('restart')}
                  className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center rounded-full"
                >
                  {settings.soundBehavior === 'restart' && (
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  )}
                </button>
                <label className="font-mono">Restart sound on tap</label>
              </div>

              {/* Resume Radio */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleBehaviorChange('resume')}
                  className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center rounded-full"
                >
                  {settings.soundBehavior === 'resume' && (
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  )}
                </button>
                <label className="font-mono">Resume/Pause sound on tap</label>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white border-2 border-black p-3">
            <p className="font-mono text-xs sm:text-sm">
              Customize the appearance and behavior of sound buttons. Changes apply immediately.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 font-mono bg-[#c0c0c0] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1),inset_1px_1px_0px_0px_rgba(255,255,255,0.8),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.3)] hover:bg-[#d0d0d0] active:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
