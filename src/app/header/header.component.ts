import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service'; // Import AuthService
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse, faRightToBracket, faGamepad, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  // Add CommonModule to imports to enable *ngIf
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Inject the AuthService to access user data and logout functionality
  private authService = inject(AuthService);
  
  // Create a direct reference to the currentUser signal from the service
  currentUser = this.authService.currentUser;
  
  // Ícones do Header
  iconHome = faHouse;
  iconLogin = faRightToBracket;
  iconCart = faGamepad;
  iconSettings = faGear;
  iconLogout = faRightFromBracket;

  /**
   * Calls the logout method from the AuthService.
   */
  logout() {
    this.authService.logout();
  }
}
