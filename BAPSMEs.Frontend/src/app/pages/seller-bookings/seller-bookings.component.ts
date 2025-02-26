import { Component } from '@angular/core';
import { Booking } from '../../../models/booking';
import { Buyer } from '../../../models/buyer';
import { Products } from '../../../models/products';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { User } from '../../../models/user';
import { BuyerRegistrationService } from '../../tools/services';
import { BookService } from '../../tools/services/book.service';

@Component({
    selector: 'app-seller-bookings',
    templateUrl: './seller-bookings.component.html',
    styleUrl: './seller-bookings.component.css',
    standalone: false
})
export class SellerBookingsComponent {

  bookings: Booking[] = []

  selectedSubCategoryOption: any

  selectedCategoryOption: any

  viewBooking = false;

  viewBookings = false

  subCategories: SubCategory[] = []

  products: Products[] = []

  filteredBookings: Booking[] = []

  user: User = {} as User;

  selectedBooking: Booking = {} as Booking;

  buyers: Buyer[] = [];

  sellers: Seller[] = []

  buyer_pic: any;

  constructor(private bookingService: BookService, private buyerService: BuyerRegistrationService,) { }


  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.viewBooking = false;
    this.viewBookings = true;

    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;

      this.bookingService.getSellerBookings().subscribe((res) => {
        res.data.forEach((booking) => {

          this.buyers.filter(x => x.user_id == booking.user_id).forEach(buyer => {
            booking.buyer_phone = buyer.phone
            booking.buyer_country = buyer.country
          })

          booking.buyer_pic =
            'assets/img/user.png';
          booking.buyer_name = booking.user.name;
          booking.buyer_email = booking.user.email;
          booking.sub_category_name = booking.sub_category.name
          booking.product_name = booking.product.name
        });
        this.bookings = res.data
        this.filteredBookings = this.bookings
        console.log('bookings:', this.bookings);
      });
    });
  }

  searchPayments(item: any) {
    this.filteredBookings = this.bookings.filter(
      prod => prod?.buyer_name.toLowerCase().includes(item.toLowerCase())
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredBookings)
    //this.filteredProducts = this.products.filter(x => x.)
  }

  splitDescription(description: string, wordsPerLine: number): string[] {
    if (!description) return [];

    const words = description.split(' '); // Split into words
    const lines = [];
    console.log(words)

    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    console.log(lines)

    return lines;
  }

  hideDialog() {
    this.viewBooking = false
  }

  view(item: any) {
    this.selectedBooking = item
    this.viewBooking = true
    this.viewBookings = false
    this.selectedSubCategoryOption = item.sub_category_id
    this.selectedCategoryOption = item.sub_category.category_id

    if (this.selectedBooking.received == 'false') {
      this.Received(item)
    }
  }

  Received(item: any) {
    this.bookingService
      .updateStatus(item.id)
      .subscribe(
        (res) => {
          console.log('res', res);

          if (res.status == 'success') {
            this.bookingService.success('Enquiry updated successfully');
            this.ngOnInit();
          } else {
            console.error(Error);
          }
        }
      );
  }

  clear() {
    this.viewBookings = true
    this.viewBooking = false
  }

}
