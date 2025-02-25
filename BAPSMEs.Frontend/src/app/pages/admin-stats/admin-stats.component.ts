import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent
} from "ng-apexcharts";
import { Booking } from '../../../models/booking';
import { Buyer } from '../../../models/buyer';
import { Enquire } from '../../../models/enquire';
import { Orders } from '../../../models/orders';
import { Package } from '../../../models/package';
import { Payments } from '../../../models/payments';
import { Seller } from '../../../models/seller';
import { SubOrder } from '../../../models/sub-order';
import { BuyerRegistrationService, OrdersService, PackagesService, PaymentService, SellerRegistrationService } from '../../tools/services';
import { BookService } from '../../tools/services/book.service';
import { EnquiryService } from '../../tools/services/enquiry.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  fill: ApexFill;
  colors: string[];
  yaxis?: ApexYAxis | ApexYAxis[];
  markers?: ApexMarkers;
  tooltip?: ApexTooltip;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
};

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrl: './admin-stats.component.css'
})
export class AdminStatsComponent {
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  dashboard = false;
  profile = false;
  orderstab = false;
  showPayments = false;
  showPackages = false;
  payout = false;
  users = false;

  drawer = false;

  packages: Package[] = [];

  showProductCategories = false;

  role: any;

  thisMonthOrders = 0

  amountOfThisMonthOrders = 0

  lastMonthOrders = 0

  queriesPercentageDiff: any

  bookingsPercentageDiff: any

  totalUsers = 0

  thisMonthQueries = 0

  lastMonthQueries = 0

  usersPercentageDiff: any

  thisMonthClients = 0

  lastMonthClients = 0

  clientsPercentageDiff: any

  thisMonthPayments = 0

  totalOrders = 0;

  subOrders: SubOrder[] = [];

  filteredBookings: Booking[] = [];

  lastMonthPayments = 0

  paymentsPercentageDiff: any

  ordersPercentageDiff: any

  orders: Orders[] = [];

  payments: Payments[] = []

  buyers: Buyer[] = [];

  enquiries: Enquire[] = [];

  sellers: Seller[] = [];

  bookings: Booking[] = [];

  thisMonthBookings = 0

  lastMonthBookings = 0

  thisMonthEnquiries = 0

  lastMonthEnquiries = 0

  enquiriesPercentageDiff: any

  document: any

  subscriptions: Payments[] = [];

  _sellers: Seller[] = [];

  @Input() annotations: ApexAnnotations;
  @Input() colors: string[];
  @Input() dataLabels: ApexDataLabels;
  @Input() series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  @Input() stroke: ApexStroke;
  @Input() labels: string[];
  @Input() legend: ApexLegend;
  @Input() fill: ApexFill;
  @Input() tooltip: ApexTooltip;
  @Input() plotOptions: ApexPlotOptions;
  @Input() responsive: ApexResponsive[];
  @Input() xaxis: ApexXAxis;
  @Input() yaxis: ApexYAxis | ApexYAxis[];
  @Input() grid: ApexGrid;
  @Input() states: ApexStates;
  @Input() title: ApexTitleSubtitle;
  @Input() subtitle: ApexTitleSubtitle;
  @Input() theme: ApexTheme;

  monthlyTotals: number[] = [];

