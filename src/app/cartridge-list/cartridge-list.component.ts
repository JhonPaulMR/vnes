import { Component, OnInit } from '@angular/core';
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
  // A propriedade volta a ser um array simples.
  cartridges: Cartridge[] = [];

  constructor(private cartridgeService: CartridgeService) {}

  ngOnInit(): void {
    // A chamada ao serviço é síncrona novamente.
    this.cartridges = this.cartridgeService.getCartridges();
  }
}