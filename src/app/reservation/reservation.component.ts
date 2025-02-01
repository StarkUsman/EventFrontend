import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  standalone: false,

  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  backendUrl = 'http://localhost:3000';
  currentStep = 1; // Tracks which step the user is on
  reservations: any[] = [];
  halls: any[] = [];
  slots: any[] = [];
  menus: any[] = [];
  additionalServices: any[] = [];
  selectedDate: string = '';
  selectedSlot: any = null;
  selectedMenus: any[] = [];
  numberOfPersons: number | null = null;
  selectedServices: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReservations();
    this.loadHalls();
    this.loadMenus();
    this.loadAdditionalServices();
  }

  loadReservations() {
    this.http.get<any[]>(`${this.backendUrl}/bookings`).subscribe(
      (data) => (this.reservations = data),
      (error) => console.error('Error fetching reservations:', error)
    );
  }

  loadHalls() {
    this.http.get<any[]>(`${this.backendUrl}/halls`).subscribe(
      (data) => (this.halls = data),
      (error) => console.error('Error fetching halls:', error)
    );
  }

  loadSlots() {
    if (this.selectedDate) {
      this.http.get<any[]>(`${this.backendUrl}/slots?date=${this.selectedDate}`).subscribe(
        (data) => (this.slots = data),
        (error) => console.error('Error fetching slots:', error)
      );
    }
  }

  loadMenus() {
    this.http.get<any[]>(`${this.backendUrl}/menus`).subscribe(
      (data) => (this.menus = data),
      (error) => console.error('Error fetching menus:', error)
    );
  }

  loadAdditionalServices() {
    this.http.get<any[]>(`${this.backendUrl}/additional-services`).subscribe(
      (data) => (this.additionalServices = data),
      (error) => console.error('Error fetching additional services:', error)
    );
  }

  getSlotsForHall(hallId: number) {
    return this.slots ? this.slots.filter(slot => slot.hall_id === hallId) : [];
  }

  selectSlot(slot: any) {
    if (slot.isAvailable) {
      this.selectedSlot = slot;
    }
  }

  toggleMenuSelection(menu: any) {
    const index = this.selectedMenus.findIndex(m => m.menu_id === menu.menu_id);
    if (index > -1) {
      this.selectedMenus.splice(index, 1); // Deselect menu
    } else {
      this.selectedMenus.push(menu); // Select menu
    }
  }

  addService(service: any) {
    if (!this.selectedServices.includes(service)) {
      this.selectedServices.push(service);
    }
  }

  removeService(service: any) {
    this.selectedServices = this.selectedServices.filter(s => s !== service);
  }

  goToNextStep() {
    if (this.currentStep === 1 && !this.selectedDate) {
      alert('Please select a date.');
      return;
    }
    if (this.currentStep === 2 && !this.selectedSlot) {
      alert('Please select a slot.');
      return;
    }
    if (this.currentStep === 3 && (!this.selectedMenus.length || !this.numberOfPersons)) {
      alert('Please select at least one menu and enter the number of persons.');
      return;
    }
    this.currentStep++;
  }

  goToPreviousStep() {
    this.currentStep--;
  }

  completeReservation() {
    const reservationData = {
      date: this.selectedDate,
      slot_id: this.selectedSlot?.slot_id,
      hall_id: this.selectedSlot?.hall_id,
      menus: this.selectedMenus.map(menu => menu.menu_id),
      numberOfPersons: this.numberOfPersons,
      additionalServices: this.selectedServices.map(service => service.additional_service_id)
    };

    this.http.post(`${this.backendUrl}/reservations`, reservationData).subscribe(
      () => {
        alert('Reservation completed successfully!');
        this.loadReservations();
        this.resetForm();
      },
      (error) => console.error('Error making reservation:', error)
    );
  }

  resetForm() {
    this.currentStep = 1;
    this.selectedDate = '';
    this.selectedSlot = null;
    this.selectedMenus = [];
    this.numberOfPersons = null;
    this.selectedServices = [];
  }
}
