import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from '../../../models/package';
import { Seller } from '../../../models/seller';
import { Country, Roles } from '../../tools/models';
import { PackagesService, SellerRegistrationService } from '../../tools/services';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.css',
})
export class SellerComponent {
  newSeller: Seller = {} as Seller;

  countries: any[] = [];

  errorMsg: any;

  error = false;

  title: any;

  msg: any;

  roles: any[] = [];

  errorAlert = false;

  packages: Package[] = [];

  public sellerForm: FormGroup;
  package: any;
  errorMessage = '';
  successMessage = '';
  bank: any;

  constructor(
    private sellerService: SellerRegistrationService,
    private packageService: PackagesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sellerForm = new FormGroup({
      business_name: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      id_number: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password_confirmation: new FormControl('', [Validators.required]),
      bank: new FormControl('', [Validators.required]),
      account_number: new FormControl('', [Validators.required]),
      branch: new FormControl('', [Validators.required]),
      branch_code: new FormControl('', [Validators.required]),
      paypal_email: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.packageService.getAllList().subscribe((res) => {
      this.packages = res.data;
      console.log('packages:', this.packages);
    });

    this.countries = Object.values(Country);
    this.roles = Object.values(Roles);
  }

  check() {
    if (
      this.sellerForm.value.password !==
      this.sellerForm.value.password_confirmation
    ) {
      this.errorAlert = true;
    } else {
      this.errorAlert = false;
    }
  }

  hideDialog() {
    this.error = false;
  }

  createSeller() {
    if (
      this.sellerForm.value.password !==
      this.sellerForm.value.password_confirmation
    ) {
      this.errorAlert = true;
    } else {
      this.errorAlert = false;
      console.log(this.sellerForm.value);
      this.newSeller = this.sellerForm.value;
      this.newSeller.user_id = 0;
      console.log('seller', this.newSeller);

      this.sellerService.create(this.newSeller).subscribe(
        (res) => {
          console.log('res', res);

          if (res.status == 'success') {
            this.sellerService.success('Seller created successfully');

            this.router.navigate(['/verify-email']);
          } else {
            console.log(res.message);
            // Handle the error as needed
          }
        },
        (error) => {
          console.error(error.error.message);
          alert(error.error.message);
        }
      );

      this.newSeller = {} as Seller;
    }
  }
}
