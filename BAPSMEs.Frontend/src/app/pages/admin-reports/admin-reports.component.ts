import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Booking } from '../../../models/booking';
import { Buyer } from '../../../models/buyer';
import { Enquire } from '../../../models/enquire';
import { Payments } from '../../../models/payments';
import { Seller } from '../../../models/seller';
import { SubCategory } from '../../../models/sub-category';
import { SubOrder } from '../../../models/sub-order';
import { BuyerRegistrationService, OrdersService, SellerRegistrationService } from '../../tools/services';
import { EnquiryService } from '../../tools/services/enquiry.service';

@Component({
  selector: 'app-admin-reports',
  standalone: false,
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css'
})
export class AdminReportsComponent {

  report: any

  startDate: Date = new Date();

  endDate: Date = new Date();

  enquiries: Enquire[] = []

  orders: SubOrder[] = [];

  bookings: Booking[] = []

  payments: Payments[] = []

  buyers: Buyer[] = []

  sellers: Seller[] = []

  subCategories_: SubCategory[] = [];

  reportData = []

  showReport = false

  showEnquiries = true

  total_price: number = 0;

  constructor(private enquiryService: EnquiryService, private orderService: OrdersService, private sellerService: SellerRegistrationService, private buyerService: BuyerRegistrationService) { }

  ngOnInit(): void {
    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data;

      this.enquiryService.getAllList().subscribe((res) => {
        res.data.forEach((enquiry) => {

          this.buyers.filter(x => x.user_id == enquiry.user_id).forEach(buyer => {
            enquiry.buyer_phone = buyer.phone
            enquiry.buyer_country = buyer.country
          })
          enquiry.buyer_name = enquiry.user.name;
          enquiry.buyer_email = enquiry.user.email;
          enquiry.seller_name = enquiry.seller.name;
          enquiry.seller_email = enquiry.seller.email;
          enquiry.sub_category_name = enquiry.sub_category.name
          enquiry.product_name = enquiry.product.name
        });
        this.enquiries = res.data
        console.log('enquiries:', this.enquiries);
      });

      //orders
      this.sellerService.getAllList().subscribe((res) => {
        this.sellers = res.data;
        console.log('sellers:', res.data);

        this.subCategories_ = JSON.parse(localStorage.getItem('subCategories'));

        this.orderService.getAllList().subscribe((res) => {
          this.orders = res.data;
          console.log('orders:', this.orders);
          this.total_price = 0;

          this.orders.forEach((order) => {
            order.total_quantity = 0;
            this.buyers
              .filter((x) => x.user_id == order.buyer_id)
              .forEach((buyer) => {
                console.log('entered', buyer);
                order.buyer_pic =
                  'assets/img/user.png';
                order.buyer_name = buyer.user.name;
                order.buyer_email = buyer.user.email;
              });
            order.products.forEach((prod: any) => {
              const category = this.subCategories_.filter(
                (x) => x.id == prod.sub_category_id
              );
              category.forEach((cat) => {
                prod.sub_category_name = cat.name;
              });
              this.sellers
                .filter((x) => x.user_id == order.seller_id)
                .forEach((seller) => {
                  prod.business_name = seller.business_name;
                });
              order.total_quantity += prod.pivot.quantity;
            });
            this.total_price += Number(order.total_price);
          });
          console.log('orders:', this.orders);
        });

      });
    });
  }

  generateReport() {
    this.showReport = true
    this.showEnquiries = false
    console.log('report:', this.report)
    console.log('start:', new Date(this.startDate).toLocaleDateString());
    console.log('end:', new Date(this.endDate).toLocaleDateString())

    if (this.report == 'Enquiries') {
      this.reportData = this.enquiries.filter(x => new Date(x.created_at).toLocaleDateString() >= new Date(this.startDate).toLocaleDateString() && new Date(x.created_at).toLocaleDateString() <= new Date(this.endDate).toLocaleDateString())
      console.log('Enquiries:', this.reportData)
    } else if (this.report == 'Orders') {
      this.reportData = this.orders.filter(x => new Date(x.created_at).toLocaleDateString() >= new Date(this.startDate).toLocaleDateString() && new Date(x.created_at).toLocaleDateString() <= new Date(this.endDate).toLocaleDateString())
      console.log('Orders:', this.reportData)
    }
  }

  back() {
    this.showReport = false
    this.showEnquiries = true
  }

  public convertToPDF() {
    const data = document.getElementById('myquation');
    if (!data) return;

    setTimeout(() => {
      html2canvas(data, { useCORS: true, scale: 2 }).then((canvas) => {
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const pdf = new jsPDF('p', 'mm', 'a4');

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgHeight = (canvasHeight * imgWidth) / canvasWidth;

        const totalPages = Math.ceil(imgHeight / pageHeight);

        for (let i = 0; i < totalPages; i++) {
          const position = -(i * pageHeight);

          // Create a temporary canvas to hold just one page slice
          const pageCanvas = document.createElement('canvas');
          const pageContext = pageCanvas.getContext('2d')!;
          const sliceHeight = Math.min(
            canvasHeight - i * (canvasWidth * pageHeight) / imgWidth,
            (canvasWidth * pageHeight) / imgWidth
          );

          pageCanvas.width = canvasWidth;
          pageCanvas.height = sliceHeight;

          pageContext.drawImage(
            canvas,
            0,
            i * (canvasWidth * pageHeight) / imgWidth,
            canvasWidth,
            sliceHeight,
            0,
            0,
            canvasWidth,
            sliceHeight
          );

          const pageData = pageCanvas.toDataURL('image/png');
          if (i > 0) pdf.addPage();
          pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, (sliceHeight * imgWidth) / canvasWidth);
        }

        pdf.save('wishlist.pdf');
      });
    }, 1000);
  }


}
