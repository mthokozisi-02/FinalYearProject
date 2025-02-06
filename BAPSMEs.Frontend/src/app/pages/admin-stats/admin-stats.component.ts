import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Buyer } from '../../../models/buyer';
import { Orders } from '../../../models/orders';
import { Package } from '../../../models/package';
import { Payments } from '../../../models/payments';
import { Seller } from '../../../models/seller';
import { SubOrder } from '../../../models/sub-order';
import { BuyerRegistrationService, OrdersService, PackagesService, PaymentService, SellerRegistrationService } from '../../tools/services';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrl: './admin-stats.component.css'
})
export class AdminStatsComponent {
  dashboard = false;
  profile = false;
  orderstab = false;
  showPayments = false;
  showPackages = false;
  payout = false;
  users = false;

  drawer = false;

  packages: Package[] = [];

  showProductCategories = false;

  role: any;

  thisMonthOrders = 0

  amountOfThisMonthOrders = 0

  lastMonthOrders = 0

  ordersPercentageDiff: any

  totalUsers = 0

  thisMonthUsers = 0

  lastMonthUsers = 0

  usersPercentageDiff: any

  thisMonthClients = 0

  lastMonthClients = 0

  clientsPercentageDiff: any

  thisMonthPayments = 0

  totalOrders = 0;

  subOrders: SubOrder[] = [];

  filteredsubOrders: SubOrder[] = [];

  lastMonthPayments = 0

  paymentsPercentageDiff: any

  orders: Orders[] = [];

  payments: Payments[] = []

  buyers: Buyer[] = [];

  sellers: Seller[] = [];

  constructor(
    private packageService: PackagesService,
    private orderService: OrdersService,
    private buyerService: BuyerRegistrationService,
    private sellerService: SellerRegistrationService,
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';

    // if (sessionStorage.length == 0 || this.role != Roles.ADMIN) {
    //   this.router.navigate(['/login']);
    // }

    this.packageService.getAllList().subscribe((res) => {
      this.packages = res.data;
      console.log('packages:', res.data);
    });


    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;

      this.orderService.getAllList().subscribe((res) => {
        this.subOrders = res.data;

        this.subOrders.forEach(order => {
          order.buyer_pic = 'assets/img/user.png';
          this.buyers.filter(x => x.user_id == order.buyer_id).forEach(buyer => {
            order.buyer_email = buyer.user.email
            order.buyer_name = buyer.user.name
          })
          order.total_quantity = order.products.reduce((sum, order) => sum + order.quantity, 0);
        })

        console.log('orders:', this.subOrders)

        // Calculate total orders for last month and this month
        this.lastMonthOrders = this.subOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getFullYear() === new Date().getFullYear() &&
            orderDate.getMonth() === new Date().getMonth() - 1;
        }).reduce((sum, order) => sum + Number(order.total_price), 0);

        this.thisMonthOrders = this.subOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getFullYear() === new Date().getFullYear() &&
            orderDate.getMonth() === new Date().getMonth();
        }).reduce((sum, order) => sum + Number(order.total_price), 0);

        this.filteredsubOrders = this.subOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getFullYear() === new Date().getFullYear() &&
            orderDate.getMonth() === new Date().getMonth();
        })

        const uniqueOrderIds = new Set(this.filteredsubOrders.map(order => order.order_id));
        this.totalOrders = uniqueOrderIds.size;


        // Calculate percentage difference
        this.ordersPercentageDiff = ((this.thisMonthOrders - this.lastMonthOrders) / this.lastMonthOrders * 100)
        if (this.ordersPercentageDiff == Infinity) {
          this.ordersPercentageDiff = 100
        } else if (!(this.ordersPercentageDiff >= 0)) {
          this.paymentsPercentageDiff = 0
        }
        console.log('orders:', this.orders, ':', this.thisMonthOrders, ':', this.lastMonthOrders, ':', this.ordersPercentageDiff);
      });

      this.lastMonthUsers += this.buyers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthUsers += this.buyers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth();
      }).length;

      console.log('buyers:', this.buyers);
    });

    this.sellerService.getAllList().subscribe((res) => {
      this.sellers = res.data;

      this.lastMonthUsers += this.sellers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthUsers += this.sellers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth();
      }).length;

      console.log('sellers:', this.sellers);

      // Calculate percentage difference
      this.usersPercentageDiff = ((this.thisMonthUsers - this.lastMonthUsers) / this.lastMonthUsers * 100).toFixed(2)
      if (this.usersPercentageDiff == Infinity) {
        this.usersPercentageDiff = 100
      }
      console.log('all:', this.lastMonthUsers, this.thisMonthUsers, this.usersPercentageDiff);
    });

    this.sellerService.getAllList().subscribe((res) => {
      this.sellers = res.data;

      this.lastMonthClients = this.sellers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthClients = this.sellers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth();
      }).length;


      // Calculate percentage difference
      this.clientsPercentageDiff = ((this.thisMonthClients - this.lastMonthClients) / this.lastMonthClients * 100).toFixed(2)
      if (this.clientsPercentageDiff == Infinity) {
        this.clientsPercentageDiff = 100
      }
      console.log('all:', this.lastMonthClients, this.thisMonthClients, this.clientsPercentageDiff);
    });

    this.paymentService.getAllList().subscribe((res) => {
      this.payments = res.data;
      console.log('payments', this.payments)

      this.lastMonthPayments = this.payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getFullYear() === new Date().getFullYear() &&
          paymentDate.getMonth() === new Date().getMonth() - 1;
      }).reduce((sum, payment) => sum + Number(payment.amount), 0);

      this.thisMonthPayments = this.payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getFullYear() === new Date().getFullYear() &&
          paymentDate.getMonth() === new Date().getMonth();
      }).reduce((sum, payment) => sum + Number(payment.amount), 0);


      // Calculate percentage difference
      this.paymentsPercentageDiff = ((this.thisMonthPayments - this.lastMonthPayments) / this.lastMonthPayments * 100).toFixed(2)
      if (this.paymentsPercentageDiff == Infinity) {
        this.paymentsPercentageDiff = 100
      } else if (!(this.paymentsPercentageDiff >= 0)) {
        this.paymentsPercentageDiff = 0
      }
      console.log('payment:', this.lastMonthPayments, this.thisMonthPayments, this.paymentsPercentageDiff);
    });

    this.dashboard = true;
  }

  showDrawer() {
    this.drawer = true;
  }

  hideDialog() {
    this.drawer = false;
  }


}
