import { Component } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { User } from '../../../models/user';
import { WishListService } from '../../tools/services';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.css'
})
export class QuotationComponent {

  wishlist = []

  wishlistCount = 0

  todayDate = new Date()

  role: any

  user: User = {} as User;

  constructor(private router: Router, private wishlistService: WishListService) { }

  ngOnInit(): void {
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    if (sessionStorage.length == 0) {
      this.router.navigate(['/login']);
    }

    this.wishlist = this.wishlistService.getCurrentCart()
    this.wishlistCount = this.wishlistService.getTotal()
    this.wishlist.forEach(wish => {
      wish.price = Number(wish.price)
    })
    console.log(this.wishlist)
  }




  public convetToPDF() {
    setTimeout(() => {
      var data = document.getElementById('myquation');
      html2canvas(data, {
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        // Few necessary setting options
        const pdf = new jspdf('p', 'mm', 'a4', true);
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 265; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add new pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight; // Getting new position for the next page
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.addPage();

        const filename = 'wishlist' + '.pdf';
        pdf.save(filename);

      });
    }, 1000);
  }

}
