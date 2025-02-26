import { Component } from '@angular/core';
import { Booking } from '../../../models/booking';
import { Buyer } from '../../../models/buyer';
import { Products } from '../../../models/products';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { User } from '../../../models/user';
import { SellerRegistrationService } from '../../tools/services';
import { BookService } from '../../tools/services/book.service';

@Component({
    selector: 'app-buyer-bookings',
    templateUrl: './buyer-bookings.component.html',
    styleUrl: './buyer-bookings.component.css',
    standalone: false
})
export class BuyerBookingsComponent {

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

  constructor(private bookingService: BookService, private sellerService: SellerRegistrationService,) { }


  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.viewBooking = false;
    this.viewBookings = true;

    this.sellerService.getAllList().subscribe((res) => {
      this.sellers = res.data;

      this.bookingService.getBuyerBookings().subscribe((res) => {
        res.data.forEach((booking) => {

          this.sellers.filter(x => x.user_id == booking.seller_id).forEach(seller => {
            booking.seller_phone = seller.phone
            booking.seller_country = seller.country
          })

          booking.seller_pic =
            'assets/img/user.png';
          booking.seller_name = booking.seller.name;
          booking.seller_email = booking.seller.email;
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
    console.log(this.bookings)
    this.filteredBookings = this.bookings.filter(
      prod => prod?.seller_name.toLowerCase().includes(item.toLowerCase())
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
  }


  clear() {
    this.viewBookings = true
    this.viewBooking = false
  }


}
