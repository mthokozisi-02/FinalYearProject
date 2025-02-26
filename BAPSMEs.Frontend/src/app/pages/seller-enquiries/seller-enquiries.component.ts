import { Component } from '@angular/core';
import { Buyer } from '../../../models/buyer';
import { Enquire } from '../../../models/enquire';
import { Products } from '../../../models/products';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { User } from '../../../models/user';
import { BuyerRegistrationService } from '../../tools/services/buyer-registration.service';
import { EnquiryService } from '../../tools/services/enquiry.service';
@Component({
    selector: 'app-seller-enquiries',
    templateUrl: './seller-enquiries.component.html',
    styleUrl: './seller-enquiries.component.css',
    standalone: false
})
export class SellerEnquiriesComponent {

  enquiries: Enquire[] = []

  selectedSubCategoryOption: any

  selectedCategoryOption: any

  viewEnquiry = false;

  viewEnquiries = false

  subCategories: SubCategory[] = []

  products: Products[] = []

  filteredEnquiries: Enquire[] = []

  user: User = {} as User;

  selectedEnquiry: Enquire = {} as Enquire;

  buyers: Buyer[] = [];

  sellers: Seller[] = []

  buyer_pic: any;

  constructor(private enquiryService: EnquiryService, private buyerService: BuyerRegistrationService,) { }


  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.viewEnquiry = false;
    this.viewEnquiries = true;

    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;
      console.log('buyers', this.buyers)
      this.enquiryService.getSellerEnquiries().subscribe((res) => {
        res.data.forEach((enquiry) => {

          this.buyers.filter(x => x.user_id == enquiry.user_id).forEach(buyer => {
            enquiry.buyer_phone = buyer.phone
            enquiry.buyer_country = buyer.country
          })
          enquiry.buyer_pic =
            'assets/img/user.png';
          enquiry.buyer_name = enquiry.user.name;
          enquiry.buyer_email = enquiry.user.email;
          enquiry.sub_category_name = enquiry.sub_category.name
          enquiry.product_name = enquiry.product.name
        });
        this.enquiries = res.data
        this.filteredEnquiries = this.enquiries
        console.log('enquiries:', this.enquiries);
      });
    });
  }

  searchPayments(item: any) {
    console.log(this.enquiries)
    this.filteredEnquiries = this.enquiries.filter(
      prod => prod?.buyer_name.toLowerCase().includes(item.toLowerCase())
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredEnquiries)
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
    this.viewEnquiry = false
  }

  view(item: any) {
    this.selectedEnquiry = item
    this.viewEnquiry = true
    this.viewEnquiries = false
    this.selectedSubCategoryOption = item.sub_category_id
    this.selectedCategoryOption = item.sub_category.category_id

    if (item.received == 'false') {
      this.Received(item)
    }
  }

  Received(item: any) {
    this.enquiryService
      .updateStatus(item.id)
      .subscribe(
        (res) => {
          console.log('res', res);

          if (res.status == 'success') {
            this.enquiryService.success('Enquiry updated successfully');
            this.ngOnInit();
          } else {
            console.error(Error);
          }
        }
      );
  }

  clear() {
    this.viewEnquiries = true
    this.viewEnquiry = false
  }

}
