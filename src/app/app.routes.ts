import { Routes } from '@angular/router';
import { HomeContentComponent } from './home-content/home-content.component';
import { CartridgeListComponent } from './cartridge-list/cartridge-list.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthComponent } from './auth/auth.component';
import { ConsoleConfigComponent } from './console-config/console-config.component';
import { authGuard } from './auth.guard'; // 1. Importar o guard

export const routes: Routes = [
    { path: '', component: HomeContentComponent },
    // 2. Aplicar o guard às rotas protegidas
    { path: 'cartridges', component: CartridgeListComponent, canActivate: [authGuard] },
    { path: 'console', component: ConsoleConfigComponent, canActivate: [authGuard] },
    { path: 'game/:id', component: GameDetailComponent, canActivate: [authGuard] },
    { path: 'auth', component: AuthComponent }, 
    { path: '**', component: NotFoundComponent }
];