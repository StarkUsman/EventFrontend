import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  standalone: false,
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  backendUrl: string = 'http://localhost:3000';
  days: string[] = [];
  startDate: number = 15; // Starting day number, can be dynamic
  stage: number = 1; // Tracks the current stage of the reservation process
  reservation: any = {
    reservation_name: '',
    reserver_name: '',
    description: '',
    date: '',
    selected_slot: null,
    menus: [],  // Updated to contain menu information
    num_of_persons: 0,
    additional_services: [],
    selectedMenu: null, // Track selected menu for stage 3
    selected_items: [], // Track selected menu items for stage 4
  };
  availableMenus: any[] = []; // This will hold the fetched menus
  menuItems: any[] = []; // Holds the selected menu items
  availableSlots: any[] = []; // Holds the selected slots for stage 2
  additionalServices: any[] = [];
  bookings: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadMenus();
    this.loadAdditionalServices();
    this.loadReservations();
  }

  initDays(date: any) {
    if (!date) {
      console.error("Invalid date passed to initDays:", date);
      return;
    }

    // Convert string to Date if necessary
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", date);
      return;
    }

    this.days = [];
    let tempDate = new Date(date.getTime() - 3 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 7; i++) {
      const day = new Date(tempDate.getTime());
      day.setDate(tempDate.getDate() + i);
      this.days.push(day.toDateString());
    }
  }

  loadReservations() {
    // Fetch reservations from API (replace with your real endpoint)
    this.http.get<any[]>(`${this.backendUrl}/bookings`).subscribe(data => {
      this.bookings = data;
    });
  }

  loadMenus() {
    // Fetch menus from API (replace with your real endpoint)
    this.http.get<any[]>(`${this.backendUrl}/menus`).subscribe(data => {
      this.availableMenus = data;
    });
  }

  loadAdditionalServices() {
    this.http.get<any[]>(`${this.backendUrl}/additional-services`).subscribe(data => {
      this.additionalServices = data;
    });
  }

  loadMenuItems(menuItemIds: number[]) {
    this.menuItems = []; // Reset the menu items before loading
    menuItemIds.forEach((id) => {
      this.http.get<any>(`${this.backendUrl}/menu-items/${id}`).subscribe(item => {
        item.selected = true;
        this.menuItems.push(item);
        console.log('Loaded menu items:', this.menuItems);
      });
    });

    console.log('Loading menu items:', this.menuItems);
  }

  nextStage() {
    if (this.stage === 1 && this.isStage1Valid()) {
      this.initDays(this.reservation.date);
      this.stage++;
    } else if (this.stage === 2 && this.isStage2Valid()) {
      this.stage++;
    } else if (this.stage === 3 && this.isStage3Valid()) {
      this.stage++;
      this.loadMenuItems(this.reservation.selectedMenu.menu_item_ids); // Load menu items based on selected menu
    }
  }

  prevStage() {
    if (this.stage > 1) {
      this.stage--;
    }
  }

  isStage1Valid(): boolean {
    return this.reservation.reservation_name && this.reservation.reserver_name && this.reservation.description && this.reservation.date;
  }

  isStage2Valid(): boolean {
    return this.reservation.selected_slot !== null;
  }

  isStage3Valid(): boolean {
    // Ensure that a menu is selected and the number of persons is greater than 0
    return this.reservation.selectedMenu !== null && this.reservation.num_of_persons > 0;
  }

  saveReservation() {
    console.log('Saving Reservation:', this.reservation);
    console.log("*****************************************")            
    console.log("Reservation: ", JSON.stringify(this.reservation, null, 2));
    console.log("*****************************************")
    alert('Reservation saved!');
  }

  selectSlot(slot: any) {
    this.reservation.selected_slot = slot;
  }

  isSlotDisabled(slot: any): boolean {
    let formattedSlotDay = new Date(slot.day).toISOString().split('T')[0];
    let date = new Date(formattedSlotDay);
    date.setDate(date.getDate() + 1);
    let newFormattedDate = date.toISOString().split('T')[0];

    for (let i = 0; i < this.bookings.length; i++) {
      const booking = this.bookings[i];
      
      if (newFormattedDate === booking.slot_day && slot.type === booking.slot_type && slot.slot === booking.slot_number) {
        console.log('formattedSlotDay:', formattedSlotDay, 'booking.slot_day:', booking.slot_day);
        return true;
      }
    }
  
    return false;
  }  

  selectMenu(menu: any) {
    this.reservation.selectedMenu = menu; // Store selected menu
    // Trigger menu item load based on selected menu
    this.loadMenuItems(menu.menu_item_ids);
  }

  updateMenuSelection(item: any) {
    if (item.selected) {
      this.reservation.selected_items.push(item); // Add item to selected items if checked
    } else {
      const index = this.reservation.selected_items.indexOf(item);
      if (index !== -1) {
        this.reservation.selected_items.splice(index, 1); // Remove item from selected items if unchecked
      }
    }
  }

  removeMenuItem(item: any) {
    item.selected = false; // Unselect the item
    const index = this.menuItems.indexOf(item);
    if (index !== -1) {
      this.menuItems.splice(index, 1); // Remove item from menuItems array
    }
  }

  updateAdditionalServices(service: any) {
    if (service.selected) {
      this.reservation.additional_services.push(service);
    } else {
      const index = this.reservation.additional_services.findIndex((s: { additional_service_id: number }) => s.additional_service_id === service.additional_service_id);
      if (index !== -1) {
        this.reservation.additional_services.splice(index, 1);
      }
    }
  }
  
  toggleAdditionalService(service: any) {
    service.selected = !service.selected;
}


  getGrandTotal(): number {
    let total = this.reservation.selectedMenu ? this.reservation.selectedMenu.menu_price : 0;
    this.reservation.additional_services.forEach((service: { price: number }) => {
      total += service.price;
    });
    return total;
  }

}