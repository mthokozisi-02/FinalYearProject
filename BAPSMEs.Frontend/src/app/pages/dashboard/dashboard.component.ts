import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: false
})
export class DashboardComponent {


  drawer = false;


  showDrawer() {
    this.drawer = true;
  }

  hideDialog() {
    this.drawer = false;
  }

}
