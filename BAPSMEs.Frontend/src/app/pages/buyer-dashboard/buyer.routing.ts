import { RouterModule, Routes } from '@angular/router';
import { BuyerOrdersComponent } from '../buyer-orders/buyer-orders.component';
import { BuyerPaymentComponent } from '../buyer-payment/buyer-payment.component';
import { BuyerProfileComponent } from '../buyer-profile/buyer-profile.component';
import { BuyerDashboardComponent } from './buyer-dashboard.component';


const routes: Routes = [
    {
        path: '',
        component: BuyerDashboardComponent,
        children: [
            {
                path: '',
                component: BuyerProfileComponent

            },
            {
                path: 'orders',
                component: BuyerOrdersComponent
            },
            {
                path: 'payments',
                component: BuyerPaymentComponent
            },
        ]
    },

];

export const BuyerRoutes = RouterModule.forChild(routes);
