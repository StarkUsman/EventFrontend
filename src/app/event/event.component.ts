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
  events: any[] = [];
  halls: any[] = [];
  editingEventId: number | null = null;
  newEvent: any = null; // Stores the event being added inline

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
    this.loadHalls();
  }

  getHallName(hallId: number) {
    const hall = this.halls.find((hall) => hall.hall_id === hallId);
    return hall ? hall.hall_name : 'Unknown hall';
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

  addEvent() {
    if (this.newEvent) return; // Prevent multiple inline rows

    this.newEvent = { event_id: null, event_name: '', description: '', hall_id: null };
    this.events.push(this.newEvent);
    this.editingEventId = null; // Ensure no other row is in edit mode
  }

  editEvent(event: any) {
    this.editingEventId = event.event_id;
  }

  saveEvent(event: any) {
    if (!event.event_name || !event.description || !event.hall_id) {
      alert('Please fill in all fields.');
      return;
    }

    if (event.event_id) {
      // Update existing event
      this.http.put(`${this.backendUrl}/events/${event.event_id}`, event).subscribe(
        () => {
          alert('Event updated successfully!');
          this.loadEvents();
        },
        (error) => console.error('Error updating event:', error)
      );
    } else {
      // Save new event
      this.http.post(`${this.backendUrl}/events`, event).subscribe(
        () => {
          alert('Event added successfully!');
          this.loadEvents();
        },
        (error) => console.error('Error saving event:', error)
      );
      this.newEvent = null;
    }
    this.editingEventId = null;
  }

  cancelEdit(event: any) {
    if (event.event_id) {
      this.editingEventId = null; // Reset edit mode
    } else {
      this.events.pop(); // Remove unsaved new row
      this.newEvent = null;
    }
  }

  deleteEvent(eventId: number) {
    this.http.delete(`${this.backendUrl}/events/${eventId}`).subscribe(
      () => {
        alert('Event deleted successfully!');
        this.loadEvents();
      },
      (error) => console.error('Error deleting event:', error)
    );
  }
}
