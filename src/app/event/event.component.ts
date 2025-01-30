import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event',
  standalone: false,
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  backendUrl = 'http://localhost:3000';
  showForm: boolean = false;
  newEvent = { event_id: null, event_name: '', description: '', hall_id: null };
  events: any[] = [];
  halls: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
    this.loadHalls();  // Fetch halls data for the dropdown
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  loadEvents() {
    this.http.get<any[]>(`${this.backendUrl}/events`).subscribe(
      (data) => (this.events = data),
      (error) => console.error('Error fetching events:', error)
    );
  }

  loadHalls() {
    this.http.get<any[]>(`${this.backendUrl}/halls`).subscribe(
      (data) => (this.halls = data),
      (error) => console.error('Error fetching halls:', error)
    );
  }

  saveEvent() {
    if (!this.newEvent.event_name || !this.newEvent.description || !this.newEvent.hall_id) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.newEvent.event_id) {
      // Edit Event
      this.http.put(`${this.backendUrl}/events/${this.newEvent.event_id}`, this.newEvent).subscribe(
        (response) => {
          alert('Event updated successfully!');
          this.loadEvents(); // Refresh list
          this.resetForm(); // Reset form after update
        },
        (error) => console.error('Error updating event:', error)
      );
    } else {
      // Add New Event
      this.http.post(`${this.backendUrl}/events`, this.newEvent).subscribe(
        (response) => {
          alert('Event added successfully!');
          this.loadEvents(); // Refresh list
          this.resetForm(); // Reset form after add
        },
        (error) => console.error('Error saving event:', error)
      );
    }
  }

  editEvent(event: any) {
    this.newEvent = { ...event };
    this.showForm = true;
  }

  deleteEvent(eventId: number) {
    this.http.delete(`${this.backendUrl}/events/${eventId}`).subscribe(
      (response) => {
        alert('Event deleted successfully!');
        this.loadEvents(); // Refresh list
      },
      (error) => console.error('Error deleting event:', error)
    );
  }

  resetForm() {
    this.newEvent = { event_id: null, event_name: '', description: '', hall_id: null };
    this.showForm = false;
  }
}
