import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { ProfileComponent } from '../profile/profile.component';
import { SellerOrdersComponent } from '../seller-orders/seller-orders.component';
import { SellerPaymentsComponent } from '../seller-payments/seller-payments.component';
import { SellerStatsComponent } from '../seller-stats/seller-stats.component';
import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: '',
                component: SellerStatsComponent

            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'orders',
                component: SellerOrdersComponent
            },
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'payments',
                component: SellerPaymentsComponent
            }
        ]
    },

];

export const DashboardRoutes = RouterModule.forChild(routes);
