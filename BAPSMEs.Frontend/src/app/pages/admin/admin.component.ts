import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  public equipmentForm: FormGroup;
  selectedFile: File | undefined;
  equipment: any;
  errorMessage = "";
  successMessage = "";

  constructor(private router: Router, private http: HttpClient) {
    this.equipmentForm = new FormGroup({
      name: new FormControl('', [Validators.required]),     
      brand: new FormControl('', [Validators.required]),     
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      prize: new FormControl(1, [Validators.required, Validators.min(1)]),
      photo_url: new FormControl(''),
      created_by: new FormControl("Mavutsetse"),
    });

    this.getAllEquipment();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      this.selectedFile = target.files[0];
    }
  }

  getAllEquipment(){
    const url = "http://localhost:8000/api/v1/equipment";
    this.http.get(url).subscribe({
      next: (data: any) => {
        console.log(data);
        this.equipment = data.data;
      },
      error: (error: any) => {
        console.error(error);
        // Handle the error as needed
      }
    });
    }

  
  addEquipment(){
    const formData = new FormData();

    Object.keys(this.equipmentForm.value).forEach(key => {          
      formData.append(key, this.equipmentForm.value[key]);
  }); 
  if (this.selectedFile) { 
    formData.append('image', this.selectedFile);  
  }    
    // console.log(this.equipmentForm.value);
    const url = "http://localhost:8000/api/v1/equipment";
    this.http.post(url, formData).subscribe({ 
      next:(data:any) => {
        this.successMessage = "Equipment Uploaded Successfully";
        console.log(data)         
      },
      error:(err: HttpErrorResponse) => {
        console.log(err.error.errors.name);
        this.errorMessage = err.error.errors.name;
        // if(err.status === 0){
        //   this.errorMessage = "Failed to connect to server";
        //   //send sms notification to admin
        // }
      }
    }) 
  }
  
}
