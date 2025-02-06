import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard.routing';


@NgModule({
    imports: [
        CommonModule,
        DashboardRoutes,
        RouterModule,
        HttpClientModule,
        CurrencyPipe,
        DatePipe

    ],
    declarations: [

    ]
})
export class DashboardModule { }
