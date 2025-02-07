import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  backendUrl = 'http://localhost:3000';
  menu: any[] = [];
  menuItems: any[] = [];
  newMenu: any = null; // Stores the menu being added or edited inline

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMenu();
    this.loadMenuItems();
  }

  loadMenu() {
    this.http.get<any[]>(`${this.backendUrl}/menus`).subscribe(
      (data) => {
        this.menu = data;
      },
      (error) => console.error('Error fetching menus:', error)
    );
  }

  loadMenuItems() {
    this.http.get<any[]>(`${this.backendUrl}/menu-items`).subscribe(
      (data) => {
        this.menuItems = data;
      },
      (error) => console.error('Error fetching menuItems:', error)
    );
  }

  editMenu(menu: any) {
    // Convert menu_item_ids to numbers
    const menuItemIds = menu.menu_item_ids.map((id: string) => Number(id));
  
    // Populate the fields with the selected menu for editing
    this.newMenu = { ...menu };
  
    // Mark existing menu items as selected
    this.menuItems.forEach(item => {
      item.selected = menuItemIds.includes(item.menu_item_id);
    });
  }
    

  saveMenu(menu: any) {
    // Ensure the menu_item_ids are correctly set based on selected checkboxes
    menu.menu_item_ids = this.menuItems.filter(menuItem => menuItem.selected).map(menuItem => menuItem.menu_item_id);

    if (!menu.menu_name || !menu.description || !menu.menu_price || !menu.isActive) {
      alert('Please fill in all fields.');
      return;
    }

    if (menu.menu_id) {
      // Edit Menu
      this.http.put(`${this.backendUrl}/menus/${menu.menu_id}`, menu).subscribe(
        () => {
          alert('Menu updated successfully!');
          this.loadMenu(); // Reload the menu list
          this.newMenu = null; // Clear form after saving
        },
        (error) => console.error('Error updating menu:', error)
      );
    } else {
      // Add New Menu
      this.http.post(`${this.backendUrl}/menus`, menu).subscribe(
        () => {
          alert('Menu added successfully!');
          this.loadMenu(); // Reload the menu list
          this.newMenu = null; // Clear form after saving
        },
        (error) => console.error('Error adding menu:', error)
      );
    }
  }

  cancelEdit() {
    this.newMenu = null;
  }

  deleteMenu(menuId: number) {
    this.http.delete(`${this.backendUrl}/menus/${menuId}`).subscribe(
      () => {
        alert('Menu deleted successfully!');
        this.loadMenu();
      },
      (error) => console.error('Error deleting menu:', error)
    );
  }

  addMenu() {
    // Initialize a new menu object for adding
    this.newMenu = { 
      menu_name: '', 
      description: '', 
      menu_price: null, 
      isActive: false, 
      menu_item_ids: [] 
    };
  }

  toggleMenuItemSelection(menuItem: any) {
    menuItem.selected = !menuItem.selected;
  }
}
