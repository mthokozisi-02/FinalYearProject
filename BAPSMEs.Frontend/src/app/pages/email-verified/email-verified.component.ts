import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrl: './email-verified.component.css'
})
export class EmailVerifiedComponent {

  constructor(
    private router: Router
  ) { }

  redirect() {
    this.router.navigate(['/login']);
  }

}
