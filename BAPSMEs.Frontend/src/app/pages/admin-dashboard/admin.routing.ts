import { RouterModule, Routes } from '@angular/router';
import { AdminOrdersComponent } from '../admin-orders/admin-orders.component';
import { AdminPaymentComponent } from '../admin-payment/admin-payment.component';
import { AdminStatsComponent } from '../admin-stats/admin-stats.component';
import { PackagesComponent } from '../packages/packages.component';
import { SellerPayoutsComponent } from '../seller-payouts/seller-payouts.component';
import { SubCategoriesComponent } from '../sub-categories/sub-categories.component';
import { TransactionComponent } from '../transaction/transaction.component';
import { UsersComponent } from '../users/users.component';
import { AdminDashboardComponent } from './admin-dashboard.component';


const routes: Routes = [
    {
        path: '',
        component: AdminDashboardComponent,
        children: [
            {
                path: '',
                component: AdminStatsComponent

            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'orders',
                component: AdminOrdersComponent
            },
            {
                path: 'categories',
                component: SubCategoriesComponent
            },
            {
                path: 'payments',
                component: AdminPaymentComponent
            },
            {
                path: 'packages',
                component: PackagesComponent
            },
            {
                path: 'payouts',
                component: SellerPayoutsComponent
            },
            {
                path: 'transactions',
                component: TransactionComponent
            },
        ]
    },

];

export const AdminRoutes = RouterModule.forChild(routes);
