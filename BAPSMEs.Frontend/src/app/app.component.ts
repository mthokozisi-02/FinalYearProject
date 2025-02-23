import { Component } from '@angular/core';
import AOS from 'aos';
import { initFlowbite } from 'flowbite';
import { AlertService, LoaderService } from './tools/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Nust Project';
  load = false

  constructor(public loaderService: LoaderService,
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
  }
}
