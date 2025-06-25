import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cartridge } from '../cartridge.model';
import { CartridgeService } from '../cartridge.service';
import { GameCardComponent } from '../game-card/game-card.component';

@Component({
  selector: 'app-cartridge-list',
  standalone: true,
  imports: [CommonModule, GameCardComponent],
  templateUrl: './cartridge-list.component.html',
})
export class CartridgeListComponent implements OnInit {
  cartridges: Cartridge[] = [];
  error: string | null = null;
  private cartridgeService = inject(CartridgeService);

  ngOnInit(): void {
    // A chamada ao serviço agora é assíncrona.
    // Usamos .subscribe() para receber os dados quando estiverem prontos.
    this.cartridgeService.getCartridges().subscribe({
      next: (data) => {
        this.cartridges = data;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar a lista de cartuchos. A API simulada está em execução?';
        console.error(err);
      }
    });
  }
}