  constructor(
    private packageService: PackagesService,
    private orderService: OrdersService,
    private buyerService: BuyerRegistrationService,
    private sellerService: SellerRegistrationService,
    private paymentService: PaymentService,
    private router: Router,
    private enquiryService: EnquiryService,
    private boookingService: BookService
  ) {
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: this.monthlyTotals
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Subscriptions Throughout the Year",
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };
  }

  async ngOnInit() {
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';

    // if (sessionStorage.length == 0 || this.role != Roles.ADMIN) {
    //   this.router.navigate(['/login']);
    // }

    try {
      const monthlyTotals = await this.transformSubscriptionsToChartData();
      const monthlySellers = await this.transformSellersToChartData();
      this.chartOptions = {
        chart: {
          height: 350,
          type: "area",
          fontFamily: "Inter, sans-serif",
          dropShadow: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        title: {
          text: "Subscriptions Throughout the Year in USD$",
        },
        tooltip: {
          enabled: true,
          x: {
            show: false,
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.55,
            opacityTo: 0,
            shade: "#1C64F2",
            gradientToColors: ["#1C64F2"],
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 6,
        },
        grid: {
          show: false,
          strokeDashArray: 4,
          padding: {
            left: 2,
            right: 2,
            top: 0
          },
        },
        series: [
          {
            name: "New users",
            data: monthlyTotals,
            color: "#1A56DB",
          },
        ],
        xaxis: {
          categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          labels: {
            show: true,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          show: false,
        },
      };
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      // Provide default data or handle error
      this.chartOptions = {
        series: [{
          name: "My-series",
          data: new Array(12).fill(0)
        }],
        // ... rest of your chart options
      };
    }

    this.packageService.getAllList().subscribe((res) => {
      this.packages = res.data;
      console.log('packages:', res.data);
    });



    this.enquiryService.getAllList().subscribe((res) => {
      res.data.forEach((enquiry) => {
        enquiry.buyer_pic =
          'assets/img/user.png';
        enquiry.buyer_name = enquiry.user.name;
        enquiry.buyer_email = enquiry.user.email;
        enquiry.sub_category_name = enquiry.sub_category.name
        enquiry.product_name = enquiry.product.name
      });
      this.enquiries = res.data
      console.log('enquiries:', this.enquiries);

      this.lastMonthEnquiries = this.enquiries.filter(enquiry => {
        const userDate = new Date(enquiry.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthEnquiries = this.enquiries.filter(enquiry => {
        const userDate = new Date(enquiry.created_at);
        return userDate.getFullYear() === new Date().getFullYear() &&
          userDate.getMonth() === new Date().getMonth();
      }).length;


      // Calculate percentage difference
      if (this.lastMonthEnquiries == 0 && this.thisMonthEnquiries == 0) {
        this.enquiriesPercentageDiff = 0
      }
      else if (this.lastMonthEnquiries == 0 && this.thisMonthEnquiries >= 0) {
        this.enquiriesPercentageDiff = 100
      }
      else {
        this.paymentsPercentageDiff = (((this.thisMonthEnquiries - this.lastMonthEnquiries) / (this.lastMonthEnquiries) * 100)).toFixed(2)
      }
      console.log('enquries:', this.lastMonthEnquiries, this.thisMonthEnquiries, this.enquiriesPercentageDiff);


    });


    this.boookingService.getAllList().subscribe((res) => {
      this.bookings = res.data;
      console.log('bookings:', res.data);

      this.lastMonthBookings = this.bookings.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getFullYear() === new Date().getFullYear() &&
          bookingDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.thisMonthBookings = this.bookings.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getFullYear() === new Date().getFullYear() &&
          bookingDate.getMonth() === new Date().getMonth();
      }).length;


      // Calculate percentage difference
      if (this.lastMonthBookings == 0 && this.thisMonthBookings == 0) {
        this.bookingsPercentageDiff = 0
      }
      else if (this.lastMonthBookings == 0 && this.thisMonthBookings >= 0) {
        this.bookingsPercentageDiff = 100
      }
      else {
        this.bookingsPercentageDiff = (((this.thisMonthBookings - this.lastMonthBookings) / (this.lastMonthBookings) * 100)).toFixed(2)
      }

      console.log('bookings:', this.lastMonthBookings, this.thisMonthBookings, this.bookingsPercentageDiff);
    });


    this.paymentService.getAllList().subscribe((res) => {
      this.payments = res.data;
      this.payments = this.payments.filter(payment => payment.buyer_id != null)

      this.lastMonthPayments = this.payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getFullYear() === new Date().getFullYear() &&
          paymentDate.getMonth() === new Date().getMonth() - 1;
      }).reduce((sum, order) => sum + Number(order.amount), 0);

      this.thisMonthPayments = this.payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getFullYear() === new Date().getFullYear() &&
          paymentDate.getMonth() === new Date().getMonth();
      }).reduce((sum, order) => sum + Number(order.amount), 0);


      // Calculate percentage difference
      if (this.lastMonthPayments == 0 && this.thisMonthPayments == 0) {
        this.paymentsPercentageDiff = 0
      }
      else if (this.lastMonthPayments == 0 && this.thisMonthPayments >= 0) {
        this.paymentsPercentageDiff = 100
      }
      else {
        this.paymentsPercentageDiff = (((this.thisMonthPayments - this.lastMonthPayments) / (this.lastMonthPayments) * 100)).toFixed(2)
      }
      console.log('payment:', this.lastMonthPayments, this.thisMonthPayments, this.paymentsPercentageDiff);
    });

    this.orderService.getAllList().subscribe((res) => {
      this.subOrders = res.data;
      console.log('orders:', res.data);

      this.lastMonthOrders = this.subOrders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getFullYear() === new Date().getFullYear() &&
          orderDate.getMonth() === new Date().getMonth() - 1;
      }).length;

      this.lastMonthOrders = this.subOrders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getFullYear() === new Date().getFullYear() &&
          orderDate.getMonth() === new Date().getMonth();
      }).length;


      // Calculate percentage difference
      if (this.lastMonthOrders == 0 && this.thisMonthOrders == 0) {
        this.ordersPercentageDiff = 0
      }
      else if (this.lastMonthOrders == 0 && this.thisMonthOrders >= 0) {
        this.ordersPercentageDiff = 100
      }
      else {
        this.ordersPercentageDiff = (((this.thisMonthOrders - this.lastMonthOrders) / (this.lastMonthOrders) * 100)).toFixed(2)
      }
      console.log('orders:', this.lastMonthOrders, this.thisMonthOrders, this.ordersPercentageDiff);
    });

    this.dashboard = true;
  }

  async transformSubscriptionsToChartData(): Promise<number[]> {
    const monthlyTotals = new Array(12).fill(0);

    try {
      const response = await this.paymentService.getAllList().toPromise();
      this.payments = response.data;
      this.subscriptions = this.payments.filter(payment => payment.buyer_id == null);

      this.subscriptions.forEach(subscription => {
        const monthIndex = new Date(subscription.created_at).getMonth();
        monthlyTotals[monthIndex] += Number(subscription.amount);
      });

      return monthlyTotals;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return new Array(12).fill(0);
    }
  }

  async transformSellersToChartData(): Promise<number[]> {
    const monthlySellers = new Array(12).fill(0);

    try {
      const response = await this.sellerService.getAllList().toPromise();
      this.sellers = response.data;


      this.sellers.forEach(seller => {
        try {
          const date = new Date(seller.created_at);
          if (isNaN(date.getTime())) {
            console.warn('Invalid date found in seller data:', seller);
            return;
          }
          const monthIndex = date.getMonth();
          monthlySellers[monthIndex]++;
        } catch (error) {
          console.error('Error processing seller:', seller, error);
        }
      });
      console.log('sellers:', monthlySellers);
      return monthlySellers;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return new Array(12).fill(0);
    }
  }

  showDrawer() {
    this.drawer = true
  }

  hideDialog() {
    this.drawer = false;
  }


}
