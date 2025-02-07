import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sub-menu',
  standalone: false,
  
  templateUrl: './sub-menu.component.html',
  styleUrl: './sub-menu.component.css'
})
export class SubMenuComponent implements OnInit {
  backendUrl = 'http://localhost:3000';
  menuItems: any[] = [];
  editingMenuItemId: number | null = null; // To track the menuItem being edited
  newMenuItem: any = null; // Stores the menu item being added inline
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.http.get<any[]>(`${this.backendUrl}/menu-items`).subscribe(
      (data) => {
        this.menuItems = data;
      },
      (error) => console.error('Error fetching menuItems:', error)
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
