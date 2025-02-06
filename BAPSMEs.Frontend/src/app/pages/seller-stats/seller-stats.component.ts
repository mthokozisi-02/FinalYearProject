import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Buyer } from '../../../models/buyer';
import { Package } from '../../../models/package';
import { Payments } from '../../../models/payments';
import { ProductCategory } from '../../../models/product-category';
import { Products } from '../../../models/products';
import { Seller } from '../../../models/seller';
import { SubOrder } from '../../../models/sub-order';
import { User } from '../../../models/user';
import { Roles } from '../../tools/models';
import { BuyerRegistrationService, OrdersService, PackagesService, PaymentService, ProductsService, SellerRegistrationService, SubCategoriesService } from '../../tools/services';

@Component({
  selector: 'app-seller-stats',
  templateUrl: './seller-stats.component.html',
  styleUrl: './seller-stats.component.css'
})
export class SellerStatsComponent {

  subOrders: SubOrder[] = [];

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

  role: any;

  countries: any[] = [];

  public sellerForm: FormGroup;

  public bankForm: FormGroup;

  thisMonthClients = 0

  lastMonthClients = 0

  clientsPercentageDiff: any

  payments: Payments[] = []

  products: Products[] = []

  thisMonthOrders = 0

  lastMonthOrders = 0

  ordersPercentageDiff: any

  totalProducts = 0;

  totalOrders = 0;

  constructor(
    private packageService: PackagesService,
    private router: Router,
    private paymentService: PaymentService,
    private orderService: OrdersService,
    private sellerService: SellerRegistrationService,
    private buyerService: BuyerRegistrationService,
    private categoryService: SubCategoriesService,
    private productService: ProductsService
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


    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;

      this.orderService.getSellerOrders().subscribe((res) => {
        this.subOrders = res.data;

        console.log('orders:', this.subOrders)
        this.subOrders.forEach((order) => {
          order.total_quantity = 0;
          this.buyers
            .filter((x) => x.user_id == order.buyer_id)
            .forEach((buyer) => {
              console.log('entered', buyer);
              order.buyer_pic =
                'assets/img/user.png';
              order.buyer_name = buyer.user.name;
              order.buyer_email = buyer.user.email;
            });
          order.products.forEach((prod: any) => {
            prod.image_url =
              'https://orezon.co.zw/storage/app/public/' + prod.image_url;
            const category = this.categories.filter(
              (x) => x.id == prod.sub_category_id
            );
            category.forEach((cat) => {
              prod.sub_category_name = cat.name;
            });
            this.sellers
              .filter((x) => x.user_id == order.seller_id)
              .forEach((seller) => {
                prod.business_name = seller.business_name;
              });
            order.total_quantity += prod.pivot.quantity;
          });
        });
        this.totalOrders = this.subOrders.length

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

        // Calculate percentage difference
        this.ordersPercentageDiff = ((this.thisMonthOrders - this.lastMonthOrders) / this.lastMonthOrders * 100).toFixed(2)
        if (this.ordersPercentageDiff == Infinity) {
          this.ordersPercentageDiff = 100
        } else if (!(this.ordersPercentageDiff >= 0)) {
          this.ordersPercentageDiff = 0
        }
        console.log('orders:', this.subOrders, this.thisMonthOrders, this.lastMonthOrders, this.ordersPercentageDiff);
      });

      this.lastMonthClients = this.buyers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthClients = this.buyers.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth();
      }).length;


      // Calculate percentage difference
      this.clientsPercentageDiff = ((this.thisMonthClients - this.lastMonthClients) / this.lastMonthClients * 100).toFixed(2)
      if (this.clientsPercentageDiff == Infinity) {
        this.clientsPercentageDiff = 100
      } else if (!(this.clientsPercentageDiff >= 0)) {
        this.ordersPercentageDiff = 0
      }
      console.log('all:', this.lastMonthClients, this.thisMonthClients, this.clientsPercentageDiff);
    });


    this.paymentService.getSellerPayments().subscribe((res) => {
      this.payments = res.data;
      this.payments = this.payments.filter(x => x.buyer_id != null)

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
      this.paymentsPercentageDiff = ((this.thisMonthPayments - this.lastMonthPayments) / this.lastMonthPayments * 100).toFixed(2)
      if (this.paymentsPercentageDiff == Infinity) {
        this.paymentsPercentageDiff = 100
      } else if (!(this.clientsPercentageDiff >= 0)) {
        this.paymentsPercentageDiff = 0
      }
      console.log('payment:', this.lastMonthPayments, this.thisMonthPayments, this.paymentsPercentageDiff);
    });



    this.categoryService.getAllList().subscribe((res) => {
      this.categories = res.data;
      console.log('categories:', this.categories);
    });


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

  update() { }

}
