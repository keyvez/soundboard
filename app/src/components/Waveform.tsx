import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  audioUrl?: string;
  isGeneratedSound?: boolean;
}

export function Waveform({ audioUrl, isGeneratedSound }: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    // For generated sounds, show a simple static waveform pattern
    if (isGeneratedSound || !audioUrl) {
      return;
    }

    // Create wavesurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#808080',
      progressColor: '#808080',
      cursorColor: 'transparent',
      barWidth: 2,
      barGap: 1,
      barRadius: 0,
      height: 24,
      normalize: true,
      interact: false,
      hideScrollbar: true,
    });

    wavesurferRef.current = wavesurfer;

    // Load audio
    wavesurfer.load(audioUrl).catch(() => {
      // If loading fails, just show empty waveform
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl, isGeneratedSound]);

  // Render static pattern for generated sounds
  if (isGeneratedSound || !audioUrl) {
    return (
      <div className="h-5 flex items-end gap-[1px] justify-center">
        {Array.from({ length: 16 }).map((_, i) => {
          // Create a simple random-looking pattern
          const heights = [3, 6, 9, 12, 16, 12, 9, 6, 3, 5, 8, 11, 14, 11, 8, 5];
          return (
            <div
              key={i}
              className="w-[2px] bg-gray-500"
              style={{ height: `${heights[i]}px` }}
            />
          );
        })}
      </div>
    );
  }

  return <div ref={waveformRef} className="h-5 w-full" />;
}
