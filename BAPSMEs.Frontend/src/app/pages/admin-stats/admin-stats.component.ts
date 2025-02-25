import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from '../../../models/booking';
import { Buyer } from '../../../models/buyer';
import { Enquire } from '../../../models/enquire';
import { Orders } from '../../../models/orders';
import { Package } from '../../../models/package';
import { Payments } from '../../../models/payments';
import { Seller } from '../../../models/seller';
import { SubOrder } from '../../../models/sub-order';
import { BuyerRegistrationService, OrdersService, PackagesService, PaymentService, SellerRegistrationService } from '../../tools/services';
import { BookService } from '../../tools/services/book.service';
import { EnquiryService } from '../../tools/services/enquiry.service';

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

  queriesPercentageDiff: any

  bookingsPercentageDiff: any

  totalUsers = 0

  thisMonthQueries = 0

  lastMonthQueries = 0

  usersPercentageDiff: any

  thisMonthClients = 0

  lastMonthClients = 0

  clientsPercentageDiff: any

  thisMonthPayments = 0

  totalOrders = 0;

  subOrders: SubOrder[] = [];

  filteredBookings: Booking[] = [];

  lastMonthPayments = 0

  paymentsPercentageDiff: any

  orders: Orders[] = [];

  payments: Payments[] = []

  buyers: Buyer[] = [];

  enquiries: Enquire[] = [];

  sellers: Seller[] = [];

  bookings: Booking[] = [];

  constructor(
    private packageService: PackagesService,
    private orderService: OrdersService,
    private buyerService: BuyerRegistrationService,
    private sellerService: SellerRegistrationService,
    private paymentService: PaymentService,
    private router: Router,
    private enquiryService: EnquiryService,
    private bookingService: BookService
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

      this.bookingService.getAllList().subscribe((res) => {
        this.bookings = res.data;

        this.bookings.forEach(book => {
          book.buyer_pic = 'assets/img/user.png';
          book.buyer_email = book.user.email
          book.buyer_name = book.user.name
        })

        console.log('orders:', this.subOrders)

        // Calculate total orders for last month and this month
        this.lastMonthOrders = this.bookings.filter(book => {
          const orderDate = new Date(book.created_at);
          return orderDate.getFullYear() === new Date().getFullYear() &&
            orderDate.getMonth() === new Date().getMonth() - 1;
        }).reduce((sum, book) => sum + Number(book.total_price), 0);

        this.thisMonthOrders = this.bookings.filter(book => {
          const orderDate = new Date(book.created_at);
          return orderDate.getFullYear() === new Date().getFullYear() &&
            orderDate.getMonth() === new Date().getMonth();
        }).reduce((sum, book) => sum + Number(book.total_price), 0);

        this.filteredBookings = this.bookings.filter(book => {
          const orderDate = new Date(book.created_at);
          return orderDate.getFullYear() === new Date().getFullYear() &&
            orderDate.getMonth() === new Date().getMonth();
        })

        // const uniqueOrderIds = new Set(this.filteredsubOrders.map(order => order.order_id));
        // this.totalOrders = uniqueOrderIds.size;


        // Calculate percentage difference
        if (this.lastMonthOrders == 0 && this.thisMonthOrders == 0) {
          this.bookingsPercentageDiff = 0
        }
        else if (this.lastMonthOrders == 0 && this.thisMonthOrders >= 0) {
          this.bookingsPercentageDiff = 100
        }
        else {
          this.bookingsPercentageDiff = (((this.thisMonthOrders - this.lastMonthOrders) / (this.lastMonthOrders) * 100)).toFixed(2)
        }
        console.log('bookings:', this.bookings, ':', this.thisMonthOrders, ':', this.lastMonthOrders, ':', this.bookingsPercentageDiff);
      });
    });

    this.enquiryService.getAllList().subscribe((res) => {
      this.enquiries = res.data;

      this.lastMonthQueries += this.enquiries.filter(enquiry => {
        const userDate = new Date(enquiry.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthQueries += this.enquiries.filter(enquiry => {
        const userDate = new Date(enquiry.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth();
      }).length;

      console.log('enquiries:', this.enquiries);

      // Calculate percentage difference
      if (this.lastMonthQueries == 0 && this.thisMonthQueries == 0) {
        this.queriesPercentageDiff = 0
      }
      else if (this.lastMonthQueries == 0 && this.thisMonthQueries >= 0) {
        this.queriesPercentageDiff = 100
      }
      else {
        this.queriesPercentageDiff = (((this.thisMonthQueries - this.lastMonthQueries) / (this.lastMonthQueries) * 100)).toFixed(2)
      }
      console.log('all:', this.thisMonthQueries, this.lastMonthQueries, this.queriesPercentageDiff);
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
