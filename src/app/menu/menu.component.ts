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
  newMenu: any = null; // Stores the menu being added inline
  editingMenuItemId: number | null = null; // To track the menuItem being edited
  newMenuItem: any = null; // Stores the menu item being added inline

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMenu();
    this.loadMenuItems();
  }

  getMenuItemName(menuItemID: number) {
    const menuItem = this.menuItems.find((menuItem) => menuItem.menu_item_id === menuItemID);
    return menuItem ? menuItem.item_name : 'Unknown menu item';
  }

  loadMenu() {
    this.http.get<any[]>(`${this.backendUrl}/menus`).subscribe(
      (data) => (this.menu = data),
      (error) => console.error('Error fetching menus:', error)
    );
  }

  loadMenuItems() {
    this.http.get<any[]>(`${this.backendUrl}/menu-items`).subscribe(
      (data) => (this.menuItems = data),
      (error) => console.error('Error fetching menuItems:', error)
    );
  }

  addMenu() {
    if (this.newMenu) return; // Prevent multiple inline rows

    this.newMenu = { menu_name: null, menu_name_urdu: '', description: '', menu_price: null, isActive: null };
    this.menu.push(this.newMenu);
    this.editingMenuId = null; // Ensure no other row is in edit mode
  }

  editMenu(menu: any) {
    this.editingMenuId = menu.menu_id;
  }

  saveMenu(menu: any) {
    if (!menu.menu_name || !menu.description || !menu.menu_price || !menu.isActive) {
      alert('Please fill in all fields.');
      return;
    }

    if (menu.menu_id) {
      this.http.put(`${this.backendUrl}/menu/${menu.menu_id}`, menu).subscribe(
        () => {
          alert('Menu updated successfully!');
          this.editingMenuId = null; // Reset edit mode
        },
        (error) => console.error('Error updating menu:', error)
      );
    } else {
      this.http.post(`${this.backendUrl}/menu`, menu).subscribe(
        (response: any) => {
          alert('Menu added successfully!');
          this.newMenu = null;
          this.loadMenu();
        },
        (error) => console.error('Error adding menu:', error)
      );
    }
  }

  cancelEdit(menu: any) {
    if (menu.menu_id) {
      this.editingMenuId = null;
    } else {
      this.menu.pop(); // Remove the new menu row
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
