import { Component } from '@angular/core';
import { Buyer } from '../../../models/buyer';
import { Enquire } from '../../../models/enquire';
import { Products } from '../../../models/products';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { User } from '../../../models/user';
import { SellerRegistrationService } from '../../tools/services';
import { EnquiryService } from '../../tools/services/enquiry.service';

@Component({
    selector: 'app-buyer-enquiries',
    templateUrl: './buyer-enquiries.component.html',
    styleUrl: './buyer-enquiries.component.css',
    standalone: false
})
export class BuyerEnquiriesComponent {
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

  constructor(private enquiryService: EnquiryService, private sellerService: SellerRegistrationService,) { }


  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.viewEnquiry = false;
    this.viewEnquiries = true;

    this.sellerService.getAllList().subscribe((res) => {
      this.sellers = res.data;

      this.enquiryService.getBuyerEnquiries().subscribe((res) => {
        res.data.forEach((enquiry) => {

          this.sellers.filter(x => x.user_id == enquiry.seller_id).forEach(seller => {
            enquiry.seller_phone = seller.phone
            enquiry.seller_country = seller.country
          })

          enquiry.seller_pic =
            'assets/img/user.png';
          enquiry.seller_name = enquiry.seller.name;
          enquiry.seller_email = enquiry.seller.email;
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
      prod => prod?.seller_name.toLowerCase().includes(item.toLowerCase())
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
  }


  clear() {
    this.viewEnquiries = true
    this.viewEnquiry = false
  }

}
