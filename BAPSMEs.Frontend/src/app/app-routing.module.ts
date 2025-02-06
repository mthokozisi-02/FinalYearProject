import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BrokerComponent } from './pages/broker/broker.component';
import { BuyerComponent } from './pages/buyer/buyer.component';
import { CartComponent } from './pages/cart/cart.component';
import { CategoryShopComponent } from './pages/category-shop/category-shop.component';
import { CheckOutComponent } from './pages/check-out/check-out.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { EmailVerifiedComponent } from './pages/email-verified/email-verified.component';
import { LoginComponent } from './pages/login/login.component';
import { MetalsComponent } from './pages/metals/metals.component';
import { PackagesComponent } from './pages/packages/packages.component';
import { ProductsComponent } from './pages/products/products.component';
import { QuotationComponent } from './pages/quotation/quotation.component';
import { SearchComponent } from './pages/search/search.component';
import { SelectPackageComponent } from './pages/select-package/select-package.component';
import { SellerCheckoutComponent } from './pages/seller-checkout/seller-checkout.component';
import { SellerTermsAndConditionsComponent } from './pages/seller-terms-and-conditions/seller-terms-and-conditions.component';
import { SellerComponent } from './pages/seller/seller.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { TopNavComponent } from './pages/top-nav/top-nav.component';
import { VerificationErrorComponent } from './pages/verification-error/verification-error.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';


const routes: Routes = [
  { path: '', component: TopNavComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./pages/admin-dashboard/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'buyer-dashboard',
    loadChildren: () => import('./pages/buyer-dashboard/buyer.module').then(m => m.BuyerModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dasboard.module').then(m => m.DashboardModule)
  },
  { path: 'metals', component: MetalsComponent },
  { path: 'broker', component: BrokerComponent },
  { path: 'buyer', component: BuyerComponent },
  { path: 'packages', component: PackagesComponent },
  { path: 'seller', component: SellerComponent },
  { path: 'select-package', component: SelectPackageComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'category-shop/:id', component: CategoryShopComponent },
  { path: 'checkout', component: CheckOutComponent },
  { path: 'seller-checkout', component: SellerCheckoutComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'verified', component: EmailVerifiedComponent },
  { path: 'verification-error', component: VerificationErrorComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'quotation', component: QuotationComponent },

  {
    path: 'seller-terms-and-conditions',
    component: SellerTermsAndConditionsComponent,
  },
  {
    path: 'top-nav',
    component: TopNavComponent,
    children: [
      // { path: 'top-nav', component: TopNavComponent },
      { path: 'search', component: SearchComponent },
      { path: 'products', component: ProductsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
