import { Component, OnInit, inject, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Cartridge } from '../cartridge.model';
import { CartridgeService } from '../cartridge.service';
import { EmulatorService } from '../emulator.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink], // CommonModule para *ngIf e RouterLink para os links
  templateUrl: './game-detail.component.html',
})
export class GameDetailComponent implements OnInit, OnDestroy {
  cartridge: Cartridge | undefined;
  error: string | null = null;
  
  // --- Controle da UI ---
  isPlaying = false;
  isLoadingRom = false;
  emulatorError: string | null = null;
  isFullscreen = false; // Propriedade para rastrear o estado de tela cheia

  @ViewChild('nesCanvas') nesCanvas!: ElementRef<HTMLCanvasElement>;

  // Injeção de dependências
  private route = inject(ActivatedRoute);
  private cartridgeService = inject(CartridgeService);
  private emulatorService = inject(EmulatorService);
  private cdr = inject(ChangeDetectorRef); // Para forçar a detecção de mudanças

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cartridgeService.getCartridge(id).subscribe({
        next: (data) => { this.cartridge = data; },
        error: (err) => {
          this.error = 'Não foi possível carregar os detalhes do cartucho.';
          console.error(err);
        }
      });
    }
    // Adiciona um listener para o evento de mudança de tela cheia do navegador
    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
  }

  ngOnDestroy(): void {
    this.emulatorService.stop();
    // Remove o listener para evitar vazamentos de memória
    document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
  }

  playGame(): void {
    if (!this.cartridge?.romUrl) return;

    this.isPlaying = true;
    this.isLoadingRom = true;
    this.emulatorError = null;

    setTimeout(async () => {
      if (!this.nesCanvas) {
        this.emulatorError = "Erro crítico: O elemento canvas não foi encontrado no DOM.";
        this.isLoadingRom = false;
        this.isPlaying = false;
        return;
      }
      
      try {
        const response = await fetch(this.cartridge!.romUrl);
        if (!response.ok) throw new Error(`Falha ao baixar a ROM (HTTP ${response.status})`);
        
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let romData = "";
        for (let i = 0; i < uint8Array.length; i++) {
          romData += String.fromCharCode(uint8Array[i]);
        }
        
        this.isLoadingRom = false;
        await this.emulatorService.start(this.nesCanvas.nativeElement, romData);

      } catch (err: any) {
        console.error("Erro no processo de iniciar o jogo:", err);
        this.emulatorError = `Falha ao iniciar o jogo: ${err.message}`;
        this.isLoadingRom = false;
        this.isPlaying = false;
      }
    }, 0);
  }

  stopGame(): void {
    this.emulatorService.stop();
    this.isPlaying = false;
  }
  
  /**
   * Chamado quando o estado de tela cheia do navegador muda.
   */
  private onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
    this.cdr.detectChanges(); // Atualiza a UI para refletir a mudança no ícone
  }

  /**
   * Alterna o modo de tela cheia para o canvas do emulador.
   */
  toggleFullscreen(): void {
    const elem = this.nesCanvas.nativeElement;
    if (!this.isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}
