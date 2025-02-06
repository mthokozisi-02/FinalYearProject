import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-metals',
  templateUrl: './metals.component.html',
  styleUrl: './metals.component.css'
})
export class MetalsComponent {
  public metalsForm: FormGroup;
  successMessage = "";
  errorMessage = "";

  constructor(private http: HttpClient, private router: Router){
    this.metalsForm = new FormGroup({
      name: new FormControl('', [Validators.required]),     
      quantity: new FormControl(1, [Validators.required]),     
      buyingPrice: new FormControl('', [Validators.required]),     
      description: new FormControl('', [Validators.required]),
      // category: new FormControl('', [Validators.required]),
      // prize: new FormControl(1, [Validators.required, Validators.min(1)]),
      // photo_url: new FormControl(''),
      created_by: new FormControl("Mavutsetse"),
    });
   }

   addMetal(){
    console.log(this.metalsForm.value);
    
   }

}
