import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGamepad, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './home-content.component.html',
})
export class HomeContentComponent {
  // Original icons are kept
  iconUsers = faGamepad;
  iconMagic = faUserGear;

  // Inject AuthService to check login status
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
