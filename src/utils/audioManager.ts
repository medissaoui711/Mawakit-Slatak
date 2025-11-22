import { ADHAN_SOUNDS } from '../constants/data';

class AudioManager {
  private context: AudioContext | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isUnlocked: boolean = false;
  private unlockingPromise: Promise<boolean> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.crossOrigin = "anonymous";
    }
  }

  private initContext() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContextClass();
      
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);

      if (this.audioEl) {
        try {
          this.sourceNode = this.context.createMediaElementSource(this.audioEl);
          this.sourceNode.connect(this.gainNode);
        } catch (e) {
          // Ignore if already connected
        }
      }
    }
  }

  async unlock(): Promise<boolean> {
    if (this.isUnlocked && this.context?.state === 'running') return true;

    if (this.unlockingPromise) {
      return this.unlockingPromise;
    }

    this.unlockingPromise = this.performUnlock();
    return this.unlockingPromise;
  }

  private async performUnlock(): Promise<boolean> {
    this.initContext();

    if (!this.context || !this.audioEl) {
        this.unlockingPromise = null;
        return false;
    }

    try {
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }

      // Play a silent buffer to warm up the context
      const buffer = this.context.createBuffer(1, 1, 22050);
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0);

      // Interaction with the audio element
      const originalSrc = this.audioEl.src;
      this.audioEl.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      this.audioEl.load();
      
      const playPromise = this.audioEl.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      
      if (originalSrc && !originalSrc.startsWith('data:')) {
        this.audioEl.src = originalSrc;
      }

      this.isUnlocked = true;
      return true;
    } catch (error: any) {
      // Treat AbortError (interruption by another play call) as success for unlocking
      if (error.name === 'AbortError' || error.message?.includes('interrupted')) {
         this.isUnlocked = true;
         return true;
      }
      console.error("AudioManager: Failed to unlock audio:", error.message || error);
      return false;
    } finally {
      this.unlockingPromise = null;
    }
  }

  async play(soundId: string, onEnded?: () => void): Promise<void> {
    if (!this.isUnlocked || this.context?.state === 'suspended') {
      const unlocked = await this.unlock();
      if (!unlocked) return;
    }

    const sound = ADHAN_SOUNDS.find(s => s.id === soundId) || ADHAN_SOUNDS[0];
    
    if (this.audioEl) {
      try {
        // Safe stop
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch (e) { /* ignore */ }

      this.audioEl.src = sound.url;
      this.audioEl.load();
      
      this.audioEl.onended = () => {
        if (onEnded) onEnded();
      };
      
      this.audioEl.onerror = (e) => {
        console.warn("AudioManager: Playback error", e);
      };

      try {
        await this.audioEl.play();
        console.log(`AudioManager: Playing ${sound.name}`);
      } catch (e: any) {
        // Ignore interruption errors (occurring when play is called rapidly)
        if (e.name !== 'AbortError' && !e.message?.includes('interrupted')) {
          console.error("AudioManager: Play failed", e);
        }
      }
    }
  }

  stop() {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch (e) { /* ignore */ }
    }
  }

  isReady(): boolean {
    return this.isUnlocked && this.context?.state === 'running';
  }
}

export const audioManager = new AudioManager();