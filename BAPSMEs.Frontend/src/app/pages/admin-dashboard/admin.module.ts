import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { AdminRoutes } from './admin.routing';
import { AdminStatsComponent } from '../admin-stats/admin-stats.component';
import { TransactionComponent } from '../transaction/transaction.component';


@NgModule({
    imports: [
        CommonModule,
        AdminRoutes,
        RouterModule,
        HttpClientModule,
        CurrencyPipe,
        DatePipe

    ],
    declarations: [
        UsersComponent,
        AdminStatsComponent,
        TransactionComponent

    ]
})
export class AdminModule { }
