import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Buyer } from '../../../models/buyer';
import { User } from '../../../models/user';
import { Country } from '../../tools/models';
import { BuyerRegistrationService } from '../../tools/services';
@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styleUrl: './buyer-profile.component.css',
})
export class BuyerProfileComponent {
  countries: any[] = [];

  editProfileModal = false;

  public buyerForm: FormGroup;

  user: User = {} as User;

  success = false;

  successMsg: any;

  errorMsg: any;

  error = false;

  title: any;

  msg: any;

  curentBuyerDetails: Buyer = {} as Buyer;

  buyers: Buyer[] = [];

  role: any;


  profileSection = false

  constructor(
    private router: Router,
    private buyerService: BuyerRegistrationService
  ) {
    this.buyerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      id_number: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  ngOnInit(): void {
    this.profileSection = true

    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';
    this.user.name = sessionStorage.getItem('loggedUserName') || '{}';
    this.user.email = sessionStorage.getItem('loggedUserEmail') || '{}';

    this.buyerService.getAllList().subscribe((res) => {
      this.buyers = res.data.filter((x) => x.user_id == this.user.id);
      this.buyers.forEach((buyer) => {
        this.curentBuyerDetails = buyer;
        this.curentBuyerDetails.profile_pic =
          'assets/img/user.png';
      });
      console.log('buyer:', this.curentBuyerDetails);
    });

    this.countries = Object.values(Country);
  }

  edit() {
    this.buyerForm = new FormGroup({
      country: new FormControl(this.curentBuyerDetails.country, [
        Validators.required,
      ]),
      id_number: new FormControl(this.curentBuyerDetails.id_number, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
      ]),
      phone: new FormControl(this.curentBuyerDetails.phone, [
        Validators.required,
        Validators.minLength(10),
      ]),
      address: new FormControl(this.curentBuyerDetails.address, [
        Validators.required,
        Validators.minLength(10),
      ]),
    });

    console.log('yes', this.buyerForm);

    this.editProfileModal = true;
    this.profileSection = false
  }

  update() {
    this.buyerService
      .update(this.buyerForm.value, this.curentBuyerDetails.id)
      .subscribe(
        (res) => {
          console.log(res)
          if (res.status == 'success') {
            console.log(res.message);
            this.editProfileModal = false;
            this.profileSection = true
            this.buyerService.success(res.message);
            this.ngOnInit();
          } else {
            console.error(Error);
          }
        },
        (error) => {
          console.error(error.error.message);
          this.buyerService.error(error.error.message);
        }
      );
  }

  clear() {
    this.buyerForm.reset();
    this.profileSection = true
    this.editProfileModal = false
  }

  hideDialog() {
    this.success = false;
    this.error = false;
    this.editProfileModal = false;
  }
}
