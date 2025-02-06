import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Orders } from '../../../models/orders';
import { Products } from '../../../models/products';
import { SubCategory } from '../../../models/sub-category';
import { Roles, Status } from '../../tools/models';
import { CartService, OrdersService, ProductsService, SubCategoriesService } from '../../tools/services';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  currentCart: any = [];

  currentItem: any;

  order: Orders = {} as Orders;

  id = 0;

  cartItems: Products[] = [];

  products: Products[] = [];

  unfilteredProducts: Products[] = [];

  categories: SubCategory[] = [];

  user: any;

  role: any

  constructor(
    private router: Router,
    public cartService: CartService,
    private productService: ProductsService,
    private categoryService: SubCategoriesService,
    public actRoute: ActivatedRoute,
    private orderService: OrdersService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';
    console.log(this.user);
    console.log(sessionStorage);

    if (sessionStorage.length == 0 || this.role != Roles.BUYER) {
      this.router.navigate(['/login']);
    }
    console.log('cart', this.cartService.getCurrentCart());

    this.cartItems = this.cartService.getCurrentCart();

    this.categoryService.getAllList().subscribe((res) => {
      this.categories = res.data;
      console.log('categories:', this.categories);

      this.productService.getAllList().subscribe((res) => {
        this.unfilteredProducts = res.data.filter(
          (x) => x.sub_category_id == this.id
        );
        this.unfilteredProducts.forEach((product: any) => {
          product.image_url =
            'https://orezon.co.zw/storage/app/public/' + product.image_url;
          const category = this.categories.filter(
            (x) => x.id == product.sub_category_id
          );
          category.forEach((cat) => {
            product.sub_category_name = cat.name;
          });
        });
        this.products = this.unfilteredProducts;
        console.log('products:', this.products);
      });
    });

    this.id = this.actRoute.snapshot.params['id'];



    this.cartService.updateTotal.subscribe((resp) => {
      if (resp) {
        this.currentCart = this.cartService.getCurrentCart();
      }
    });
    this.currentCart = this.cartService.getCurrentCart();
  }

  updateCart(item: any) {
    this.cartService.success('product added')
    this.cartService.addToCart(item, item.price, 1);
    this.checkIfExist(item);
    this.checkIfExistPrice(item);
    this.getTotal();
    console.log('cart', this.cartService.getCurrentCart());
  }

  incrementCart(item: any) {
    this.cartService.success('product removed')
    console.log(this.checkIfExist(item));
    if ((this.checkIfExist(item)) == 1) {
      this.cartService.removeFromCart(item)
    } else {
      this.cartService.subtractFromCart(item, item.price, 1);
      this.checkIfExist(item);
      this.checkIfExistPrice(item);
      this.getTotal();
    }

    console.log('cart', this.cartService.getCurrentCart());
  }

  checkOut() {
    this.order.total_price = this.cartService.getTotal();
    this.order.status = Status.PEN;
    this.order.user_id = JSON.parse(
      sessionStorage.getItem('loggedUser') || '{}'
    );
    this.order.products = this.cartService.getCurrentCart();

    console.log('yes:', this.order);

    this.orderService.order(this.order).subscribe(
      (res) => {
        if (res.status == 'created') {
          this.cartService.success('Order placed successfully');
          this.ngOnInit();
        } else {
          console.error(Error);
        }
      },
    );
  }

  checkIfExist(item) {
    const index = this.currentCart?.findIndex((p) => p.id === item.id);
    if (index >= 0) {
      return this.currentCart[index].quantity;
    }
    return 0;
  }

  checkIfExistPrice(item) {
    const index = this.currentCart?.findIndex((p) => p.id === item.id);
    if (index >= 0) {
      return this.currentCart[index].amount;
    }
    return 0;
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  getTax() {
    return ((0.15) * this.cartService.getTotal());
  }

  getFinalTotal() {
    return this.getTotal() + this.getTax()
  }


  checkout() {
    this.router.navigate(['/checkout'])

  }
}
