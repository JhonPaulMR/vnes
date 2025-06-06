import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { CartridgeListComponent } from './cartridge-list/cartridge-list.component';
import { ConsoleConfigComponent } from './console-config/console-config.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameCardComponent } from './game-card/game-card.component';
import { NotFoundComponent } from './not-found/not-found.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    HomeContentComponent,
    CartridgeListComponent,
    ConsoleConfigComponent,
    GameDetailComponent,
    GameCardComponent,
    NotFoundComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vnes-project';
}