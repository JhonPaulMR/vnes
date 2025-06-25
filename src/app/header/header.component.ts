import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-header',
  standalone: true,
  // Add CommonModule to imports to enable *ngIf
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Inject the AuthService to access user data and logout functionality
  private authService = inject(AuthService);
  
  // Create a direct reference to the currentUser signal from the service
  currentUser = this.authService.currentUser;

  /**
   * Calls the logout method from the AuthService.
   */
  logout() {
    this.authService.logout();
  }
}
