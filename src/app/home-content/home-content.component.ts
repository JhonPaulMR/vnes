import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGamepad, faUserGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './home-content.component.html',
})
export class HomeContentComponent {
  iconUsers = faGamepad;
  iconMagic = faUserGear;
}