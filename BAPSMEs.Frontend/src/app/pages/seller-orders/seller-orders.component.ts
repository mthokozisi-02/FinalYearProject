import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Buyer } from '../../../models/buyer';
import { ProductCategory } from '../../../models/product-category';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { SubOrder } from '../../../models/sub-order';
import { User } from '../../../models/user';
import { BuyerRegistrationService, OrdersService, SellerRegistrationService, SubCategoriesService } from '../../tools/services';
@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.css',
  standalone: false
})
export class SellerOrdersComponent {
  orders: SubOrder[] = [];

  filteredOrders: SubOrder[] = [];

  user: User = {} as User;

  sellers: Seller[] = [];

  buyers: Buyer[] = [];

  buyer_pic: any;

  selectedOrder: SubOrder = {} as SubOrder;

  viewOrderModal = false;

  seller: Seller = {} as Seller;

  mainSection = true

  categories: ProductCategory[] = [];

  subCategories: Observable<Array<SubCategory>>;

  subCategories_: SubCategory[] = [];

  constructor(
    private orderService: OrdersService,
    private sellerService: SellerRegistrationService,
    private buyerService: BuyerRegistrationService,
    private subCatgeorySevice: SubCategoriesService
  ) { }

  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.subCategories_ = JSON.parse(localStorage.getItem('subCategories'));

    this.orderService.getSellerOrders().subscribe((res) => {
      this.orders = res.data;
      console.log('ordersss:', res.data)
      this.orders.forEach((order) => {
        order.total_quantity = 0;
        this.buyerService.getAllList().subscribe((res) => {
          this.buyers = res.data
          this.buyers
            .filter((x) => x.user_id == order.buyer_id)
            .forEach((buyer) => {
              console.log('entered', buyer);
              order.buyer_pic =
                'assets/img/user.png';
              order.buyer_name = buyer.user.name;
              order.buyer_email = buyer.user.email;
              console.log('orderrrr:', this.orders)
            });
        });
        order.products.forEach((prod: any) => {
          prod.image_url =
            'http://127.0.0.1:8000/storage/' + prod.image_url;
          const category = this.subCategories_.filter(
            (x) => x.id == prod.sub_category_id
          );
          category.forEach((cat) => {
            prod.sub_category_name = cat.name;
          });
          this.sellerService.getAllList().subscribe((res) => {
            this.sellers = res.data
            this.sellers
              .filter((x) => x.user_id == order.seller_id)
              .forEach((seller) => {
                prod.business_name = seller.business_name;
              });
          });
          order.total_quantity += prod.pivot.quantity;
        });
      });
      this.filteredOrders = this.orders
      console.log('orders:', this.orders);
    });


  }

  viewOrder(item: SubOrder) {
    console.log('item', item);
    this.viewOrderModal = true;
    this.mainSection = false
    this.selectedOrder = item;
  }

  searchOrders(item: any) {
    console.log(this.orders)
    this.filteredOrders = this.orders.filter(
      prod => prod?.order_id.toString().includes(item)
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
