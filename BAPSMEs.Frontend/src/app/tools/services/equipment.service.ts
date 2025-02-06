import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Equipment } from '../../../models/equipment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService  extends AlertService{

  constructor(private http: HttpClient) {
    super()
    this.getEquipment();
  }

  equipmentList = signal<Equipment[]>([]);

  getEquipment() {
    const url = "http://localhost:8000/api/v1/equipment";
    this.http.get(url).subscribe({
      next: (data: any) => {
        // console.log(data);
        this.equipmentList.set(data.data)
      },
      error: (error: any) => {
        console.error(error);
        // Handle the error as needed
      }
    });
  }
}
