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

    this.productList = JSON.parse(sessionStorage.getItem('foodnBeverageSubCategories'));
  }

  showFoodnBeverage() {
    this.productList = JSON.parse(sessionStorage.getItem('foodnBeverageSubCategories'));
  }

  showRetail() {
    this.productList = JSON.parse(sessionStorage.getItem('retailSubCategories'));
  }

  showServices() {
    this.productList = JSON.parse(sessionStorage.getItem('servicesSubCategories'));
  }

  showProfessionalServices() {
    this.productList = JSON.parse(sessionStorage.getItem('professionalServicesSubCategories'));
  }

  showCreativeServices() {
    this.productList = JSON.parse(sessionStorage.getItem('creativeServicesSubCategories'));
  }

  showEducation() {
    this.productList = JSON.parse(sessionStorage.getItem('educationSubCategories'));
  }

  showAutomotive() {
    this.productList = JSON.parse(sessionStorage.getItem('automotiveSubCategories'));
  }

  showHomeImprovement() {
    this.productList = JSON.parse(sessionStorage.getItem('homeImprovementSubCategories'));
  }

  showEntertainment() {
    this.productList = JSON.parse(sessionStorage.getItem('entertainmentSubCategories'));
  }

  showHealth() {
    JSON.parse(sessionStorage.getItem('healthSubCategories'));
  }

  goToCategoryProducts(id: any) {
    this.router.navigate(['/category-shop', id]);
  }
}
