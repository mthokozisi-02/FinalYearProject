import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IgcRatingComponent, defineComponents } from 'igniteui-webcomponents';
import { Buyer } from '../../../models/buyer';
import { Enquire } from '../../../models/enquire';
import { Products } from '../../../models/products';
import { Ratings } from '../../../models/ratings';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { BuyerRegistrationService, ProductsService, SellerRegistrationService, SubCategoriesService } from '../../tools/services';
import { EnquiryService } from '../../tools/services/enquiry.service';
import { RatingService } from '../../tools/services/rating.service';

defineComponents(IgcRatingComponent);

@Component({
  selector: 'app-enquire',
  templateUrl: './enquire.component.html',
  styleUrl: './enquire.component.css'
})
export class EnquireComponent implements AfterViewInit {


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

  newEnquiry: Enquire = {} as Enquire

  Flowbite: any;

  imagePreview: string = '';

  userId: any

  noOfRatings = 0

  selectedFile: File | null = null;

  selectedFile2: File | null = null;

  public ratingForm: FormGroup;

  public enquireForm: FormGroup;

  fiveStar = 0;
  fourStar = 0;
  oneStar = 0;
  twoStar = 0;
  threeStar = 0;

  five = 0;
  four = 0;
  one = 0;
  two = 0;
  three = 0;

  totalStars = 0

  constructor(private productService: ProductsService, private enquiryService: EnquiryService, private categoryService: SubCategoriesService,
    public actRoute: ActivatedRoute,
    private sellerService: SellerRegistrationService,
    private buyerService: BuyerRegistrationService,
    private ratingService: RatingService) {
    this.ratingForm = new FormGroup({
      comment: new FormControl('', [Validators.required]),
    });
    this.enquireForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
      quantity: new FormControl(0, [Validators.required]),
      location: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
      payment: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit() {
    if (typeof this.Flowbite !== 'undefined') {
      this.Flowbite.initCarousels(); // Initialize Flowbite carousel
      this.Flowbite.initDatepickers();
    }
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

              this.totalStars = product.ratings.length

              this.one = product.ratings.filter(x => x.rating == 1).length
              this.two = product.ratings.filter(x => x.rating == 2).length
              this.three = product.ratings.filter(x => x.rating == 3).length
              this.four = product.ratings.filter(x => x.rating == 4).length
              this.five = product.ratings.filter(x => x.rating == 5).length

              this.fiveStar = (((product.ratings.filter(x => x.rating == 5).length) / this.totalStars) * 100)
              this.fourStar = (((product.ratings.filter(x => x.rating == 4).length) / this.totalStars) * 100)
              this.threeStar = (((product.ratings.filter(x => x.rating == 3).length) / this.totalStars) * 100)
              this.twoStar = (((product.ratings.filter(x => x.rating == 2).length) / this.totalStars) * 100)
              this.oneStar = (((product.ratings.filter(x => x.rating == 1).length) / this.totalStars) * 100)

              product.ratings.forEach(rate => {
                this.sellers.filter(x => x.user_id == rate.user_id).forEach(seller => {
                  rate.user_name = seller.user.name
                })
                this.buyers.filter(x => x.user_id == rate.user_id).forEach(buyer => {
                  rate.user_name = buyer.user.name
                })

                if (rate.image_url1) {
                  rate.image_url1 = 'http://127.0.0.1:8000/storage/' + rate.image_url1
                }
                if (rate.image_url2) {
                  rate.image_url2 = 'http://127.0.0.1:8000/storage/' + rate.image_url2
                }
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
    if (this.selectedFile) {
      formData.append('image_url1', this.selectedFile, this.selectedFile.name);
    }
    if (this.selectedFile2) {
      formData.append('image_url2', this.selectedFile2, this.selectedFile2.name);
    }

    this.ratingService.create(formData).subscribe(
      (res) => {
        console.log('res', res);

        if (res.status == 'created') {
          alert(res.message);
          this.ngOnInit()
          console.log(res.message);
          this.selectedFile = null
          this.selectedFile2 = null
        } else {
          console.log(res.message);
          // Handle the error as needed
        }
      },
      (error) => {
        console.error(error.error.message);
        console.log('error', error)
        alert(error.error.message);
        // Handle the error as needed
      }
    );
    this.ratingForm.reset();
  }

  enquire() {
    this.newEnquiry.date = this.enquireForm.value.date
    this.newEnquiry.time = this.enquireForm.value.time
    this.newEnquiry.location = this.enquireForm.value.location
    this.newEnquiry.payment = this.enquireForm.value.payment
    this.newEnquiry.quantity = this.enquireForm.value.quantity
    this.newEnquiry.message = this.enquireForm.value.message
    this.newEnquiry.product_id = this.product.id
    this.newEnquiry.sub_category_id = this.product.sub_category_id
    this.newEnquiry.seller_id = this.product.user_id
    this.newEnquiry.user_id = this.userId
    this.newEnquiry.total_price = (Number(this.product.price)) * this.newEnquiry.quantity

    console.log('enquiry', this.newEnquiry)

    this.enquiryService.enquire(this.newEnquiry).subscribe(
      (res) => {
        console.log('res', res);

        if (res.status == 'created') {
          alert(res.message);
          this.ngOnInit()
          console.log(res.message);
          this.selectedFile = null
          this.selectedFile2 = null
        } else {
          console.log(res.message);
          // Handle the error as needed
        }
      },
      (error) => {
        console.error(error.error.message);
        console.log('error', error)
        alert(error.error.message);
        // Handle the error as needed
      }
    );
    this.enquireForm.reset();
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
