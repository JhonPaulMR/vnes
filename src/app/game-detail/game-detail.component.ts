import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Cartridge } from '../cartridge.model';
import { CartridgeService } from '../cartridge.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-detail.component.html',
})
export class GameDetailComponent implements OnInit {
  // A propriedade volta a ser um objeto simples.
  cartridge: Cartridge | undefined;

  constructor(
    private route: ActivatedRoute,
    private cartridgeService: CartridgeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // A chamada ao serviço é síncrona novamente.
    this.cartridge = this.cartridgeService.getCartridge(id);
  }
}