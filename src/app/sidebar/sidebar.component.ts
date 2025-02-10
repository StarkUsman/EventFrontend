import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isCollapsed = false;
  activeDropdown: string | null = null;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubMenu(menu: string): void {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }
}
