import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Booking } from '../../../models/booking';
import { Buyer } from '../../../models/buyer';
import { Enquire } from '../../../models/enquire';
import { Package } from '../../../models/package';
import { Payments } from '../../../models/payments';
import { ProductCategory } from '../../../models/product-category';
import { Products } from '../../../models/products';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { SubOrder } from '../../../models/sub-order';
import { User } from '../../../models/user';
import { Roles } from '../../tools/models';
import { BuyerRegistrationService, OrdersService, PackagesService, PaymentService, ProductsService, SellerRegistrationService, SubCategoriesService } from '../../tools/services';
import { BookService } from '../../tools/services/book.service';
import { EnquiryService } from '../../tools/services/enquiry.service';

@Component({
  selector: 'app-seller-stats',
  templateUrl: './seller-stats.component.html',
  styleUrl: './seller-stats.component.css'
})
export class SellerStatsComponent {

  subOrders: SubOrder[] = [];

  selectedEnquiry: Enquire = {} as Enquire;

  viewEnquiry = false;

  user: User = {} as User;

  sellers: Seller[] = [];

  buyers: Buyer[] = [];

  buyer_pic: any;

  selectedOrder: SubOrder = {} as SubOrder;

  viewOrderModal = false;

  seller: Seller = {} as Seller;

  categories: ProductCategory[] = [];

  packages: Package[] = [];

  show = false;

  drawer = false;

  dashboard = false;
  profile = false;
  orders = false;
  showProducts = false;
  payment = false;

  thisMonthPayments = 0

  lastMonthPayments = 0

  paymentsPercentageDiff: any

  thisMonthBookings = 0

  lastMonthBookings = 0

  bookingsPercentageDiff: any

  thisMonthOrders = 0

  lastMonthOrders = 0

  ordersPercentageDiff: any

  role: any;

  countries: any[] = [];

  public sellerForm: FormGroup;

  public bankForm: FormGroup;

  thisMonthClients = 0

  lastMonthClients = 0

  clientsPercentageDiff: any

  thisMonthEnquiries = 0

  lastMonthEnquiries = 0

  enquiriesPercentageDiff: any

  payments: Payments[] = []

  products: Products[] = []

  enquiries: Enquire[] = []

  bookings: Booking[] = []

  totalProducts = 0;

  totalOrders = 0;

  subCategories: Observable<Array<SubCategory>>;

  subCategories_: SubCategory[] = [];

