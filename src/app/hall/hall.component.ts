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
  halls: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadHalls();
  }

  loadHalls() {
    this.http.get<any[]>(`${this.backendUrl}/halls`).subscribe(
      (data) => {
        this.halls = data.map(hall => ({ ...hall, isEditing: false })); // Add editing state
      },
      (error) => console.error('Error fetching halls:', error)
    );
  }

  addNewHall() {
    this.halls.push({
      hall_id: null,
      hall_name: '',
      capacity: null,
      isAvailable: 1,
      isEditing: true
    });
  }

  editHall(hall: any) {
    hall.isEditing = true;
  }

  saveHall(hall: any) {
    if (!hall.hall_name || !hall.capacity) {
      alert('Please fill in all fields.');
      return;
    }

    if(hall.isAvailable == 3){
      hall.isAvailable1 = 1;
      hall.isAvailable2 = 1;
    } else if(hall.isAvailable == 2){
      hall.isAvailable1 = 0;
      hall.isAvailable2 = 1;
    } else if(hall.isAvailable == 1){
      hall.isAvailable1 = 1;
      hall.isAvailable2 = 0;
    } else {
      hall.isAvailable1 = 0;
      hall.isAvailable2 = 0;
    }

    if (hall.hall_id) {
      // Update existing hall
      this.http.put(`${this.backendUrl}/halls/${hall.hall_id}`, hall).subscribe(
        () => {
          alert('Hall updated successfully!');
          hall.isEditing = false;
        },
        (error) => console.error('Error updating hall:', error)
      );
    } else {
      // Create new hall
      this.http.post(`${this.backendUrl}/halls`, hall).subscribe(
        (response: any) => {
          alert('Hall added successfully!');
          hall.hall_id = response.hall_id; // Assign new ID
          hall.isEditing = false;
        },
        (error) => console.error('Error saving hall:', error)
      );
    }
  }

  cancelEdit(hall: any, index: number) {
    if (!hall.hall_id) {
      // Remove row if it's a new entry
      this.halls.splice(index, 1);
    } else {
      hall.isEditing = false;
      this.loadHalls(); // Revert changes by reloading
    }
  }

  deleteHall(hallId: number, index: number) {
    if (confirm('Are you sure you want to delete this hall?')) {
      this.http.delete(`${this.backendUrl}/halls/${hallId}`).subscribe(
        () => {
          alert('Hall deleted successfully!');
          this.halls.splice(index, 1); // Remove from list
        },
        (error) => console.error('Error deleting hall:', error)
      );
    }
  }
}
