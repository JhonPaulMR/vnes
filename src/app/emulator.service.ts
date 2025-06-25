import { Injectable } from '@angular/core';
import { ConfigService, KeyMap } from './config.service';
import { Subscription } from 'rxjs';

declare var jsnes: any;

@Injectable({
  providedIn: 'root'
})
export class EmulatorService {
  private nes: any;
  private isRunning = false;
  private animationFrameId: number | null = null;
  
  // Audio properties
  private audioContext: AudioContext | null = null;
  private audioWorkletNode: AudioWorkletNode | null = null;
  private audioGainNode: GainNode | null = null; // Nó para controlar o volume
  private audioBuffer: number[] = [];
  private readonly SAMPLE_RATE = 44100;
  private readonly AUDIO_BUFFER_SIZE = 8192;

  // Input properties
  private keyMap: KeyMap = {};
  private keydownListener = (e: KeyboardEvent) => this.handleKeydown(e);
  private keyupListener = (e: KeyboardEvent) => this.handleKeyup(e);
  
  private configSubscription: Subscription;

  constructor(private configService: ConfigService) {
    // Assina as mudanças de configuração para atualizar o keyMap em tempo real.
    this.configSubscription = this.configService.config$.subscribe(config => {
      this.keyMap = config.keyMap;
      if (this.audioGainNode) {
        this.setVolume(config.volume);
      }
    });
  }

  ngOnDestroy(): void {
    this.configSubscription.unsubscribe();
  }
  
  /**
   * Define o volume da emulação.
   * @param volume Nível de volume de 0.0 (mudo) a 1.0 (máximo).
   */
  public setVolume(volume: number): void {
    if (this.audioGainNode) {
      // Usamos setTargetAtTime para uma transição suave do volume.
      this.audioGainNode.gain.setTargetAtTime(volume, this.audioContext!.currentTime, 0.01);
    }
  }

  async start(canvas: HTMLCanvasElement, romData: string): Promise<void> {
    if (this.isRunning) return;

    try {
      await this.initAudio();

      const context = canvas.getContext('2d')!;
      context.imageSmoothingEnabled = false;
      const imageData = context.getImageData(0, 0, 256, 240);
      const imageDataU32 = new Uint32Array(imageData.data.buffer);

      this.nes = new jsnes.NES({
        onFrame: (frameBuffer: number[]) => {
          for (let i = 0; i < frameBuffer.length; i++) {
            imageDataU32[i] = 0xFF000000 | frameBuffer[i];
          }
          context.putImageData(imageData, 0, 0);
        },
        onAudioSample: (sample: number) => {
          this.audioBuffer.push(sample);
          if (this.audioBuffer.length >= this.AUDIO_BUFFER_SIZE) {
            try {
              this.audioWorkletNode?.port.postMessage(this.audioBuffer);
            } catch (e) {
              console.error('Erro ao enviar buffer de áudio:', e);
            }
            this.audioBuffer = [];
          }
        },
        sampleRate: this.SAMPLE_RATE,
      });

      document.addEventListener('keydown', this.keydownListener);
      document.addEventListener('keyup', this.keyupListener);
      this.nes.loadROM(romData);

      this.isRunning = true;

      let lastFrameTime = 0;
      const interval = 1000 / 60;

      const frame = (currentTime: number) => {
        if (!this.isRunning) return;
        if (lastFrameTime === 0) lastFrameTime = currentTime;
        const deltaTime = currentTime - lastFrameTime;
        if (deltaTime > interval) {
          lastFrameTime = currentTime - (deltaTime % interval);
          this.nes.frame();
        }
        this.animationFrameId = requestAnimationFrame(frame);
      };
      
      this.animationFrameId = requestAnimationFrame(frame);

    } catch (error) {
      console.error("Falha ao iniciar o emulador:", error);
      this.stop();
      throw error;
    }
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    
    document.removeEventListener('keydown', this.keydownListener);
    document.removeEventListener('keyup', this.keyupListener);

    if (this.audioWorkletNode) {
      this.audioWorkletNode.disconnect();
      this.audioWorkletNode = null;
    }
    
    // Desconecta e remove o nó de ganho também.
    if(this.audioGainNode) {
      this.audioGainNode.disconnect();
      this.audioGainNode = null;
    }

    this.nes = null;
  }

  private async initAudio(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: this.SAMPLE_RATE,
      });
      await this.audioContext.audioWorklet.addModule('assets/vnes-audio-processor.js');
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'vnes-audio-processor');
    this.audioGainNode = this.audioContext.createGain(); // Cria o nó de ganho.
    
    // Conecta o worklet -> nó de ganho -> saída de áudio.
    this.audioWorkletNode.connect(this.audioGainNode);
    this.audioGainNode.connect(this.audioContext.destination);
    
    // Define o volume inicial a partir do serviço de configuração.
    this.setVolume(this.configService.getConfig().volume);
  }

  private handleKeydown(event: KeyboardEvent): void {
    const button = this.keyMap[event.code];
    if (button !== undefined && this.nes) {
      event.preventDefault();
      this.nes.buttonDown(1, button);
    }
  }

  private handleKeyup(event: KeyboardEvent): void {
    const button = this.keyMap[event.code];
    if (button !== undefined && this.nes) {
      event.preventDefault();
      this.nes.buttonUp(1, button);
    }
  }
}
