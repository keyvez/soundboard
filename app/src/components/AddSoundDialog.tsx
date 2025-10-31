import { useState, useEffect } from 'react';

interface AddSoundDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, duration: string, url?: string) => void;
}

export function AddSoundDialog({ isOpen, onClose, onAdd }: AddSoundDialogProps) {
  const [soundUrl, setSoundUrl] = useState('');
  const [soundName, setSoundName] = useState('');
  const [soundDuration, setSoundDuration] = useState('0.1');
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'url' | 'file' | 'generated'>('generated');

  // Auto-detect sound name from URL or file
  useEffect(() => {
    if (isAutoDetect) {
      if (uploadMode === 'file' && uploadedFile) {
        // Get name from file
        const filename = uploadedFile.name;
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        const decodedName = decodeURIComponent(nameWithoutExt)
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        setSoundName(decodedName || 'Custom Sound');
      } else if (uploadMode === 'url' && soundUrl) {
        try {
          const url = new URL(soundUrl);
          const pathname = url.pathname;
          const filename = pathname.split('/').pop() || '';
          // Remove extension
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
          // Decode URI and format nicely
          const decodedName = decodeURIComponent(nameWithoutExt)
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
          setSoundName(decodedName || 'Custom Sound');
        } catch {
          // If URL is invalid, just use a default name
          if (soundUrl) {
            setSoundName('Custom Sound');
          }
        }
      }
    }
  }, [soundUrl, uploadedFile, uploadMode, isAutoDetect]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadMode('file');
      // Auto-detect duration from audio file
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      audio.src = url;
      audio.addEventListener('loadedmetadata', () => {
        setSoundDuration(audio.duration.toFixed(2));
        URL.revokeObjectURL(url);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = soundName.trim() || 'Custom Sound';

    let finalUrl: string | undefined;

    if (uploadMode === 'file' && uploadedFile) {
      // Convert file to base64 data URL for localStorage
      finalUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(uploadedFile);
      });
    } else if (uploadMode === 'url') {
      finalUrl = soundUrl || undefined;
    }

    onAdd(finalName, soundDuration, finalUrl);

    // Reset form
    setSoundUrl('');
    setSoundName('');
    setSoundDuration('0.1');
    setIsAutoDetect(true);
    setUploadedFile(null);
    setUploadMode('generated');
    onClose();
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
          <span className="font-mono">Add New Sound</span>
        </div>
        
        <div className="p-4 bg-[#c0c0c0]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode Selection */}
            <div className="bg-white border-2 border-black p-3">
              <p className="font-mono mb-2">Sound Source:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadMode('file')}
                    className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center rounded-full"
                  >
                    {uploadMode === 'file' && (
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    )}
                  </button>
                  <label className="font-mono text-sm">Upload File</label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center rounded-full"
                  >
                    {uploadMode === 'url' && (
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    )}
                  </button>
                  <label className="font-mono text-sm">URL</label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadMode('generated')}
                    className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center rounded-full"
                  >
                    {uploadMode === 'generated' && (
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    )}
                  </button>
                  <label className="font-mono text-sm">Generate Tone</label>
                </div>
              </div>
            </div>

            {/* File Upload */}
            {uploadMode === 'file' && (
              <div>
                <label className="font-mono block mb-2">Upload Audio File:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border-2 border-black font-mono bg-white focus:outline-none"
                />
                {uploadedFile && (
                  <p className="font-mono text-xs mt-2">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>
            )}

            {/* URL Input */}
            {uploadMode === 'url' && (
              <div>
                <label className="font-mono block mb-2">Sound URL:</label>
                <input
                  type="url"
                  value={soundUrl}
                  onChange={(e) => setSoundUrl(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black font-mono bg-white focus:outline-none"
                  placeholder="https://example.com/sound.mp3"
                />
              </div>
            )}

            <div>
              <label className="font-mono block mb-2 flex items-center gap-2">
                Sound Name:
                {soundUrl && (
                  <span className="text-xs">
                    ({isAutoDetect ? 'auto' : 'manual'})
                  </span>
                )}
              </label>
              <input
                type="text"
                value={soundName}
                onChange={(e) => {
                  setSoundName(e.target.value);
                  setIsAutoDetect(false);
                }}
                className="w-full px-3 py-2 border-2 border-black font-mono bg-white focus:outline-none"
                placeholder="Enter sound name or leave blank for auto-detect"
              />
            </div>

            <div>
              <label className="font-mono block mb-2">Duration (seconds):</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={soundDuration}
                onChange={(e) => setSoundDuration(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black font-mono bg-white focus:outline-none"
              />
            </div>

            <div className="bg-white border-2 border-black p-3">
              <p className="font-mono text-xs sm:text-sm">
                {uploadMode === 'file'
                  ? 'Upload an audio file from your device. File will be saved in browser storage.'
                  : uploadMode === 'url'
                  ? 'Add a sound from URL. Name will be auto-detected from the filename.'
                  : 'Generate a random tone with the specified duration.'}
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 font-mono bg-[#c0c0c0] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1),inset_1px_1px_0px_0px_rgba(255,255,255,0.8),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.3)] hover:bg-[#d0d0d0] active:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 font-mono bg-[#c0c0c0] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1),inset_1px_1px_0px_0px_rgba(255,255,255,0.8),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.3)] hover:bg-[#d0d0d0] active:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
