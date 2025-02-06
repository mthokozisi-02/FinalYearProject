import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { ProductCategory } from '../../../models/product-category';
import { Products } from '../../../models/products';
import { SubCategory } from '../../../models/sub-category';
import { CartService, ProductsService, SearchService, SubCategoriesService, WishListService } from '../../tools/services';
import { CategoriesService } from '../../tools/services/categories.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  URL = environment.domain;
  currentCart: any = [];
  searchTerm = '';
  filterValue = '';
  totalCart = 0;
  cartTotalAmount = 0;

  viewProduct = false

  image: any

  categoryModal = false

  showCart = false

  role: any;

  categories: ProductCategory[] = [];

  subCategories: SubCategory[] = [];

  filteredSubCategories: SubCategory[] = [];

  products: Products[] = []

  filteredProducts: Products[] = []

  wishlist = [];

  showProducts = false

  selectedCategory: any

  wishlistCount = 0

  cart = false

  selectedFilterCategory: any

  constructor(
    private http: HttpClient,
    private router: Router,
    private searchService: SearchService,
    private subCategoryService: SubCategoriesService,
    private categoryService: CategoriesService,
    private cartService: CartService,
    private productService: ProductsService,
    private wishlistServie: WishListService
  ) { }

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
      console.log('categories:', this.categories);
    });

    this.productService.getAllList().subscribe((res) => {
      this.products = res.data
      this.products.forEach((product: any) => {
        product.image_url =
          'https://orezon.co.zw/storage/app/public/' + product.image_url;
        const category = this.subCategories.filter(
          (x) => x.id == product.sub_category_id
        );
        console.log('category', category);
        category.forEach((cat) => {
          product.sub_category_name = cat.name;
          console.log('category', product.sub_category_name);
        });
      });
      this.filteredProducts = this.products;
      console.log('products:', this.products);
    });

    this.subCategoryService.getAllList().subscribe((res) => {
      this.subCategories = res.data;
      this.filteredSubCategories = this.subCategories
      console.log('sub categories:', this.subCategories);
    })
  }

  updateCart(item: any) {
    this.cartService.success('product added')
    this.cartService.addToCart(item, item.price, 1);

    this.checkIfExist(item);
  }

  addTowishList(item) {
    this.cartService.success('Item added to wishlist');
    return this.wishlistServie.addToCart(item, item.price, 1)
  }

  searchProducts(item: any) {
    if (!item) {
      this.showProducts = false
    }
    else {
      this.showProducts = true
    }
    console.log(item)
    console.log(this.products)
    console.log(this.selectedCategory)
    if (!this.selectedCategory) {
      console.log('yes')
      this.filteredProducts = this.products.filter(
        prod => prod?.name.toLowerCase().includes(item.toLowerCase())
      );
    } else {
      this.filteredProducts = this.filteredProducts.filter(
        prod => prod?.name.toLowerCase().includes(item.toLowerCase())
      );
    }

    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredProducts)
    //this.filteredProducts = this.products.filter(x => x.)
  }

  openCart() {
    this.router.navigate(['/cart']);
  }

  openQuation() {
    this.router.navigate(['/quotation']);
  }


  checkIfExist(item) {
    const index = this.currentCart?.findIndex((p) => p.id === item.id);
    if (index >= 0) {
      return this.currentCart[index].quantity;
    }
    return 0;
  }


  removeItem(item) {
    this.cartService.removeFromCart(item)
  }

  onSelection(item: any) {
    this.categoryModal = false
    this.selectedCategory = (item.target as HTMLSelectElement).value;
    console.log(this.selectedCategory)
    console.log(this.products)

    this.filteredProducts = this.products.filter(x => x.subcategory.id == this.selectedCategory)
    console.log(this.filteredProducts)

    // this.filteredSubCategories = this.subCategories.filter(x => x.category_id == selectedCategory)
    // console.log(this.filteredSubCategories)

  }

  goToCategoryProducts(item: any) {
    const selectedCategory = (item.target as HTMLSelectElement).value;

    this.router.navigate(['/category-shop', selectedCategory]);

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
  }

  viewImage(item: any) {
    this.viewProduct = true
    this.image = item
  }

  hideDialog() {
    this.viewProduct = false
  }
}
