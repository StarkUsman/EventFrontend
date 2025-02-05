import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  standalone: false,
  
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  days: string[] = [];
  startDate: number = 15; // Starting day number, can be dynamic
  stage: number = 1; // Tracks the current stage of the reservation process
  reservation: any = {
    reservation_name: '',
    reserver_name: '',
    description: '',
    date: '',
    selected_slot: null,
    selectedMenu: null,  // Changed to track only one selected menu
    menus: [],
    num_of_persons: 0,
    additional_services: []
  };
  availableMenus: any[] = []; // This will hold the fetched menus
  availableSlots: any[] = []; // Holds the selected slots for stage 2

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMenus();
  }

  initDays(date: any) {
    console.log('date:', date);
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

  loadMenus() {
    // Make an API call to fetch menus (replace with real endpoint)
    this.http.get<any[]>('http://localhost:3000/menus').subscribe(data => {
      this.availableMenus = data;
    });
  }

  nextStage() {
    if (this.stage === 1 && this.isStage1Valid()) {
      this.initDays(this.reservation.date);
      this.stage++;
    } else if (this.stage === 2 && this.isStage2Valid()) {
      this.stage++;
    } else if (this.stage === 3 && this.isStage3Valid()) {
      this.stage++;
    }
  }

  prevStage() {
    if (this.stage > 1) {
      this.stage--;
    }
  }

  isStage1Valid(): boolean {
    // Ensure reservation name, reserver name, description, and date are filled
    return this.reservation.reservation_name && this.reservation.reserver_name && this.reservation.description && this.reservation.date;
  }

  isStage2Valid(): boolean {
    return this.reservation.selected_slot !== null; // Ensure a slot is selected
  }

  isStage3Valid(): boolean {
    return this.reservation.selectedMenu !== null && this.reservation.num_of_persons > 0; // Ensure a menu is selected
  }

  saveReservation() {
    // Here, you would make an API call to save the reservation data
    console.log('Saving Reservation:', this.reservation);
    alert('Reservation saved!');
  }

  selectSlot(slot: any) {
    this.reservation.selected_slot = slot;
  }

  selectMenu(menu: any) {
    // Ensure only one menu is selected, directly assign it to selectedMenu
    this.reservation.selectedMenu = menu;
  }
}