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
  editingMenuId: number | null = null;
  newMenu: any = null; // Stores the menu being added or edited inline
  editingMenuItemId: number | null = null; // To track the menuItem being edited
  newMenuItem: any = null; // Stores the menu item being added inline

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
    // Ensure no new menu is being added
    if (this.newMenu) {
      this.newMenu = null;
    }

    this.editingMenuId = menu.menu_id;

    // Populate the fields with the selected menu
    this.menuItems.forEach(menuItem => {
      menuItem.selected = menu.menu_item_ids.includes(menuItem.menu_item_id);
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
          this.editingMenuId = null; // Reset edit mode
        },
        (error) => console.error('Error updating menu:', error)
      );
    } else {
      // Add New Menu
      this.http.post(`${this.backendUrl}/menus`, menu).subscribe(
        (response: any) => {
          alert('Menu added successfully!');
          this.loadMenu(); // Reload the menu list to show the new menu
          this.newMenu = null; // Clear the newMenu after saving
        },
        (error) => console.error('Error adding menu:', error)
      );
    }
  }

  cancelEdit(menu: any) {
    if (menu.menu_id) {
      this.editingMenuId = null;
    } else {
      // If a new menu is being added, just remove it from the UI
      this.newMenu = null;
    }
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
    // Ensure no other menu is being edited
    this.editingMenuId = null;

    // Initialize a new menu object and ensure it doesn't get added to the list until saved
    this.newMenu = { 
      menu_name: '', 
      menu_name_urdu: '', 
      description: '', 
      menu_price: null, 
      isActive: false, 
      menu_item_ids: [] 
    };
  }

  // Menu Item Logic
  addMenuItem() {
    if (this.newMenuItem) return; // Prevent multiple inline rows for menu items

    this.newMenuItem = { item_name: '', item_name_urdu: '', description: '', price: null, category: '' };
    this.menuItems.push(this.newMenuItem);
    this.editingMenuItemId = null; // Ensure no other row is in edit mode
  }

  editMenuItem(menuItem: any) {
    this.editingMenuItemId = menuItem.menu_item_id;
  }

  saveMenuItem(menuItem: any) {
    if (!menuItem.item_name || !menuItem.description || !menuItem.price || !menuItem.category) {
      alert('Please fill in all fields.');
      return;
    }

    if (menuItem.menu_item_id) {
      this.http.put(`${this.backendUrl}/menu-items/${menuItem.menu_item_id}`, menuItem).subscribe(
        () => {
          alert('Menu Item updated successfully!');
          this.editingMenuItemId = null; // Reset edit mode
        },
        (error) => console.error('Error updating menu item:', error)
      );
    } else {
      this.http.post(`${this.backendUrl}/menu-items`, menuItem).subscribe(
        (response: any) => {
          alert('Menu Item added successfully!');
          this.newMenuItem = null;
          this.loadMenuItems();
        },
        (error) => console.error('Error adding menu item:', error)
      );
    }
  }

  cancelEditMenuItem(menuItem: any) {
    if (menuItem.menu_item_id) {
      this.editingMenuItemId = null;
    } else {
      this.menuItems.pop(); // Remove the new menu item row
      this.newMenuItem = null;
    }
  }

  deleteMenuItem(menuItemId: number) {
    this.http.delete(`${this.backendUrl}/menu-items/${menuItemId}`).subscribe(
      () => {
        alert('Menu Item deleted successfully!');
        this.loadMenuItems();
      },
      (error) => console.error('Error deleting menu item:', error)
    );
  }
}
