import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-additional',
  standalone: false,

  templateUrl: './additional.component.html',
  styleUrls: ['./additional.component.css']
})
export class AdditionalComponent implements OnInit {
  additionalServices: any[] = []; // Array to store fetched additional services
  editingServiceId: number | null = null; // Flag to track which service is being edited
  newService: any = { // For creating new services
    additional_service_name: '',
    additional_service_name_urdu: '',
    description: '',
    price: 0,
    category: '',
    isEditable: 1,
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAdditionalServices(); // Fetch additional services when component initializes
  }

  loadAdditionalServices(): void {
    this.http.get<any[]>('http://localhost:3000/additional-services').subscribe(
      data => {
        this.additionalServices = data;
      },
      error => {
        console.error('Error loading additional services', error);
      }
    );
  }

  editService(service: any): void {
    this.editingServiceId = service.additional_service_id; // Mark as editing
  }

  cancelEdit(): void {
    this.editingServiceId = null; // Stop editing
  }

  saveService(service: any): void {
    if (service.additional_service_id) {
      // Update the service
      this.http.put(`http://localhost:3000/additional-services/${service.additional_service_id}`, service)
        .subscribe(response => {
          const index = this.additionalServices.findIndex(s => s.additional_service_id === service.additional_service_id);
          if (index !== -1) {
            this.additionalServices[index] = service; // Update the local list
            window.alert('Service updated successfully!');
          }
          this.editingServiceId = null; // Stop editing
        }, error => console.error('Error saving service', error));
    } else {
      // Create new service
      this.http.post('http://localhost:3000/additional-services', service)
        .subscribe(response => {
          this.additionalServices.push(response); // Add new service to the list
          this.editingServiceId = null; // Stop editing
          window.alert('New service added successfully!');
          this.loadAdditionalServices();
        }, error => console.error('Error saving new service', error));
    }
  }

  deleteService(service: any): void {
    this.http.delete(`http://localhost:3000/additional-services/${service.additional_service_id}`).subscribe(
      response => {
        this.additionalServices = this.additionalServices.filter(s => s.additional_service_id !== service.additional_service_id);
      },
      error => console.error('Error deleting service', error)
    );
  }

  addNewService(): void {
    this.editingServiceId = -1;
    this.newService = { // Reset the new service form
      additional_service_name: '',
      additional_service_name_urdu: '',
      description: '',
      price: 0,
      category: '',
      isEditable: 1,
    };
  }
}
