import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from '../../tools/models';
import { SellerCartService } from '../../tools/services';

@Component({
  selector: 'app-dashboard-nav-bar',
  templateUrl: './dashboard-nav-bar.component.html',
  styleUrl: './dashboard-nav-bar.component.css'
})
export class DashboardNavBarComponent {

  user: any;
  totalSupplierCart: any = 0;
  totalSupplierAmount: any = 0;
  currentSupplierCart: any = [];

  dashboard = false
  logIn = false
  logOut = false
  home = false

  role: any

  constructor(private router: Router, private sellerCartService: SellerCartService) { }

  ngOnInit(): void {
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';

    this.getCartInformation();
    if (sessionStorage.length === 0) {
      this.logIn = true;
    }
    else {
      this.logOut = true
      this.home = true
      this.logIn = false
      this.dashboard = true
    }
  }


  getCartInformation() {

    this.sellerCartService.updateTotal.subscribe((res) => {
      if (res) {

        this.currentSupplierCart = this.sellerCartService.getCurrentCart();
        this.totalSupplierCart = this.sellerCartService.getTotaltems();
        this.totalSupplierAmount = this.sellerCartService.getTotal();
      }
    })


    this.currentSupplierCart = this.sellerCartService.getCurrentCart();
    this.totalSupplierCart = this.sellerCartService.getTotaltems();
    this.totalSupplierAmount = this.sellerCartService.getTotal();

  }

  removeItem(item) {
    //
  }

  openDashboard() {
    if (this.role == Roles.ADMIN) {
      this.router.navigate(['/admin-dashboard']);
    } else if (this.role == Roles.BUYER) {
      this.router.navigate(['/buyer-dashboard']);
    } else if (this.role == Roles.SELLER) {
      this.router.navigate(['/dashboard']);
    }
  }


}
