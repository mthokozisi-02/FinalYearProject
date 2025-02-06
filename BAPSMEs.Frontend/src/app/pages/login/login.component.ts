import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpService } from '../../tools/services';
import { Roles } from '../../tools/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public loginForm: FormGroup;

  packages: any;

  packageId: any;

  bank: any;

  branch: any;

  success = false;

  successMsg: any;

  errorMsg: any;

  error = false;

  title: any;

  msg: any;

  role: any;

  bankId: any;

  branch_code: any;

  created_at: any;

  updated_at: any;

  account_no: any;

  id: any;

  constructor(private router: Router, private loginService: SignUpService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }

  ngOnInit(): void {
    sessionStorage.clear();
    console.log(sessionStorage);
  }

  toEquipmentUpload() {
    this.router.navigate(['/admin']);
  }

  login() {
    console.log(this.loginForm.value);

    this.loginService.login(this.loginForm.value).subscribe(
      (res) => {
        console.log(res);

        if (res.message === 'Login Successful') {
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('loggedUser', res.user.id);
          sessionStorage.setItem('loggedUserRole', res.user.role);
          sessionStorage.setItem('loggedUserName', res.user.name);
          sessionStorage.setItem('loggedUserEmail', res.user.email);

          this.role = res.user.role;
          if (this.role == Roles.SELLER) {
            res.user.seller.packages.forEach((element: any) => {
              this.packageId = element.id;
            });
            res.user.bank_details.forEach((element: any) => {
              this.bank = element.bank;
              this.branch = element.branch;
              this.branch_code = element.branch_code;
              this.account_no = element.account_number;
              this.created_at = element.created_at;
              this.updated_at = element.updated_at;
              this.bankId = element.id;
            });

            sessionStorage.setItem('loggedUserAccountNumber', this.account_no);
            sessionStorage.setItem('loggedUserBank', this.bank);
            sessionStorage.setItem('loggedUserBranch', this.branch);
            sessionStorage.setItem('loggedUserBranchCode', this.branch_code);
            sessionStorage.setItem('loggedUserBankDetailsId', this.bankId);
            sessionStorage.setItem(
              'loggedUserBankDetailsCreatedAt',
              this.created_at
            );
            sessionStorage.setItem(
              'loggedUserBankDetailsUpdatedAt',
              this.updated_at
            );
            sessionStorage.setItem('loggedUserPackageId', this.packageId);
          }

          console.log(sessionStorage);
          if (this.role == Roles.SELLER) {
            if (this.packageId) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/select-package']);
            }
          } else if (this.role == Roles.ADMIN) {
            this.router.navigate(['/admin-dashboard']);
          } else if (this.role == Roles.BUYER) {
            this.router.navigate(['/buyer-dashboard']);
          }
        } else {
          console.log(res.message);
          // Handle the error as needed
        }
      }
    );
  }

  hideDialog() {
    this.error = false;
    this.success = false;
  }
}
