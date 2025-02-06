import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SubCategory } from '../../../models/sub-category';
import { SubCategoriesService } from '../../tools/services';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  subCategories: SubCategory[] = [];

  unfilteredSubCategories: SubCategory[] = [];

  constructor(
    private router: Router,
    private subCatgeorySevice: SubCategoriesService
  ) { }

  ngOnInit(): void {
    this.subCatgeorySevice.getAllList().subscribe((res) => {
      this.unfilteredSubCategories = res.data.filter((x) => x.category_id == 1);
      this.unfilteredSubCategories.filter(x => x.id == 1).forEach(cat => {
        cat.image_url = 'assets/img/construction.jpg';
      })
      this.unfilteredSubCategories.filter(x => x.id == 2).forEach(cat => {
        cat.image_url = 'assets/img/insurance.png';
      })
      this.unfilteredSubCategories.filter(x => x.id == 3).forEach(cat => {
        cat.image_url = 'assets/img/banking.png';
      })
      this.unfilteredSubCategories.filter(x => x.id == 4).forEach(cat => {
        cat.image_url = 'assets/img/property.png';
      })
      this.subCategories = this.unfilteredSubCategories;
      console.log('subCategories:', this.unfilteredSubCategories);
    });
  }

  goToCategoryProducts(id: any) {
    this.router.navigate(['/category-shop', id]);
  }
}
