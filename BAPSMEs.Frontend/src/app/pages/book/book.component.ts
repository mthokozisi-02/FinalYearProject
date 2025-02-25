import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Booking } from '../../../models/booking';
import { Buyer } from '../../../models/buyer';
import { Products } from '../../../models/products';
import { Ratings } from '../../../models/ratings';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { BuyerRegistrationService, ProductsService, SellerRegistrationService, SubCategoriesService } from '../../tools/services';
import { BookService } from '../../tools/services/book.service';
import { RatingService } from '../../tools/services/rating.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {

  product: Products = {} as Products

  newRating: Ratings = {} as Ratings

  reviews: Ratings[] = []

  sellers: Seller[] = []

  buyers: Buyer[] = []

  avgRating = 0

  unRoundedAvgRating = 0

  products: Products[] = []

  subCategories: Observable<Array<SubCategory>>;

  subCategories_: SubCategory[] = [];

  id = 0

  ratingValue = 0

  newBooking: Booking = {} as Booking

  Flowbite: any;

  imagePreview: string = '';

  userId: any

  noOfRatings = 0

  selectedFile: File | null = null;

  selectedFile2: File | null = null;

  public ratingForm: FormGroup;

  public enquireForm: FormGroup;

  public bookForm: FormGroup;

  selectedCategoryOption: any

  selectedSubCategoryOption: any

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

  constructor(private productService: ProductsService, private bookingService: BookService, private subCatgeorySevice: SubCategoriesService,
    public actRoute: ActivatedRoute,
    private sellerService: SellerRegistrationService,
    private buyerService: BuyerRegistrationService,
    private ratingService: RatingService) {
    this.ratingForm = new FormGroup({
      comment: new FormControl('', [Validators.required]),
    });

    this.bookForm = new FormGroup({

      preferred_contact_method: new FormControl(''),
      payment_method: new FormControl(''),
      booking_status: new FormControl('Pending'),
      project_details: new FormControl(''),
      property_address: new FormControl(''),
      project_timeline: new FormControl(''),
      payment_schedule: new FormControl(''),
      appointment_type: new FormControl(''),
      management_duration: new FormControl(''),
      number_of_people: new FormControl(''),
      special_request: new FormControl(''),
      dietary_requirements: new FormControl(''),
      table_preferences: new FormControl(''),
      quantity: new FormControl(''),
      size: new FormControl(''),
      shipping_options: new FormControl(''),
      address: new FormControl(''),
      equipment_requirements: new FormControl(''),
      service_duration: new FormControl(''),
      location_type: new FormControl(''),
      special_instructions: new FormControl(''),
      project_scope: new FormControl(''),
      required_documentation: new FormControl(''),
      timeline_requirements: new FormControl(''),
      project_type: new FormControl(''),
      deliverable_format: new FormControl(''),
      revision_requirements: new FormControl(''),
      style_preference: new FormControl(''),
      skill_level: new FormControl(''),
      schedule_requirements: new FormControl(''),
      class_size: new FormControl(''),
      prerequisites: new FormControl(''),
      vehicle_information: new FormControl(''),
      service_type: new FormControl(''),
      preferred_date: new FormControl(''),
      preferred_time: new FormControl(''),
      property_type: new FormControl(''),
      budget_range: new FormControl(''),
      number_of_guests: new FormControl(''),
      event_type: new FormControl(''),
      duration: new FormControl(''),
      special_requirements: new FormControl(''),
      additional_information: new FormControl(''),
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

    this.subCategories_ = JSON.parse(sessionStorage.getItem('subCategories'));

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
            this.selectedCategoryOption = product.subcategory.category_id
            this.selectedSubCategoryOption = product.sub_category_id
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
              product.seller_name = seller.business_name
            })
            const category = this.subCategories_.filter(
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

  book() {
    this.newBooking.preferred_date = this.bookForm.value.preferred_date;
    this.newBooking.preferred_time = this.bookForm.value.preferred_time;
    this.newBooking.payment_method = this.bookForm.value.payment_method;
    this.newBooking.booking_status = this.bookForm.value.booking_status;
    this.newBooking.project_details = this.bookForm.value.project_details;
    this.newBooking.property_address = this.bookForm.value.property_address;
    this.newBooking.project_timeline = this.bookForm.value.project_timeline;
    this.newBooking.payment_schedule = this.bookForm.value.payment_schedule;
    this.newBooking.appointment_type = this.bookForm.value.appointment_type;
    this.newBooking.management_duration = this.bookForm.value.management_duration;
    this.newBooking.number_of_people = this.bookForm.value.number_of_people;
    this.newBooking.special_request = this.bookForm.value.special_request;
    this.newBooking.dietary_requirements = this.bookForm.value.dietary_requirements;
    this.newBooking.table_preferences = this.bookForm.value.table_preferences;
    this.newBooking.quantity = this.bookForm.value.quantity;
    this.newBooking.size = this.bookForm.value.size;
    this.newBooking.shipping_options = this.bookForm.value.shipping_options;
    this.newBooking.address = this.bookForm.value.address;
    this.newBooking.equipment_requirements = this.bookForm.value.equipment_requirements;
    this.newBooking.service_duration = this.bookForm.value.service_duration;
    this.newBooking.location_type = this.bookForm.value.location_type;
    this.newBooking.special_instructions = this.bookForm.value.special_instructions;
    this.newBooking.project_scope = this.bookForm.value.project_scope;
    this.newBooking.required_documentation = this.bookForm.value.required_documentation;
    this.newBooking.timeline_requirements = this.bookForm.value.timeline_requirements;
    this.newBooking.project_type = this.bookForm.value.project_type;
    this.newBooking.deliverable_format = this.bookForm.value.deliverable_format;
    this.newBooking.revision_requirements = this.bookForm.value.revision_requirements;
    this.newBooking.style_preference = this.bookForm.value.style_preference;
    this.newBooking.skill_level = this.bookForm.value.skill_level;
    this.newBooking.schedule_requirements = this.bookForm.value.schedule_requirements;
    this.newBooking.class_size = this.bookForm.value.class_size;
    this.newBooking.prerequisites = this.bookForm.value.prerequisites;
    this.newBooking.vehicle_information = this.bookForm.value.vehicle_information;
    this.newBooking.service_type = this.bookForm.value.service_type;
    this.newBooking.property_type = this.bookForm.value.property_type;
    this.newBooking.budget_range = this.bookForm.value.budget_range;
    this.newBooking.number_of_guests = this.bookForm.value.number_of_guests;
    this.newBooking.event_type = this.bookForm.value.event_type;
    this.newBooking.duration = this.bookForm.value.duration;
    this.newBooking.special_requirements = this.bookForm.value.special_requirements;
    this.newBooking.additional_information = this.bookForm.value.additional_information;


    this.newBooking.product_id = this.product.id
    this.newBooking.sub_category_id = this.product.sub_category_id
    this.newBooking.seller_id = this.product.user_id
    this.newBooking.user_id = this.userId
    this.newBooking.total_price = (Number(this.product.price))
    this.newBooking.received = 'false'

    console.log('booking', this.newBooking)

    this.bookingService.book(this.newBooking).subscribe(
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
