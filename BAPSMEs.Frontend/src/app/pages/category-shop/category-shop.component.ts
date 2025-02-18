import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Orders } from '../../../models/orders';
import { ProductCategory } from '../../../models/product-category';
import { Products } from '../../../models/products';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { CartService, ProductsService, SellerRegistrationService, SubCategoriesService, WishListService } from '../../tools/services';
@Component({
  selector: 'app-category-shop',
  standalone: false,
  templateUrl: './category-shop.component.html',
  styleUrl: './category-shop.component.css',
})
export class CategoryShopComponent implements OnInit {
  currentCart: any = [];

  currentWishlist: any = [];

  currentItem: any;

  order: Orders = {} as Orders;

  id = 0;

  products: Products[] = [];

  unfilteredProducts: Products[] = [];

  categories: ProductCategory[] = [];

  subCategories: SubCategory[] = [];

  wishlist = [];

  user: any;

  selectedProduct: Products = {} as Products;

  role: any

  sellers: Seller[] = []

  viewProduct = false

  image: any

  constructor(
    public cartService: CartService,
    private wishlistServie: WishListService,
    private productService: ProductsService,
    private categoryService: SubCategoriesService,
    public actRoute: ActivatedRoute,
    private router: Router,
    private sellerService: SellerRegistrationService
  ) { }
  ngOnInit(): void {
    console.log('cart', this.cartService.getCurrentCart());
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';
    this.id = this.actRoute.snapshot.params['id'];


    this.categoryService.getAllList().subscribe((res) => {
      this.subCategories = res.data;
      console.log('categories:', this.subCategories);

      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;
        console.log('sellers:', this.sellers);

        this.productService.getAllList().subscribe((res) => {
          console.log('res.data:', res.data);
          this.unfilteredProducts = res.data.filter(
            (x) => x.sub_category_id == this.id
          );
          this.unfilteredProducts.forEach((product: any) => {
            product.image_url =
              'http://127.0.0.1:8000/storage/' + product.image_url;
            product.image_url2 =
              'http://127.0.0.1:8000/storage/' + product.image_url2;
            product.image_url3 =
              'http://127.0.0.1:8000/storage/' + product.image_url3;

            product.noOfRatings = product.ratings.length
            product.unRoundedAvgRating = ((product.ratings.reduce((sum, rate) => sum + Number(rate.rating), 0)) / (product.noOfRatings))
            product.avgRating = Math.floor(product.unRoundedAvgRating);

            product.totalStars = product.ratings.length

            product.one = product.ratings.filter(x => x.rating == 1).length
            product.two = product.ratings.filter(x => x.rating == 2).length
            product.three = product.ratings.filter(x => x.rating == 3).length
            product.four = product.ratings.filter(x => x.rating == 4).length
            product.five = product.ratings.filter(x => x.rating == 5).length

            product.fiveStar = (((product.ratings.filter(x => x.rating == 5).length) / product.totalStars) * 100)
            product.fourStar = (((product.ratings.filter(x => x.rating == 4).length) / product.totalStars) * 100)
            product.threeStar = (((product.ratings.filter(x => x.rating == 3).length) / product.totalStars) * 100)
            product.twoStar = (((product.ratings.filter(x => x.rating == 2).length) / product.totalStars) * 100)
            product.oneStar = (((product.ratings.filter(x => x.rating == 1).length) / product.totalStars) * 100)

            this.sellers.filter(x => x.user_id == product.user_id).forEach(seller => {
              product.seller_name = seller.business_name
              product.location = seller.address
              product.business_name = (seller.business_name).toUpperCase()
            })
            const category = this.subCategories.filter(
              (x) => x.id == product.sub_category_id
            );
            console.log('category', category);
            category.forEach((cat) => {
              product.sub_category_name = cat.name;
              console.log('category', product.sub_category_name);
            });
          });
          this.products = this.unfilteredProducts;
          console.log('products:', this.products);
        });
      });
    });



    this.cartService.updateTotal.subscribe((resp) => {
      if (resp) {
        this.currentCart = this.cartService.getCurrentCart();
      }
    });
    this.currentCart = this.cartService.getCurrentCart();
    this.currentWishlist = this.wishlistServie.getCurrentCart()
  }

  updateCart(item: any) {
    this.cartService.success('Item added to cart');
    this.cartService.addToCart(item, item.price, 1);

    this.checkIfExist(item);
  }

  getCurrentItemAmount(item): number {
    return this.cartService.getCurrentItemAmount(item);
  }

  checkIfExist(item) {
    this.currentWishlist = this.wishlistServie.getCurrentCart()
    console.log('wishlist', this.currentWishlist)
    const index = this.currentWishlist?.findIndex((p) => p.id === item.id);
    if (index >= 0) {
      return this.currentWishlist[index].quantity;
    }
    return 0;
  }


  addTowishList(item) {
    this.cartService.success('Item added to wishlist');
    return this.wishlistServie.addToCart(item, item.price, 1)
  }


  checkIfIteminWishList(item): boolean {
    const index = this.currentCart.findIndex((p) => p.id === item.id);

    if (index !== -1) {


      // Item found, index contains the position of the item in the array
      console.log(`Item found at index: ${index}`);
      return true
    } else {
      // Item not found
      console.log('Item not found in the cart');
      return false
    }
  }

  viewImage(item: any) {
    console.log('item', item)
    this.viewProduct = true
    this.selectedProduct = item
  }

  enquire(id: number) {
    this.router.navigate(['/enquire', id]);
  }

  hideDialog() {
    this.viewProduct = false
  }
}
