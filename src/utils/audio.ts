// Web Audio API Sound Synthesizer for FocusFlow
// Provides crisp completion chimes and procedural ambient sounds (no external audio files needed!)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isAmbientRunning = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a pleasant, gentle completion chime (major triad)
  public playChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        noteGain.gain.setValueAtTime(0, now + idx * 0.12);
        noteGain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch {
      // Audio might be blocked before user interaction
    }
  }

  // Play subtle tick for button presses
  public playClick() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Start procedural ambient soundscape
  public startAmbient(type: 'none' | 'rain' | 'whitenoise' | 'binaural', volume = 0.5) {
    this.stopAmbient();
    if (type === 'none') return;

    try {
      const ctx = this.getContext();
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      this.gainNode.connect(ctx.destination);

      if (type === 'whitenoise' || type === 'rain') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Pink noise approximation + low pass
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            // Soft white noise
            output[i] = white * 0.25;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        if (type === 'rain') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, ctx.currentTime);
          whiteNoise.connect(filter);
          filter.connect(this.gainNode);
        } else {
          whiteNoise.connect(this.gainNode);
        }

        whiteNoise.start();
        this.ambientNode = whiteNoise;
      } else if (type === 'binaural') {
        // Binaural alpha focus waves (200Hz left, 210Hz right for 10Hz alpha beat)
        const merger = ctx.createChannelMerger(2);
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();

        oscL.frequency.setValueAtTime(216, ctx.currentTime);
        oscR.frequency.setValueAtTime(226, ctx.currentTime); // 10Hz difference = Alpha relaxation

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(this.gainNode);

        oscL.start();
        oscR.start();
        this.ambientNode = merger;
      }

      this.isAmbientRunning = true;
    } catch {
      // Audio context restricted
    }
  }

  public setAmbientVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)) * 0.15, this.ctx.currentTime);
    }
  }

  public stopAmbient() {
    if (this.ambientNode) {
      try {
        if ('stop' in this.ambientNode && typeof (this.ambientNode as AudioScheduledSourceNode).stop === 'function') {
          (this.ambientNode as AudioScheduledSourceNode).stop();
        }
        this.ambientNode.disconnect();
      } catch {
        // already stopped
      }
      this.ambientNode = null;
    }
    this.isAmbientRunning = false;
  }

  public isPlaying(): boolean {
    return this.isAmbientRunning;
  }
}

export const sound = new SoundEngine();
