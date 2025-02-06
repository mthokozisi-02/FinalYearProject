import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Package } from '../../../models/package';
import { User } from '../../../models/user';
import { UserPackage } from '../../../models/user-package';
import { PackagesService, SignUpService, SellerCartService } from '../../tools/services';


@Component({
  selector: 'app-select-package',
  templateUrl: './select-package.component.html',
  styleUrl: './select-package.component.css',
})
export class SelectPackageComponent {
  packages: Package[] = [];

  user: User = {} as User

  userPackage: UserPackage = {} as UserPackage;

  constructor(
    private packageService: PackagesService,
    private router: Router,
    private userService: SignUpService,
    private sellerCartService: SellerCartService
  ) { }

  ngOnInit(): void {
    this.user.id = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');

    if (sessionStorage.length == 0) {
      this.router.navigate(['/login']);
    }

    this.packageService.getAllList().subscribe((res) => {
      this.packages = res.data;
      console.log('packages:', this.packages);
    });
  }

  selectPackage(item: any) {
    var userPackageId = 0
    this.user.package_id = item.id
    console.log('user:', this.user)
    this.packageService.selectPackage(this.user).subscribe(
      (res) => {
        console.log(res);
        res.data.packages.forEach(pack => {
          pack.user_packages.filter(x => x.user_id == res.data.user_id).forEach(user => {
            userPackageId = user.id
          })
        })
        if (res.status === 'success') {
          this.sellerCartService.addToSupplierCart(item, item.price, 1, userPackageId);
          if (this.sellerCartService.getCurrentCart().length != 0) {
            this.router.navigate(['/seller-checkout']);
          }
        }
      })

  }
}
