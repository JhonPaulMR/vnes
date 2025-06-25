import { Routes } from '@angular/router';
import { HomeContentComponent } from './home-content/home-content.component';
import { CartridgeListComponent } from './cartridge-list/cartridge-list.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthComponent } from './auth/auth.component'; // 1. Importe o novo componente
import { ConsoleConfigComponent } from './console-config/console-config.component';

export const routes: Routes = [
    { path: '', component: HomeContentComponent },
    { path: 'cartridges', component: CartridgeListComponent },
    { path: 'console', component: ConsoleConfigComponent },
    { path: 'game/:id', component: GameDetailComponent },
    { path: 'auth', component: AuthComponent }, // 2. Adicione a nova rota
    { path: '**', component: NotFoundComponent } // Rota curinga para páginas não encontradas
];
