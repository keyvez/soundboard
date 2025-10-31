// Web Audio API sound generator for retro Mac sounds

export class SoundGenerator {
  private audioContext: AudioContext;
  private audioElements: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = volume;

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', volume: number = 0.2) {
    frequencies.forEach(freq => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = type;
      gainNode.gain.value = volume;

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    });
  }

  playStartup() {
    // Classic Mac startup chime (F major chord)
    this.playChord([349.23, 440, 523.25], 1.0, 'sine', 0.15);
  }

  playBeep() {
    this.playTone(800, 0.1, 'square', 0.2);
  }

  playBoop() {
    this.playTone(400, 0.15, 'sine', 0.3);
  }

  playSosumi() {
    // Playful ascending tones
    const notes = [523.25, 587.33, 659.25, 783.99];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 'triangle', 0.2), i * 80);
    });
  }

  playQuack() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  playMonkey() {
    // Monkey-like chattering sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(Math.random() * 400 + 300, 0.05, 'square', 0.15);
      }, i * 60);
    }
  }

  playWildEep() {
    // Wild ascending then descending sweep
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.15);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  playDroplet() {
    // Water droplet sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playBonk() {
    this.playTone(150, 0.2, 'square', 0.25);
  }

  playClick() {
    // Short click sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.value = 1000;
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.02);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.02);
  }

  playCustom(duration: number) {
    // Play a random frequency tone for custom sounds
    const frequency = Math.random() * 600 + 300; // Random frequency between 300-900 Hz
    const types: OscillatorType[] = ['sine', 'square', 'triangle', 'sawtooth'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    this.playTone(frequency, duration, randomType, 0.2);
  }

  playFromUrl(url: string, behavior: 'restart' | 'resume' = 'restart') {
    // Play audio from URL
    let audio = this.audioElements.get(url);
    
    if (!audio) {
      audio = new Audio(url);
      audio.volume = 0.5;
      this.audioElements.set(url, audio);
    }

    if (behavior === 'restart') {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } else {
      // Resume/Pause behavior
      if (audio.paused) {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      } else {
        audio.pause();
      }
    }
  }
}
