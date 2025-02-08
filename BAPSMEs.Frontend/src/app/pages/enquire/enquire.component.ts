import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../../models/products';
import { Ratings } from '../../../models/ratings';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { ProductsService, SellerRegistrationService, SubCategoriesService } from '../../tools/services';

@Component({
  selector: 'app-enquire',
  templateUrl: './enquire.component.html',
  styleUrl: './enquire.component.css'
})
export class EnquireComponent {

  product: Products = {} as Products

  reviews: Ratings[] = []

  sellers: Seller[] = []

  products: Products[] = []

  subCategories: SubCategory[] = [];

  id = 0

  constructor(private productService: ProductsService, private categoryService: SubCategoriesService,
    public actRoute: ActivatedRoute,
    private sellerService: SellerRegistrationService) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params['id'];

    this.categoryService.getAllList().subscribe((res) => {
      this.subCategories = res.data;
      console.log('categories:', this.subCategories);

      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;
        console.log('sellers:', this.sellers);

        this.productService.getAllList().subscribe((res) => {
          console.log('res.data:', res.data);
          this.products = res.data.filter(
            (x) => x.id == this.id
          );
          this.products.forEach((product: any) => {
            product.image_url =
              'https://orezon.co.zw/storage/app/public/' + product.image_url;
            this.sellers.filter(x => x.user_id == product.user_id).forEach(seller => {
              product.seller_name = seller.user.name
            })
            const category = this.subCategories.filter(
              (x) => x.id == product.sub_category_id
            );
            console.log('category', category);
            category.forEach((cat) => {
              product.sub_category_name = cat.name;
              console.log('category', product.sub_category_name);
            });

            this.product = product
          });
          console.log('products:', this.product);
        });
      });
    });
  }

}
