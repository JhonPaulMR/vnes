import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ConfigService, EmulatorConfig, KeyMap } from '../config.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // 1. Importar o CommonModule

declare var jsnes: any;

@Component({
  selector: 'app-console-config',
  templateUrl: './console-config.component.html',
  standalone: true, // 2. Marcar o componente como standalone
  imports: [CommonModule] // 3. Importar o CommonModule para usar *ngIf, *ngFor, ngClass, etc.
})
export class ConsoleConfigComponent implements OnInit, OnDestroy {
  // Configuração atual
  config: EmulatorConfig;
  volume: number = 0.5;
  keyMap: KeyMap = {};
  
  // Estado para remapeamento
  listeningFor: number | null = null;
  
  private configSubscription: Subscription;

  // Lista de controles para facilitar a exibição no template
  controls = [
    { name: 'Cima', button: jsnes.Controller.BUTTON_UP },
    { name: 'Baixo', button: jsnes.Controller.BUTTON_DOWN },
    { name: 'Esquerda', button: jsnes.Controller.BUTTON_LEFT },
    { name: 'Direita', button: jsnes.Controller.BUTTON_RIGHT },
    { name: 'Botão A', button: jsnes.Controller.BUTTON_A },
    { name: 'Botão B', button: jsnes.Controller.BUTTON_B },
    { name: 'Start', button: jsnes.Controller.BUTTON_START },
    { name: 'Select', button: jsnes.Controller.BUTTON_SELECT },
  ];

  constructor(private configService: ConfigService) {
    // Carrega a configuração inicial
    this.config = this.configService.getConfig();
    this.volume = this.config.volume;
    this.keyMap = this.config.keyMap;
    
    // Assina para futuras atualizações
    this.configSubscription = this.configService.config$.subscribe(newConfig => {
      this.config = newConfig;
      this.volume = newConfig.volume;
      this.keyMap = newConfig.keyMap;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.configSubscription.unsubscribe();
    // Garante que sai do modo de escuta se o componente for destruído
    this.listeningFor = null;
  }

  /**
   * Listener global para capturar a tecla pressionada durante o remapeamento.
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.listeningFor !== null) {
      event.preventDefault();
      const newKeyCode = event.code;
      
      // Remove o mapeamento antigo, se houver, para evitar teclas duplicadas.
      Object.keys(this.keyMap).forEach(key => {
        if (this.keyMap[key] === this.listeningFor) {
          delete this.keyMap[key];
        }
      });

      // Define o novo mapeamento
      const updatedKeyMap = { ...this.keyMap, [newKeyCode]: this.listeningFor };
      this.configService.setKeyMap(updatedKeyMap);
      
      // Sai do modo de escuta
      this.listeningFor = null;
    }
  }

  /**
   * Inicia o processo de remapeamento para um botão específico.
   * @param button O número do botão do controle a ser remapeado.
   */
  startRemapping(button: number): void {
    this.listeningFor = button;
  }

  /**
   * Encontra qual tecla está mapeada para um determinado botão.
   * @param buttonValue O número do botão do controle.
   * @returns O 'code' da tecla ou null se não for encontrado.
   */
  getKeyForButton(buttonValue: number): string | null {
    return Object.keys(this.keyMap).find(key => this.keyMap[key] === buttonValue) || null;
  }
  
  /**
    * Retorna o nome amigável de um controle a partir do seu valor.
    */
  getControlName(buttonValue: number | null): string {
    if(buttonValue === null) return '';
    const control = this.controls.find(c => c.button === buttonValue);
    return control ? control.name : '';
  }

  /**
   * É chamado quando o slider de volume é alterado.
   * @param event O evento do input do slider.
   */
  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    this.configService.setVolume(newVolume);
  }
  
  /**
    * Restaura as configurações para os valores padrão.
    */
  resetToDefaults(): void {
    // Recarrega a página para forçar a recriação dos serviços com valores padrão.
    localStorage.removeItem('vnes_config');
    window.location.reload();
  }
}
