import { Component } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { User } from '../../../models/user';
import { WishListService } from '../../tools/services';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.css',
  standalone: false
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
