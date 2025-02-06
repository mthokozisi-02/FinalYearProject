import { Component } from '@angular/core';
import { Buyer } from '../../../models/buyer';
import { Seller } from '../../../models/seller';
import { Roles } from '../../tools/models';
import { BuyerRegistrationService, SellerRegistrationService } from '../../tools/services';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  buyers: Buyer[] = [];

  sellers: Seller[] = [];

  roles: any[] = [];

  showBuyers = false;

  showSellers = false;

  showAdmins = false;

  constructor(
    private buyerService: BuyerRegistrationService,
    private sellerService: SellerRegistrationService
  ) { }

  ngOnInit() {
    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;
      this.buyers.forEach((buyer) => {
        buyer.profile_pic = 'assets/img/user.png';
      });
      console.log('buyers:', this.buyers);

      this.roles = Object.values(Roles);
    });

    this.sellerService.getAllList().subscribe((res) => {
      this.sellers = res.data;
      console.log('sellers:', this.sellers);
    });

    this.showBuyers = true
  }

  viewProfile(item: any) { }

  onSelection(item: any) {
    const selectedRole = (item.target as HTMLSelectElement).value;

    if (selectedRole == Roles.BUYER) {
      this.showBuyers = true;
      this.showSellers = false;
    } else if (selectedRole == Roles.SELLER) {
      this.showBuyers = false;
      this.showSellers = true;
    } else if (selectedRole == Roles.ADMIN) {
      this.showBuyers = false;
      this.showSellers = false;
    }
  }
}
