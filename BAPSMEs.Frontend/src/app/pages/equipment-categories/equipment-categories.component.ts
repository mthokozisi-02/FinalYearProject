import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment-categories',
  templateUrl: './equipment-categories.component.html',
  styleUrl: './equipment-categories.component.css',
})
export class EquipmentCategoriesComponent {
  productList: any = [];

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {

    this.productList = JSON.parse(localStorage.getItem('foodnBeverageSubCategories'));
  }

  showFoodnBeverage() {
    this.productList = JSON.parse(localStorage.getItem('foodnBeverageSubCategories'));
  }

  showRetail() {
    this.productList = JSON.parse(localStorage.getItem('retailSubCategories'));
  }

  showServices() {
    this.productList = JSON.parse(localStorage.getItem('servicesSubCategories'));
  }

  showProfessionalServices() {
    this.productList = JSON.parse(localStorage.getItem('professionalServicesSubCategories'));
  }

  showCreativeServices() {
    this.productList = JSON.parse(localStorage.getItem('creativeServicesSubCategories'));
  }

  showEducation() {
    this.productList = JSON.parse(localStorage.getItem('educationSubCategories'));
  }

  showAutomotive() {
    this.productList = JSON.parse(localStorage.getItem('automotiveSubCategories'));
  }

  showHomeImprovement() {
    this.productList = JSON.parse(localStorage.getItem('homeImprovementSubCategories'));
  }

  showEntertainment() {
    this.productList = JSON.parse(localStorage.getItem('entertainmentSubCategories'));
  }

  showHealth() {
    JSON.parse(localStorage.getItem('healthSubCategories'));
  }

  goToCategoryProducts(id: any) {
    this.router.navigate(['/category-shop', id]);
  }
}
