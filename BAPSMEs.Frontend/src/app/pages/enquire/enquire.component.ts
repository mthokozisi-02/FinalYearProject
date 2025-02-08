import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IgcRatingComponent, defineComponents } from 'igniteui-webcomponents';
import { Buyer } from '../../../models/buyer';
import { Products } from '../../../models/products';
import { Ratings } from '../../../models/ratings';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { BuyerRegistrationService, ProductsService, SellerRegistrationService, SubCategoriesService } from '../../tools/services';
import { RatingService } from '../../tools/services/rating.service';

defineComponents(IgcRatingComponent);

@Component({
  selector: 'app-enquire',
  templateUrl: './enquire.component.html',
  styleUrl: './enquire.component.css'
})
export class EnquireComponent {


  product: Products = {} as Products

  newRating: Ratings = {} as Ratings

  reviews: Ratings[] = []

  sellers: Seller[] = []

  buyers: Buyer[] = []

  avgRating = 0

  unRoundedAvgRating = 0

  products: Products[] = []

  subCategories: SubCategory[] = [];

  id = 0

  ratingValue = 0

  imagePreview: string = '';

  userId: any

  noOfRatings = 0

  selectedFile: File | null = null;

  selectedFile2: File | null = null;

  public ratingForm: FormGroup;

  constructor(private productService: ProductsService, private categoryService: SubCategoriesService,
    public actRoute: ActivatedRoute,
    private sellerService: SellerRegistrationService,
    private buyerService: BuyerRegistrationService,
    private ratingService: RatingService) {
    this.ratingForm = new FormGroup({
      comment: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params['id'];
    this.userId = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');

    this.categoryService.getAllList().subscribe((res) => {
      this.subCategories = res.data;
      console.log('categories:', this.subCategories);

      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;
        console.log('sellers:', this.sellers);

        this.buyerService.getAllList().subscribe((res) => {
          this.buyers = res.data;
          console.log('buyers:', this.buyers);

          this.productService.getAllList().subscribe((res) => {
            console.log('res.data:', res.data);
            this.products = res.data.filter(
              (x) => x.id == this.id
            );
            this.products.forEach((product: any) => {
              product.image_url =
                'http://127.0.0.1:8000/storage/' + product.image_url;
              product.image_url2 =
                'http://127.0.0.1:8000/storage/' + product.image_url2;
              product.image_url3 =
                'http://127.0.0.1:8000/storage/' + product.image_url3;

              this.noOfRatings = product.ratings.length
              this.unRoundedAvgRating = ((product.ratings.reduce((sum, rate) => sum + Number(rate.rating), 0)) / (this.noOfRatings))
              this.avgRating = Math.floor(this.unRoundedAvgRating);

              product.ratings.forEach(rate => {
                this.sellers.filter(x => x.user_id == rate.user_id).forEach(seller => {
                  rate.user_name = seller.user.name
                })
                this.buyers.filter(x => x.user_id == rate.user_id).forEach(buyer => {
                  rate.user_name = buyer.user.name
                })
              })
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
    });
  }

  ratingChanged(event: CustomEvent) {
    console.log(event.detail)
    this.ratingValue = event.detail
  }

  submitRating() {
    this.newRating.comment = this.ratingForm.value.comment
    this.newRating.user_id = this.userId
    this.newRating.product_id = this.id
    this.newRating.rating = this.ratingValue

    console.log(this.newRating)

    var formData = new FormData();
    formData.append('comment', this.ratingForm.value.comment);
    formData.append('user_id', String(this.userId));
    formData.append('product_id', String(this.id));
    formData.append('rating', String(this.newRating.rating));
    formData.append('image_url1', this.selectedFile, this.selectedFile.name);
    formData.append('image_url2', this.selectedFile2, this.selectedFile2.name);

    this.ratingService.create(formData).subscribe(
      (res) => {
        console.log('res', res);

        if (res.status == 'created') {
          alert(res.message);
          this.ngOnInit()
          console.log(res.message);
        } else {
          console.log(res.message);
          // Handle the error as needed
        }
      },
      (error) => {
        console.error(error.error.message);
        alert(error.error.message);
        // Handle the error as needed
      }
    );
    this.ratingForm.reset();
  }

  onFileSelected2(event: any) {
    console.log('2')
    const target = event.target as HTMLInputElement;
    this.selectedFile2 = target.files!.item(0);

    if (this.selectedFile2) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.displayImage2(e.target!.result as string);
      };
      reader.readAsDataURL(this.selectedFile2);
    }
  }

  displayImage2(imageData: string): void {
    // Update the image preview in the template
    this.imagePreview = imageData;
  }

  getImagePreview2(): string {
    if (!this.selectedFile2) {
      return 'assets/img/upload.svg';
    }
    return URL.createObjectURL(this.selectedFile2);
  }

  onFileSelected(event: any) {
    console.log('1')
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files!.item(0);

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.displayImage2(e.target!.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  displayImage(imageData: string): void {
    // Update the image preview in the template
    this.imagePreview = imageData;
  }

  getImagePreview(): string {
    if (!this.selectedFile) {
      return 'assets/img/upload.svg';
    }
    return URL.createObjectURL(this.selectedFile);
  }

}
