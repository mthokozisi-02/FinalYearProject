import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BuyerRoutes } from './buyer.routing';


@NgModule({
    imports: [
        CommonModule,
        BuyerRoutes,
        RouterModule,
        HttpClientModule,
        CurrencyPipe,
        DatePipe

    ],
    declarations: [
    ]
})
export class BuyerModule { }