  constructor(
    private packageService: PackagesService,
    private router: Router,
    private paymentService: PaymentService,
    private enquiryService: EnquiryService,
    private sellerService: SellerRegistrationService,
    private buyerService: BuyerRegistrationService,
    private subCatgeorySevice: SubCategoriesService,
    private productService: ProductsService,
    private orderService: OrdersService,
    private boookingService: BookService
  ) {
    this.sellerForm = new FormGroup({
      business_name: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      id_number: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password_confirmation: new FormControl('', [Validators.required]),
    });
    this.bankForm = new FormGroup({
      bank: new FormControl('', [Validators.required]),
      account_number: new FormControl('', [Validators.required]),
      branch: new FormControl('', [Validators.required]),
      branch_code: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dashboard = true;
    this.drawer = true

    this.role = sessionStorage.getItem('loggedUserRole') || '{}';
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    if (sessionStorage.length == 0 || this.role != Roles.SELLER) {
      this.router.navigate(['/login']);
    }

    this.packageService.getAllList().subscribe((res) => {
      this.packages = res.data;
      console.log('packages:', res.data);
    });

    this.productService.getSellerProducts(this.user.id).subscribe((res) => {
      this.products = res.data;
      this.totalProducts = this.products.length
      console.log('products:', res.data);
    });

    this.enquiryService.getSellerEnquiries().subscribe((res) => {
      res.data.forEach((enquiry) => {
        enquiry.buyer_pic =
          'assets/img/user.png';
        enquiry.buyer_name = enquiry.user.name;
        enquiry.buyer_email = enquiry.user.email;
        enquiry.sub_category_name = enquiry.sub_category.name
        enquiry.product_name = enquiry.product.name
      });
      this.enquiries = res.data
      console.log('enquiries:', this.enquiries);

      this.lastMonthEnquiries = this.enquiries.filter(enquiry => {
        const userDate = new Date(enquiry.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthEnquiries = this.enquiries.filter(enquiry => {
        const userDate = new Date(enquiry.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth();
      }).length;


      // Calculate percentage difference
      if (this.lastMonthEnquiries == 0 && this.thisMonthEnquiries == 0) {
        this.enquiriesPercentageDiff = 0
      }
      else if (this.lastMonthEnquiries == 0 && this.thisMonthEnquiries >= 0) {
        this.enquiriesPercentageDiff = 100
      }
      else {
        this.paymentsPercentageDiff = (((this.thisMonthEnquiries - this.lastMonthEnquiries) / (this.lastMonthEnquiries) * 100)).toFixed(2)
      }
      console.log('enquries:', this.lastMonthEnquiries, this.thisMonthEnquiries, this.enquiriesPercentageDiff);


    });


    this.boookingService.getSellerBookings().subscribe((res) => {
      this.bookings = res.data;
      console.log('bookings:', res.data);

      this.lastMonthBookings = this.bookings.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getFullYear() === new Date().getFullYear() &&
          bookingDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthBookings = this.bookings.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getFullYear() === new Date().getFullYear() &&
          bookingDate.getMonth() === new Date().getMonth();
      }).length;


      // Calculate percentage difference
      if (this.lastMonthBookings == 0 && this.thisMonthBookings == 0) {
        this.bookingsPercentageDiff = 0
      }
      else if (this.lastMonthBookings == 0 && this.thisMonthBookings >= 0) {
        this.bookingsPercentageDiff = 100
      }
      else {
        this.bookingsPercentageDiff = (((this.thisMonthBookings - this.lastMonthBookings) / (this.lastMonthBookings) * 100)).toFixed(2)
      }

      console.log('bookings:', this.lastMonthBookings, this.thisMonthBookings, this.bookingsPercentageDiff);
    });


    this.paymentService.getSellerPayments().subscribe((res) => {
      this.payments = res.data;
      this.payments = this.payments.filter(payment => payment.buyer_id != null)

      this.lastMonthPayments = this.payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getFullYear() === new Date().getFullYear() &&
          paymentDate.getMonth() === new Date().getMonth() - 1;
      }).reduce((sum, order) => sum + Number(order.amount), 0);

      this.thisMonthPayments = this.payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getFullYear() === new Date().getFullYear() &&
          paymentDate.getMonth() === new Date().getMonth();
      }).reduce((sum, order) => sum + Number(order.amount), 0);


      // Calculate percentage difference
      if (this.lastMonthPayments == 0 && this.thisMonthPayments == 0) {
        this.paymentsPercentageDiff = 0
      }
      else if (this.lastMonthPayments == 0 && this.thisMonthPayments >= 0) {
        this.paymentsPercentageDiff = 100
      }
      else {
        this.paymentsPercentageDiff = (((this.thisMonthPayments - this.lastMonthPayments) / (this.lastMonthPayments) * 100)).toFixed(2)
      }
      console.log('payment:', this.lastMonthPayments, this.thisMonthPayments, this.paymentsPercentageDiff);
    });

    this.orderService.getSellerOrders().subscribe((res) => {
      this.subOrders = res.data;
      console.log('orders:', res.data);

      this.lastMonthOrders = this.subOrders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getFullYear() === new Date().getFullYear() &&
          orderDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.lastMonthOrders = this.subOrders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getFullYear() === new Date().getFullYear() &&
          orderDate.getMonth() === new Date().getMonth();
      }).length;


      // Calculate percentage difference
      if (this.lastMonthOrders == 0 && this.thisMonthOrders == 0) {
        this.ordersPercentageDiff = 0
      }
      else if (this.lastMonthOrders == 0 && this.thisMonthOrders >= 0) {
        this.ordersPercentageDiff = 100
      }
      else {
        this.paymentsPercentageDiff = (((this.thisMonthOrders - this.lastMonthOrders) / (this.lastMonthOrders) * 100)).toFixed(2)
      }
      console.log('orders:', this.lastMonthOrders, this.thisMonthOrders, this.ordersPercentageDiff);
    });

    this.subCategories_ = JSON.parse(sessionStorage.getItem('subCategories'));

    this.sellerService.getAllList().subscribe((res) => {
      this.sellers = res.data;
      console.log('sellers:', res.data);
    });
  }

  showDrawer() {
    console.log('entered')
    this.drawer = true;
  }

  viewOrder(item: SubOrder) {
    console.log('item', item);
    this.viewOrderModal = true;
    this.selectedOrder = item;
  }


  hideDialog() {
    this.drawer = false;
    this.viewOrderModal = false;
    this.viewEnquiry = false
  }

  showDashboard() {
    this.dashboard = true;
    this.showProducts = false;
    this.profile = false;
    this.orders = false;
    this.payment = false;
  }

  showProducts_() {
    this.dashboard = false;
    this.showProducts = true;
    this.profile = false;
    this.orders = false;
    this.payment = false;
  }

  showProfile() {
    this.dashboard = false;
    this.showProducts = false;
    this.profile = true;
    this.orders = false;
    this.payment = false;
  }

  showOrders() {
    this.dashboard = false;
    this.showProducts = false;
    this.profile = false;
    this.orders = true;
    this.payment = false;
  }

  showPayment() {
    this.dashboard = false;
    this.showProducts = false;
    this.profile = false;
    this.orders = false;
    this.payment = true;
  }

  view(item: any) {
    this.selectedEnquiry = item
    this.viewEnquiry = true
  }

  Received(item: any) {
    this.enquiryService
      .updateStatus(item.id)
      .subscribe(
        (res) => {
          console.log('res', res);

          if (res.status == 'success') {
            this.enquiryService.success('Enquiry updated successfully');
            this.ngOnInit();
          } else {
            console.error(Error);
          }
        }
      );
  }

  splitDescription(description: string, wordsPerLine: number): string[] {
    if (!description) return [];

    const words = description.split(' '); // Split into words
    const lines = [];
    console.log(words)

    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    console.log(lines)

    return lines;
  }

  update() { }

}
