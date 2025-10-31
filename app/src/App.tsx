import { useEffect, useState } from 'react';
import { MacWindow } from './components/MacWindow';
import { SoundButton } from './components/SoundButton';
import { AddSoundDialog } from './components/AddSoundDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { SoundGenerator } from './utils/soundGenerator';
import { Plus, Settings } from 'lucide-react';

interface Sound {
  label: string;
  duration: string;
  url?: string;
  isGeneratedSound?: boolean;
}

interface AppSettings {
  showDuration: boolean;
  showWaveform: boolean;
  soundBehavior: 'restart' | 'resume';
}

export default function App() {
  const [soundGen, setSoundGen] = useState<SoundGenerator | null>(null);
  const [time, setTime] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    showDuration: true,
    showWaveform: true,
    soundBehavior: 'restart',
  });
  
  const defaultSounds: Sound[] = [
    { label: 'Startup Chime', duration: '1.0s', isGeneratedSound: true },
    { label: 'Beep', duration: '0.1s', isGeneratedSound: true },
    { label: 'Boop', duration: '0.15s', isGeneratedSound: true },
    { label: 'Sosumi', duration: '0.32s', isGeneratedSound: true },
    { label: 'Quack', duration: '0.15s', isGeneratedSound: true },
    { label: 'Monkey', duration: '0.3s', isGeneratedSound: true },
    { label: 'Wild Eep', duration: '0.3s', isGeneratedSound: true },
    { label: 'Droplet', duration: '0.1s', isGeneratedSound: true },
    { label: 'Bonk', duration: '0.2s', isGeneratedSound: true },
    { label: 'Click', duration: '0.02s', isGeneratedSound: true },
  ];

  const [sounds, setSounds] = useState<Sound[]>(() => {
    // Load sounds from localStorage on initial render
    try {
      const savedSounds = localStorage.getItem('soundboard-sounds');
      if (savedSounds) {
        return JSON.parse(savedSounds);
      }
    } catch (error) {
      console.error('Error loading sounds from localStorage:', error);
    }
    return defaultSounds;
  });

  useEffect(() => {
    // Initialize sound generator
    setSoundGen(new SoundGenerator());

    // Update clock every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save sounds to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('soundboard-sounds', JSON.stringify(sounds));
    } catch (error) {
      console.error('Error saving sounds to localStorage:', error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please delete some sounds to free up space.');
      }
    }
  }, [sounds]);

  const handleAddSound = (name: string, duration: string, url?: string) => {
    const newSound: Sound = {
      label: name,
      duration: `${duration}s`,
      url: url,
      isGeneratedSound: !url,
    };
    setSounds([...sounds, newSound]);
  };

  const handleDeleteSound = (index: number) => {
    if (confirm(`Delete "${sounds[index].label}"?`)) {
      setSounds(sounds.filter((_, i) => i !== index));
    }
  };

  const playSound = (sound: Sound) => {
    if (!soundGen) return;
    
    if (sound.url) {
      soundGen.playFromUrl(sound.url, settings.soundBehavior);
    } else {
      // For built-in sounds, map to the correct method
      const soundMap: Record<string, () => void> = {
        'Startup Chime': () => soundGen.playStartup(),
        'Beep': () => soundGen.playBeep(),
        'Boop': () => soundGen.playBoop(),
        'Sosumi': () => soundGen.playSosumi(),
        'Quack': () => soundGen.playQuack(),
        'Monkey': () => soundGen.playMonkey(),
        'Wild Eep': () => soundGen.playWildEep(),
        'Droplet': () => soundGen.playDroplet(),
        'Bonk': () => soundGen.playBonk(),
        'Click': () => soundGen.playClick(),
      };
      
      const playFn = soundMap[sound.label];
      if (playFn) {
        playFn();
      } else {
        // Custom generated sound
        const durationNum = parseFloat(sound.duration.replace('s', ''));
        soundGen.playCustom(durationNum);
      }
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[#555555] flex items-center justify-center p-2 sm:p-8">
      <div className="flex flex-col gap-4 sm:gap-8 w-full max-w-2xl">
        {/* Menu Bar */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="font-mono">🍎</div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-1 px-3 py-1 font-mono bg-[#c0c0c0] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1),inset_1px_1px_0px_0px_rgba(255,255,255,0.8),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.3)] hover:bg-[#d0d0d0] active:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Sound</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1 px-3 py-1 font-mono bg-[#c0c0c0] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1),inset_1px_1px_0px_0px_rgba(255,255,255,0.8),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.3)] hover:bg-[#d0d0d0] active:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]"
            >
              <Settings size={14} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
          <div className="font-mono text-sm sm:text-base">{formatTime(time)}</div>
        </div>

        {/* Main Window */}
        <MacWindow title="Sound Board 1.0">
          <div className="space-y-4">
            {/* Info */}
            <div className="bg-white border-2 border-black p-2 sm:p-3">
              <p className="font-mono text-center text-sm sm:text-base">
                Classic Macintosh Sound Board
              </p>
              <p className="font-mono text-center mt-1 text-xs sm:text-sm">
                Click a button to play a sound
              </p>
            </div>

            {/* Sound Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {sounds.map((sound, index) => (
                <SoundButton
                  key={index}
                  label={sound.label}
                  duration={sound.duration}
                  audioUrl={sound.url}
                  isGeneratedSound={sound.isGeneratedSound}
                  showDuration={settings.showDuration}
                  showWaveform={settings.showWaveform}
                  onPlay={() => playSound(sound)}
                  onDelete={() => handleDeleteSound(index)}
                  canDelete={index >= defaultSounds.length}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="bg-white border-2 border-black p-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-black bg-black shrink-0"></div>
                <span className="font-mono text-xs sm:text-sm text-center">Sound Output: Internal Speaker</span>
              </div>
            </div>
          </div>
        </MacWindow>

        {/* About Box */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4">
          <p className="font-mono text-center text-sm sm:text-base">
            System 7.5.3
          </p>
          <p className="font-mono text-center mt-1 text-xs sm:text-sm">
            © 1984-1996 Apple Computer, Inc.
          </p>
          <div className="mt-2 border-t-2 border-black pt-2">
            <p className="font-mono text-center text-xs sm:text-sm">
              This computer is protected by password security.
            </p>
          </div>
        </div>
      </div>

      <AddSoundDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddSound}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}
