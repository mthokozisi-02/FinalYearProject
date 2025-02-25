import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminStatsComponent } from '../admin-stats/admin-stats.component';
import { TransactionComponent } from '../transaction/transaction.component';
import { UsersComponent } from '../users/users.component';
import { AdminRoutes } from './admin.routing';


@NgModule({
    imports: [
        CommonModule,
        AdminRoutes,
        RouterModule,
        NgApexchartsModule,
        HttpClientModule,
        CurrencyPipe,
        DatePipe

    ],
    declarations: [
        UsersComponent,
        AdminStatsComponent,
        TransactionComponent

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }
