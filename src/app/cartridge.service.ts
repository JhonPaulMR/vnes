import { Injectable } from '@angular/core';
import { Cartridge } from './cartridge.model';

@Injectable({
  providedIn: 'root'
})
export class CartridgeService {

  // Retornamos com a lista de cartuchos padrão.
  private cartridges: Cartridge[] = [
    {
      id: 1,
      title: 'Super Mario Bros',
      description: 'Um jogo de plataforma clássico.',
      imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6pib.webp',
      genre: 'Plataforma',
      releaseYear: 1985
    },
    {
      id: 2,
      title: 'Contra (1987)',
      description: 'Um jogo de tiro 2D clássico.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/6/65/Contra_cover.jpg',
      genre: 'Tiro',
      releaseYear: 1989
    },
    {
      id: 3,
      title: "Kirby's Adventure",
      description: "Kirby's Adventure is a 1993 action-platform video game developed by HAL Laboratory and published by Nintendo for the Nintendo Entertainment System. It is the second game in the Kirby series after his debut on the Game Boy and the first to include the Copy ability, which allows Kirby to gain power-ups from eating certain enemies. It is the only NES game in the Kirby series, released towards the end of the NES's lifespan and pushed the palette and graphical capabilities of the NES to its limit.",
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Kirby%27s_Adventure_Coverart.png',
      genre: 'Plataforma',
      releaseYear: 1985
    }
  ];

  constructor() { }

  // O método volta a ser síncrono, retornando o array diretamente.
  getCartridges(): Cartridge[] {
    return this.cartridges;
  }

  // O método volta a usar .find() no array local.
  getCartridge(id: number): Cartridge | undefined {
    return this.cartridges.find(c => c.id === id);
  }
}