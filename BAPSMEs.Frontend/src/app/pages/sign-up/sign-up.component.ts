import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Roles } from '../../tools/models';
import { SignUpService } from '../../tools/services';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  roles: any;

  errorAlert: any;

    public signUpForm: FormGroup;

  constructor(private router: Router, private signUpService: SignUpService){
    this.signUpForm = new FormGroup({
                    name: new FormControl('', [Validators.required]),
                    email: new FormControl('', [Validators.email]),
                    password: new FormControl('', [Validators.required,Validators.minLength(10)]),
                    role: new FormControl('', [Validators.required]),
                    password_confirmation: new FormControl('',[Validators.required])
                  });
  }

      ngOnInit(): void{

        this.roles = Object.values(Roles)
      }

      signUp(){
        if(this.signUpForm.value.password !== this.signUpForm.value.password_confirmation){
          this.errorAlert = true;
        }
        else{
          this.errorAlert = false;
          console.log(this.signUpForm.value);

                this.signUpService.signUp(this.signUpForm.value)
                  .subscribe((res) => {
                    console.log(res);

                    if (res.message === 'Registration Successful') {
                      this.router.navigate(["/login"])
                    }
                    else {
                      console.log(res.message);
                // Handle the error as needed
                    }

                  },
                    (error) => {
                      console.error(error);
                      // Handle the error as needed
                    });
        }
      }

      check(){
        if(this.signUpForm.value.password !== this.signUpForm.value.password_confirmation){
          this.errorAlert = true;
        }
        else{
          this.errorAlert = false;
        }
      }

}
