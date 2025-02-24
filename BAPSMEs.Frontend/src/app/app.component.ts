import { Component } from '@angular/core';
import AOS from 'aos';
import { initFlowbite } from 'flowbite';
import { Observable } from 'rxjs';
import { SubCategory } from '../models/sub-category';
import { AlertService, LoaderService, SubCategoriesService } from './tools/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Nust Project';
  load = false

  subCategories: Observable<Array<SubCategory>>;

  constructor(public loaderService: LoaderService, private subCatgeorySevice: SubCategoriesService,
    public alertService: AlertService,) {
    this.loaderService.isLoading.subscribe((resp) => {
      this.load = resp;
    });
  }

  ngOnInit(): void {
    initFlowbite();
    AOS.init({
      once: false
    });
    this.loaderService.isLoading.subscribe(resp => {
      this.load = resp;
      if (this.load) {
        this.alertService.loader();
      } else {
        this.alertService.closeLoader();
      }

    });

    this.subCategories = this.subCatgeorySevice.subCategories;
    this.subCategories.forEach(category => {
      category.forEach(cat => {
        cat.image_url = 'http://127.0.0.1:8000/storage/' + cat.image_url;
        sessionStorage.setItem('subCategories', JSON.stringify(category));
      });

      sessionStorage.setItem('foodnBeverageSubCategories', JSON.stringify(category.filter((x) => x.category_id == 2)));
      sessionStorage.setItem('retailSubCategories', JSON.stringify(category.filter((x) => x.category_id == 3)));
      sessionStorage.setItem('servicesSubCategories', JSON.stringify(category.filter((x) => x.category_id == 4)));
      sessionStorage.setItem('professionalServicesSubCategories', JSON.stringify(category.filter((x) => x.category_id == 5)));
      sessionStorage.setItem('creativeServicesSubCategories', JSON.stringify(category.filter((x) => x.category_id == 6)));
      sessionStorage.setItem('educationSubCategories', JSON.stringify(category.filter((x) => x.category_id == 7)));
      sessionStorage.setItem('automotiveSubCategories', JSON.stringify(category.filter((x) => x.category_id == 8)));
      sessionStorage.setItem('homeImprovementSubCategories', JSON.stringify(category.filter((x) => x.category_id == 9)));
      sessionStorage.setItem('entertainmentSubCategories', JSON.stringify(category.filter((x) => x.category_id == 10)));
      sessionStorage.setItem('healthSubCategories', JSON.stringify(category.filter((x) => x.category_id == 11)));

    });

  }
}
