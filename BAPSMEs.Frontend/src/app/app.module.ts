import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule, DecimalPipe } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AuthInterceptor } from '../auth/AuthInterceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AdminPaymentComponent } from './pages/admin-payment/admin-payment.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BrokerComponent } from './pages/broker/broker.component';
import { BuyerDashboardComponent } from './pages/buyer-dashboard/buyer-dashboard.component';
import { BuyerOrdersComponent } from './pages/buyer-orders/buyer-orders.component';
import { BuyerPaymentComponent } from './pages/buyer-payment/buyer-payment.component';
import { BuyerProfileComponent } from './pages/buyer-profile/buyer-profile.component';
import { BuyerComponent } from './pages/buyer/buyer.component';
import { CartComponent } from './pages/cart/cart.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryShopComponent } from './pages/category-shop/category-shop.component';
import { CheckOutComponent } from './pages/check-out/check-out.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DashboardNavBarComponent } from './pages/dashboard-nav-bar/dashboard-nav-bar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmailVerifiedComponent } from './pages/email-verified/email-verified.component';
import { EquipmentCategoriesComponent } from './pages/equipment-categories/equipment-categories.component';
import { FooterComponent } from './pages/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { MetalsComponent } from './pages/metals/metals.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PackagesComponent } from './pages/packages/packages.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { QuotationComponent } from './pages/quotation/quotation.component';
import { RegisterComponent } from './pages/register/register.component';
import { SearchComponent } from './pages/search/search.component';
import { SelectPackageComponent } from './pages/select-package/select-package.component';
import { SellerCheckoutComponent } from './pages/seller-checkout/seller-checkout.component';
import { SellerOrdersComponent } from './pages/seller-orders/seller-orders.component';
import { SellerPaymentsComponent } from './pages/seller-payments/seller-payments.component';
import { SellerPayoutsComponent } from './pages/seller-payouts/seller-payouts.component';
import { SellerStatsComponent } from './pages/seller-stats/seller-stats.component';
import { SellerTermsAndConditionsComponent } from './pages/seller-terms-and-conditions/seller-terms-and-conditions.component';
import { SellerComponent } from './pages/seller/seller.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SubCategoriesComponent } from './pages/sub-categories/sub-categories.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { TopNavComponent } from './pages/top-nav/top-nav.component';
import { VerificationErrorComponent } from './pages/verification-error/verification-error.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ErrorInterceptor, LoaderInterceptor } from './tools/helpers';
import { AlertService } from './tools/services';


@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    SearchComponent,
    CategoriesComponent,
    ProductsComponent,
    LoginComponent,
    CategoryShopComponent,
    AdminComponent,
    MetalsComponent,
    BrokerComponent,
    BuyerComponent,
    PackagesComponent,
    SellerComponent,
    SelectPackageComponent,
    DashboardComponent,
    SignUpComponent,
    ProfileComponent,
    NavBarComponent,
    OrdersComponent,
    FooterComponent,
    RegisterComponent,
    EquipmentCategoriesComponent,
    AboutUsComponent,
    TermsAndConditionsComponent,
    SellerTermsAndConditionsComponent,
    ContactUsComponent,
    AdminDashboardComponent,
    BuyerDashboardComponent,
    SubCategoriesComponent,
    BuyerOrdersComponent,
    CartComponent,
    BuyerProfileComponent,
    SellerOrdersComponent,
    SellerPaymentsComponent,
    BuyerPaymentComponent,
    AdminPaymentComponent,
    SellerPayoutsComponent,
    SellerCheckoutComponent,
    CheckOutComponent,
    AdminOrdersComponent,
    QuotationComponent,
    EmailVerifiedComponent,
    VerificationErrorComponent,
    VerifyEmailComponent,
    DashboardNavBarComponent,
    SellerStatsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    DecimalPipe,
    NgxPayPalModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
  ],
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }, AlertService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
