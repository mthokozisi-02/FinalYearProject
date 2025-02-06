import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Orders } from '../../../models/orders';
import { Roles } from '../../tools/models';
import { OrdersService } from '../../tools/services';

@Component({
  selector: 'app-buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrl: './buyer-dashboard.component.css',
})
export class BuyerDashboardComponent {
  profile = false;
  orderstab = false;
  payments = false;

  drawer = false;

  role: any;

  orders: Orders[] = [];

  constructor(private orderService: OrdersService, private router: Router) { }

  ngOnInit(): void {
    this.profile = true;

    this.role = sessionStorage.getItem('loggedUserRole') || '{}';

    if (sessionStorage.length == 0 || this.role != Roles.BUYER) {
      console.log('what');
      this.router.navigate(['/login']);
    }
  }

  showDrawer() {
    console.log('enetered');
    this.drawer = true;
  }

  hideDialog() {
    this.drawer = false;
  }

}
