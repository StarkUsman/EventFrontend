import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hall',
  standalone: false,
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css']
})
export class HallComponent implements OnInit {
  backendUrl = 'http://localhost:3000';
  showForm: boolean = false;
  newHall = { hall_id: null, hall_name: '', capacity: null, isAvailable: 0 };
  halls: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadHalls();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm(); 
    }
  }

  resetForm() {
    this.newHall = { hall_id: null, hall_name: '', capacity: null, isAvailable: 0 };
  }

  loadHalls() {
    this.http.get<any[]>(`${this.backendUrl}/halls`).subscribe(
      (data) => (this.halls = data),
      (error) => console.error('Error fetching halls:', error)
    );
  }

  saveHall() {
    if (!this.newHall.hall_name || !this.newHall.capacity || this.newHall.isAvailable === undefined) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.newHall.hall_id) {
      // If hall_id exists, update the existing hall
      this.updateHall(this.newHall);
    } else {
      // If hall_id doesn't exist, add a new hall
      this.addHall(this.newHall);
    }
  }

  addHall(hall: any) {
    this.http.post(`${this.backendUrl}/halls`, hall).subscribe(
      (response) => {
        alert('Hall added successfully!');
        this.loadHalls(); 
        this.toggleForm(); 
      },
      (error) => console.error('Error adding hall:', error)
    );
  }

  updateHall(hall: any) {
    this.http.put(`${this.backendUrl}/halls/${hall.hall_id}`, hall).subscribe(
      (response) => {
        alert('Hall updated successfully!');
        this.loadHalls(); 
        this.toggleForm(); 
      },
      (error) => console.error('Error updating hall:', error)
    );
  }

  editHall(hall: any) {
    this.newHall = { ...hall };
    this.showForm = true; 
  }

  deleteHall(hallId: number) {
    if (confirm('Are you sure you want to delete this hall?')) {
      this.http.delete(`${this.backendUrl}/halls/${hallId}`).subscribe(
        (response) => {
          alert('Hall deleted successfully!');
          this.loadHalls(); // Refresh list
        },
        (error) => console.error('Error deleting hall:', error)
      );
    }
  }
}
