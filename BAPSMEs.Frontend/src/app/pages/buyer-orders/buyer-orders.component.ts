import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders } from '../../../models/orders';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { User } from '../../../models/user';
import { BuyerRegistrationService, OrdersService, SellerRegistrationService, SubCategoriesService } from '../../tools/services';
@Component({
  selector: 'app-buyer-orders',
  templateUrl: './buyer-orders.component.html',
  styleUrl: './buyer-orders.component.css',
  standalone: false
})
export class BuyerOrdersComponent {
  orders: Orders[] = [];

  filteredOrders: Orders[] = [];

  user: User = {} as User;

  sellers: Seller[] = [];

  buyer_pic: any;

  mainSection = true

  selectedOrder: Orders = {} as Orders;

  viewOrderModal = false;

  seller: Seller = {} as Seller;

  categories: SubCategory[] = [];

  subCategories: Observable<Array<SubCategory>>;

  subCategories_: SubCategory[] = [];

  constructor(
    private orderService: OrdersService,
    private sellerService: SellerRegistrationService,
    private buyerService: BuyerRegistrationService,
    private subCatgeorySevice: SubCategoriesService,
  ) { }

  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.subCategories_ = JSON.parse(localStorage.getItem('subCategories'));

    this.sellerService.getAllList().subscribe((res) => {
      this.sellers = res.data;

      this.orderService.getBuyerOrders().subscribe((res) => {
        this.orders = res.data;
        console.log('order', res.data)
        this.orders.forEach((order) => {
          order.total_quantity = 0;
          order.products = []

          order.sub_orders.forEach(sub => {
            sub.order_products.forEach(ord => {
              order.total_quantity += ord.quantity
              ord.product.seller_id = sub.seller.id
              ord.product.seller_name = sub.seller.name
              this.subCategories_.filter(x => x.id == ord.product.sub_category_id).forEach(cat => {
                ord.product.sub_category_name = cat.name
              })
              ord.product.quantity = ord.quantity
              ord.product.total_amount = sub.total_price
              ord.product.image_url = 'http://127.0.0.1:8000/storage/' + ord.product.image_url;

              order.products = [...order.products, ord.product];
            })
          })
        });
        this.filteredOrders = this.orders
        console.log('finalorders:', this.orders);
      });
    });

    this.buyerService.getAllList().subscribe((res) => {
      res.data
        .filter((x) => x.user_id == this.user.id)
        .forEach((buyer) => {
          this.buyer_pic =
            'assets/img/user.png';
        });
      console.log('buyer:', res.data);
    });



  }

  viewOrder(item: Orders) {
    console.log('item', item);
    this.viewOrderModal = true;
    this.mainSection = false
    this.selectedOrder = item;
  }

  searchOrders(item: any) {
    console.log(this.orders)
    this.filteredOrders = this.orders.filter(
      prod => prod?.id.toString().includes(item)
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredOrders)
    //this.filteredProducts = this.products.filter(x => x.)
  }

  hideDialog() {
    this.viewOrderModal = false;
    this.mainSection = true
  }
}
