import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SubCategory } from '../../../models/sub-category';
import { SubCategoriesService } from '../../tools/services';

@Component({
  selector: 'app-equipment-categories',
  templateUrl: './equipment-categories.component.html',
  styleUrl: './equipment-categories.component.css',
})
export class EquipmentCategoriesComponent {
  productList: any = [];

  subCategories: SubCategory[] = [];

  drillingSubCategories: SubCategory[] = [];

  haulingSubCategories: SubCategory[] = [];

  crushingSubCategories: SubCategory[] = [];

  separationSubCategories: SubCategory[] = [];

  undergroundSubCategories: SubCategory[] = [];

  safetySubCategories: SubCategory[] = [];

  miscellaneousSubCategories: SubCategory[] = [];

  sparesSubCategories: SubCategory[] = [];

  constructor(
    private router: Router,
    private subCatgeorySevice: SubCategoriesService
  ) { }

  ngOnInit() {
    this.subCatgeorySevice.getAllList().subscribe((res) => {
      this.subCategories = res.data;
      this.subCategories.forEach(cat => {
        cat.image_url = 'http://127.0.0.1:8000/storage/' + cat.image_url;
      });

      this.drillingSubCategories = res.data.filter((x) => x.category_id == 2);
      this.haulingSubCategories = res.data.filter((x) => x.category_id == 3);
      this.crushingSubCategories = res.data.filter((x) => x.category_id == 4);
      this.separationSubCategories = res.data.filter((x) => x.category_id == 5);
      this.undergroundSubCategories = res.data.filter(
        (x) => x.category_id == 6
      );
      this.safetySubCategories = res.data.filter((x) => x.category_id == 7);
      this.miscellaneousSubCategories = res.data.filter(
        (x) => x.category_id == 8
      );
      this.sparesSubCategories = res.data.filter(
        (x) => x.category_id == 9
      );
      console.log('subCategories:', this.subCategories);
      this.productList = this.drillingSubCategories;
    });
  }

  showDrilling() {
    this.productList = this.drillingSubCategories;
  }

  showLoading() {
    this.productList = this.haulingSubCategories;
  }

  showCrushing() {
    this.productList = this.crushingSubCategories;
  }

  showSeparation() {
    this.productList = this.separationSubCategories;
  }

  showUnderground() {
    this.productList = this.undergroundSubCategories;
  }

  showSafety() {
    this.productList = this.safetySubCategories;
  }

  showMiscellaneos() {
    this.productList = this.miscellaneousSubCategories;
  }

  goToCategoryProducts(id: any) {
    this.router.navigate(['/category-shop', id]);
  }
}
