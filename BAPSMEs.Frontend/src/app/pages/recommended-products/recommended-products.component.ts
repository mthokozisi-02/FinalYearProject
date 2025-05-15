import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ProductCategory } from '../../../models/product-category';
import { Products } from '../../../models/products';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { Roles } from '../../tools/models';
import { CartService, ProductsService, SearchService, SellerRegistrationService, SubCategoriesService, WishListService } from '../../tools/services';
import { CategoriesService } from '../../tools/services/categories.service';
import { SharedService } from '../../tools/services/shared.service';

@Component({
  selector: 'app-recommended-products',
  templateUrl: './recommended-products.component.html',
  styleUrl: './recommended-products.component.css',
  standalone: false
})
export class RecommendedProductsComponent implements OnInit {
  URL = environment.domain;
  currentCart: any = [];
  searchTerm = '';
  filterValue = '';
  totalCart = 0;
  cartTotalAmount = 0;

  currentWishlist: any = [];

  viewProduct = false

  selectedProduct: Products = {} as Products;

  image: any

  categoryModal = false

  showCart = false

  role: any;

  categories: ProductCategory[] = [];

  subCategories: Observable<Array<SubCategory>>;

  subCategories_: SubCategory[] = [];

  filteredSubCategories: SubCategory[] = [];

  products: Products[] = []

  filteredProducts: Products[] = []

  wishlist = [];

  showProducts = false

  selectedCategory: any

  wishlistCount = 0

  sellers: Seller[] = []

  cart = false

  selectedFilterCategory: any

  selectedCategoryOption: any

  selectedSubCategoryOption: any

  id = 0

  constructor(
    private http: HttpClient,
    private router: Router,
    private searchService: SearchService,
    private subCatgeorySevice: SubCategoriesService,
    private categoryService: CategoriesService,
    private cartService: CartService,
    private productService: ProductsService,
    private wishlistServie: WishListService,
    private sellerService: SellerRegistrationService,
    private wishlistService: WishListService,
    private sharedService: SharedService
  ) {
    this.sharedService.getRefreshObservable().subscribe(() => {
      this.refresh();
    });
  }

  ngOnInit(): void {
    this.getWishListItems()

    this.role = sessionStorage.getItem('loggedUserRole') || '{}';

    this.cartService.updateTotal.subscribe((resp) => {
      if (resp) {
        this.currentCart = this.cartService.getCurrentCart();
        this.totalCart = this.cartService.getTotaltems();
        this.cartTotalAmount = this.cartService.getTotal();
      }
    });
    this.currentCart = this.cartService.getCurrentCart();
    this.totalCart = this.cartService.getTotaltems();
    this.cartTotalAmount = this.cartService.getTotal();
    this.currentCart = this.currentCart.slice(0, 2);



    this.categoryService.getAllList().subscribe((res) => {
      this.categories = res.data;
    });
    this.refresh();

    this.subCategories_ = JSON.parse(localStorage.getItem('subCategories'));
  }

  book(id: number) {
    this.router.navigate(['/book', id]);
  }

  refresh() {
    this.wishlist = this.wishlistService.getCurrentCart()

    if (this.wishlist.length != 0) {
      this.id = this.wishlist[this.wishlist.length - 1].id;

      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;

        this.productService.getSimilarProducts(this.id).subscribe((res) => {
          this.products = res.data
          this.products.forEach((product: any) => {
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
            const category = this.subCategories_.filter(
              (x) => x.id == product.sub_category_id
            );
            category.forEach((cat) => {
              product.sub_category_name = cat.name;
            });
          });
          this.filteredProducts = this.products.filter(x => x.similarity >= 0.5);
        });
      });
    }
    else {

      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;

        this.productService.getAllList().subscribe((res) => {
          this.products = res.data
          this.products.forEach((product: any) => {
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
            const category = this.subCategories_.filter(
              (x) => x.id == product.sub_category_id
            );
            category.forEach((cat) => {
              product.sub_category_name = cat.name;
            });
          });
          this.filteredProducts = this.products.slice(-12);
        });
      });
    }
  }

  updateCart(item: any) {
    if (this.role == Roles.BUYER) {
      console.log('yes')
      this.cartService.success('product added')
      this.cartService.addToCart(item, item.price, 1);

      this.checkCart(item);
    }
    else {
      console.log('what')
      alert('You are not allowed to add to cart')
    }
  }

  addTowishList(item) {
    this.cartService.success('Item added to wishlist');
    this.wishlistServie.addToCart(item, item.price, 1)
    this.ngOnInit()
  }




  enquire(id: number) {
    this.router.navigate(['/enquire', id]);
  }

  openQuation() {
    this.router.navigate(['/quotation']);
  }


  checkIfExist(item) {
    this.currentWishlist = this.wishlistServie.getCurrentCart()
    const index = this.currentWishlist?.findIndex((p) => p.id === item.id);
    if (index >= 0) {
      return this.currentWishlist[index].quantity;
    }
    return 0;
  }

  checkCart(item) {
    this.currentCart = this.cartService.getCurrentCart()
    const index = this.currentCart?.findIndex((p) => p.id === item.id);
    if (index >= 0) {
      return this.currentCart[index].quantity;
    }
    return 0;
  }


  removeItem(item) {
    this.cartService.removeFromCart(item)
  }

  showModal() {
    this.categoryModal = true
    console.log(this.categoryModal)
  }

  viewCart() {
    if (this.cart == true) {
      this.cart = false
    } else {
      this.cart = true
    }

  }


  // search(){
  //   const url = this.URL + "/search";
  //   this.http.get(url).subscribe((result) =>{

  //   })
  // }

  onSearch() {
    console.log(this.searchTerm);
    this.searchService.changeSearchTerm(this.searchTerm); // Update the search term in the service
  }


  getWishListItems() {
    this.wishlistServie.updateTotal.subscribe((resp) => {
      if (resp) {
        this.wishlist = this.wishlistServie.getCurrentCart();
        this.wishlistCount = this.wishlistServie.getTotaltems()
      }
    })
    this.wishlist = this.wishlistServie.getCurrentCart();
    this.wishlistCount = this.wishlistServie.getTotaltems()
  }

  removeItemFromWishlist(item) {
    this.wishlistServie.removeFromCart(item)
    this.ngOnInit()
  }

  viewImage(item: any) {
    this.viewProduct = true
    this.image = item
    this.selectedProduct = item
    this.selectedCategoryOption = this.selectedProduct.subcategory.category_id
    this.selectedSubCategoryOption = this.selectedProduct.sub_category_id

  }

  hideDialog() {
    this.viewProduct = false
  }
}
