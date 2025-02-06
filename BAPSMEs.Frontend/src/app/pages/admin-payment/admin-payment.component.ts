import { Component } from '@angular/core';
import { Buyer } from '../../../models/buyer';
import { Payments } from '../../../models/payments';
import { Seller } from '../../../models/seller';
import { User } from '../../../models/user';
import { BuyerRegistrationService, PaymentService, SellerRegistrationService } from '../../tools/services';

@Component({
  selector: 'app-admin-payment',
  templateUrl: './admin-payment.component.html',
  styleUrl: './admin-payment.component.css'
})
export class AdminPaymentComponent {

  payments: Payments[] = []

  packagesPayments: Payments[] = []

  orderPayments: Payments[] = []

  filteredPackagesPayments: Payments[] = []

  filteredOrderPayments: Payments[] = []

  user: User = {} as User;

  buyers: Buyer[] = [];

  sellers: Seller[] = [];

  buyer_pic: any;

  packagesTab = false

  ordersTab = false

  constructor(private buyerService: BuyerRegistrationService, private sellerService: SellerRegistrationService, private paymentService: PaymentService) { }


  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.packagesTab = true

    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;
      console.log('buyers:', res.data);

      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;
        console.log('sellers:', res.data);

        this.paymentService.getAllList().subscribe((res) => {
          this.payments = res.data;
          console.log('payments:', this.payments);
          this.packagesPayments = this.payments.filter(x => x.buyer_id == null)
          this.orderPayments = this.payments.filter(x => x.buyer_id != null)

          this.packagesPayments.forEach(pay => {
            this.sellers
              .filter((x) => x.user_id == pay.subscription.user_package.user_id)
              .forEach((seller) => {
                pay.buyer_name = seller.user.name;
                pay.buyer_email = seller.user.name
              });
          })

          this.orderPayments.forEach(pay => {
            pay.buyer_name = pay.buyer.name
            pay.buyer_email = pay.buyer.email
          })
          this.filteredOrderPayments = this.orderPayments
          this.filteredPackagesPayments = this.packagesPayments
          console.log('payments:', this.filteredOrderPayments, this.filteredPackagesPayments);
        });
      });
    });



  }

  searchPackagesPayments(item: any) {
    this.filteredPackagesPayments = this.packagesPayments.filter(
      prod => prod?.buyer_name.toLowerCase().includes(item.toLowerCase())
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredPackagesPayments)
    //this.filteredProducts = this.products.filter(x => x.)
  }

  searchOrderPayments(item: any) {
    this.filteredOrderPayments = this.orderPayments.filter(
      prod => prod?.buyer_name.toLowerCase().includes(item.toLowerCase())
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredOrderPayments)
    //this.filteredProducts = this.products.filter(x => x.)
  }

  showPackages() {
    this.packagesTab = true
    this.ordersTab = false
  }

  showOrders() {
    this.packagesTab = false
    this.ordersTab = true
  }

}
