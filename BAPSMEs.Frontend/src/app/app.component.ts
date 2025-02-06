import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { LoaderService, AlertService } from './tools/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'orezon';
  load = false

  constructor(    public loaderService: LoaderService,
    public alertService:AlertService,){
      this.loaderService.isLoading.subscribe((resp) => {
        this.load = resp;
      });
    }

  ngOnInit(): void {
    initFlowbite();
    this.loaderService.isLoading.subscribe(resp =>{
      this.load = resp;
      if(this.load){
        this.alertService.loader();
      }else{
        this.alertService.closeLoader();
      }

    });
  }
}
