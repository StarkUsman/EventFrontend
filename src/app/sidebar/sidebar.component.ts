import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {

  constructor(private authService: AuthService) {}
  
  isCollapsed = false;
  activeDropdown: string | null = null;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubMenu(menu: string): void {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

logout(): void {
    this.authService.logout();
  }
}
