import { Component, OnInit } from '@angular/core';
import { Buyer } from '../../../models/buyer';
import { Payments } from '../../../models/payments';
import { Seller } from '../../../models/seller';
import { SubOrder } from '../../../models/sub-order';
import { User } from '../../../models/user';
import { SellerRegistrationService, PayoutsService, BuyerRegistrationService, OrdersService, PaymentService } from '../../tools/services';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent   implements  OnInit{
  orders: SubOrder[] = [];

  sellers: Seller[] = [];

  payments: Payments[] = [];

  filteredPayments: Payments[] = [];

  user: User = {} as User;

  buyers: Buyer[] = [];

  buyer_pic: any;

  viewPaymentModal = false;

  constructor(
    private sellerService: SellerRegistrationService,
    private payoutService: PayoutsService,
    private buyerService: BuyerRegistrationService,
    private orderService: OrdersService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';
    this.getPayOuts();

    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;
      console.log('buyer:', res.data);

      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;
        console.log('sellers:', res.data);

        this.orderService.getAllList().subscribe((res) => {
          this.orders = res.data;
          console.log('orders:', res.data);

          this.paymentService.getAllList().subscribe((res) => {
            this.payments = res.data;
            this.payments = this.payments.filter((x) => x.buyer_id != null);
            this.payments.forEach((payment) => {
              this.buyers
                .filter((x) => x.user_id == payment.buyer_id)
                .forEach((buyer) => {
                  console.log('entered', buyer);
                  payment.buyer_pic = 'assets/img/user.png';
                  payment.buyer_name = buyer.user.name;
                  payment.buyer_email = buyer.user.email;
                });
              this.orders
                .filter((x) => x.order_id == payment.order_id)
                .forEach((order) => {
                  this.sellers
                    .filter((x) => x.user_id == order.seller_id)
                    .forEach((user) => {
                      payment.seller_name = user.user.name;
                    });
                });
            });
            this.filteredPayments = this.payments;
            console.log('payments:', this.payments);
          });
        });
      });
    });

    this.orderService.getAllList().subscribe((res) => {
      this.orders = res.data;
      console.log('orders:', res.data);
    });
  }

  viewPayment(item: any) {
    this.viewPaymentModal = true;
  }

  searchPayments(item: any) {
    console.log(this.payments);
    this.filteredPayments = this.payments.filter((prod) =>
      prod?.buyer_name.toLowerCase().includes(item.toLowerCase())
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredPayments);
    //this.filteredProducts = this.products.filter(x => x.)
  }

  hideDialog() {
    this.viewPaymentModal = false;
  }


  getPayOuts() {
    this.payoutService.getAllSellerBalance().subscribe((res) => {
      this.payments = res.data;
      console.log('seller balance:', res.data);
    });
  }



}
