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

  foodnBeverageSubCategories: SubCategory[] = [];

  retailSubCategories: SubCategory[] = [];

  servicesSubCategories: SubCategory[] = [];

  professionalServicesSubCategories: SubCategory[] = [];

  creativeServicesSubCategories: SubCategory[] = [];

  educationSubCategories: SubCategory[] = [];

  automotiveSubCategories: SubCategory[] = [];

  homeimprovementSubCategories: SubCategory[] = [];

  entertainmentSubCategories: SubCategory[] = [];

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

      this.foodnBeverageSubCategories = res.data.filter((x) => x.category_id == 2);
      this.retailSubCategories = res.data.filter((x) => x.category_id == 3);
      this.servicesSubCategories = res.data.filter((x) => x.category_id == 4);
      this.professionalServicesSubCategories = res.data.filter((x) => x.category_id == 5);
      this.creativeServicesSubCategories = res.data.filter(
        (x) => x.category_id == 6
      );
      this.educationSubCategories = res.data.filter((x) => x.category_id == 7);
      this.automotiveSubCategories = res.data.filter(
        (x) => x.category_id == 8
      );
      this.homeimprovementSubCategories = res.data.filter(
        (x) => x.category_id == 9
      );
      this.entertainmentSubCategories = res.data.filter(
        (x) => x.category_id == 10
      );
      console.log('subCategories:', this.subCategories);
      this.productList = this.foodnBeverageSubCategories;
    });
  }

  showFoodnBeverage() {
    this.productList = this.foodnBeverageSubCategories;
  }

  showRetail() {
    this.productList = this.retailSubCategories;
  }

  showServices() {
    this.productList = this.servicesSubCategories;
  }

  showProfessionalServices() {
    this.productList = this.professionalServicesSubCategories;
  }

  showCreativeServices() {
    this.productList = this.creativeServicesSubCategories;
  }

  showEducation() {
    this.productList = this.educationSubCategories;
  }

  showAutomotive() {
    this.productList = this.automotiveSubCategories;
  }

  showHomeImprovement() {
    this.productList = this.automotiveSubCategories;
  }

  showEntertainment() {
    this.productList = this.entertainmentSubCategories;
  }

  goToCategoryProducts(id: any) {
    this.router.navigate(['/category-shop', id]);
  }
}
