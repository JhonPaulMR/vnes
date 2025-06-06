import { Routes } from '@angular/router';
import { HomeContentComponent } from './home-content/home-content.component';
import { CartridgeListComponent } from './cartridge-list/cartridge-list.component';
import { ConsoleConfigComponent } from './console-config/console-config.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeContentComponent },
  { path: 'cartridges', component: CartridgeListComponent },
  { path: 'console', component: ConsoleConfigComponent },
  { path: 'game/:id', component: GameDetailComponent },
  { path: '**', component: NotFoundComponent } // Rota coringa para 404
];