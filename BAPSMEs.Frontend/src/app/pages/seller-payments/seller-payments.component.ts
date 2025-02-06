import { Component } from '@angular/core';
import { Buyer } from '../../../models/buyer';
import { Payments } from '../../../models/payments';
import { Seller } from '../../../models/seller';
import { User } from '../../../models/user';
import { BuyerRegistrationService, PaymentService, SellerRegistrationService } from '../../tools/services';
@Component({
  selector: 'app-seller-payments',
  templateUrl: './seller-payments.component.html',
  styleUrl: './seller-payments.component.css'
})
export class SellerPaymentsComponent {

  payments: Payments[] = []

  filteredPayments: Payments[] = []

  user: User = {} as User;

  buyers: Buyer[] = [];

  sellers: Seller[] = []

  buyer_pic: any;

  constructor(private sellerService: SellerRegistrationService, private buyerService: BuyerRegistrationService, private paymentService: PaymentService) { }


  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;
      console.log('buyer:', res.data);
      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;
        console.log('sellers:', res.data);
        this.paymentService.getSellerPayments().subscribe((res) => {
          this.payments = res.data.filter(x => x.buyer_id != null).forEach((payment) => {
            // if (payment.buyer_id == null) {
            //   this.sellers
            //     .filter((x) => x.user_id == payment.subscription.user_package.user_id)
            //     .forEach((buyer) => {
            //       payment.buyer_pic =
            //         'assets/img/user.png';
            //       payment.buyer_name = buyer.user.name;
            //       payment.buyer_email = buyer.user.email;
            //     });
            // }
            // else {
            this.buyers
              .filter((x) => x.user_id == payment.buyer_id)
              .forEach((buyer) => {
                payment.buyer_pic =
                  'assets/img/user.png';
                payment.buyer_name = buyer.user.name;
                payment.buyer_email = buyer.user.email;
              });

          });
          this.filteredPayments = this.payments
          console.log('payments:', this.payments);
        });
      });
    });
  }

  searchPayments(item: any) {
    console.log(this.payments)
    this.filteredPayments = this.payments.filter(
      prod => prod?.buyer_name.toLowerCase().includes(item.toLowerCase())
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredPayments)
    //this.filteredProducts = this.products.filter(x => x.)
  }

}
