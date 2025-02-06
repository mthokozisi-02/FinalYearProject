import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-error',
  templateUrl: './verification-error.component.html',
  styleUrl: './verification-error.component.css'
})
export class VerificationErrorComponent {

  constructor(
    private router: Router
  ) { }

  redirect() {
    this.router.navigate(['/']);
  }

}
