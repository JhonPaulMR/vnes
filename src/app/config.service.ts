import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Define a interface para o mapa de teclas para garantir a tipagem.
export interface KeyMap {
  [key: string]: number;
}

// Define a interface para o objeto de configuração completo.
export interface EmulatorConfig {
  volume: number;
  keyMap: KeyMap;
}

declare var jsnes: any;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Chave para salvar as configurações no localStorage.
  private static readonly CONFIG_STORAGE_KEY = 'vnes_config';

  // Configuração padrão, usada se nenhuma for encontrada.
  private defaultConfig: EmulatorConfig = {
    volume: 0.5, // Volume padrão de 50%
    keyMap: {
      'ArrowUp': jsnes.Controller.BUTTON_UP,
      'ArrowDown': jsnes.Controller.BUTTON_DOWN,
      'ArrowLeft': jsnes.Controller.BUTTON_LEFT,
      'ArrowRight': jsnes.Controller.BUTTON_RIGHT,
      'KeyX': jsnes.Controller.BUTTON_A,
      'KeyZ': jsnes.Controller.BUTTON_B,
      'Enter': jsnes.Controller.BUTTON_START,
      'ShiftRight': jsnes.Controller.BUTTON_SELECT,
    }
  };

  // BehaviorSubject para notificar os componentes sobre mudanças na configuração.
  public config$: BehaviorSubject<EmulatorConfig>;

  constructor() {
    const savedConfig = this.loadConfig();
    this.config$ = new BehaviorSubject(savedConfig);
  }

  /**
   * Carrega a configuração do localStorage.
   * Se não houver configuração salva, retorna a padrão.
   */
  private loadConfig(): EmulatorConfig {
    try {
      const savedConfig = localStorage.getItem(ConfigService.CONFIG_STORAGE_KEY);
      if (savedConfig) {
        // Validação básica para garantir que a configuração carregada está correta.
        const parsed = JSON.parse(savedConfig);
        if (parsed.volume !== undefined && parsed.keyMap) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configuração do localStorage:", error);
    }
    return this.defaultConfig;
  }

  /**
   * Salva a configuração atual no localStorage.
   * @param config A configuração a ser salva.
   */
  public saveConfig(config: EmulatorConfig): void {
    try {
      localStorage.setItem(ConfigService.CONFIG_STORAGE_KEY, JSON.stringify(config));
      this.config$.next(config); // Notifica os assinantes sobre a nova configuração.
    } catch (error) {
      console.error("Erro ao salvar configuração no localStorage:", error);
    }
  }

  /**
   * Retorna o valor de configuração atual.
   */
  public getConfig(): EmulatorConfig {
    return this.config$.getValue();
  }

  /**
   * Atualiza apenas o volume e salva a configuração.
   * @param volume Novo nível de volume (0.0 a 1.0).
   */
  public setVolume(volume: number): void {
    const currentConfig = this.getConfig();
    const newConfig = { ...currentConfig, volume };
    this.saveConfig(newConfig);
  }

  /**
   * Atualiza apenas o mapa de teclas e salva a configuração.
   * @param keyMap O novo mapa de teclas.
   */
  public setKeyMap(keyMap: KeyMap): void {
    const currentConfig = this.getConfig();
    const newConfig = { ...currentConfig, keyMap };
    this.saveConfig(newConfig);
  }
}