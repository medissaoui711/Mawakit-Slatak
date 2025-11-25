class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement;
  private currentSrc: string | null = null;
  private isPlayingState = false;

  private constructor() {
    this.audio = new Audio();
    this.audio.volume = 1.0; // Set default volume
    this.audio.onplay = () => { this.isPlayingState = true; };
    // We set isPlaying to false on pause and ended
    const onStop = () => {
        this.isPlayingState = false;
        // Don't clear currentSrc on pause, only on ended
        if (this.audio.ended) {
            this.currentSrc = null;
        }
    };
    this.audio.onpause = onStop;
    this.audio.onended = onStop;
    this.audio.onabort = () => { 
        this.isPlayingState = false;
        this.currentSrc = null;
    };
    this.audio.onerror = () => { 
        this.isPlayingState = false; 
        this.currentSrc = null; 
        console.error("Audio playback error"); 
    };
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  play(src: string) {
    if (this.currentSrc === src && !this.audio.paused) {
      return; // Already playing this source
    }
    // If a different source is playing, stop it and play the new one.
    if (!this.audio.paused) {
      this.audio.pause();
    }
    this.audio.src = src;
    this.currentSrc = src;
    this.audio.play().catch(e => console.error("Error playing audio:", e));
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    // Let the onpause/onended handlers manage the state
  }

  setVolume(level: number) {
    this.audio.volume = Math.max(0, Math.min(1, level));
  }

  isPlaying(src?: string): boolean {
    if (src) {
        return this.currentSrc === src && this.isPlayingState;
    }
    return this.isPlayingState;
  }
  
  getAudioElement(): HTMLAudioElement {
    return this.audio;
  }
}

const audioManager = AudioManager.getInstance();
export default audioManager;