import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category';
import { SubCategory } from '../../../models/sub-category';
import { SubCategoriesService } from '../../tools/services';
import { CategoriesService } from '../../tools/services/categories.service';
@Component({
    selector: 'app-sub-categories',
    templateUrl: './sub-categories.component.html',
    styleUrl: './sub-categories.component.css',
    standalone: false
})
export class SubCategoriesComponent {
  categories: Category[] = [];

  subCategories: Observable<Array<SubCategory>>;

  subCategories_: SubCategory[] = [];

  filteredsubCategories: SubCategory[] = [];

  public subCategoryForm: FormGroup;

  public categoryForm: FormGroup;

  success = false;

  editProduct = false;

  viewProduct = false;

  successMsg: any;

  errorMsg: any;

  selectedSubCategory: SubCategory = {} as SubCategory;

  error = false;

  deleteName: any;

  selectedId = 0;

  title: any;

  msg: any;

  mainSection = true

  deleteModal = false;

  createModal = false;

  createCategoryModal = false;

  constructor(
    private categoryService: CategoriesService,
    private subCatgeorySevice: SubCategoriesService
  ) {
    this.subCategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category_id: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.categoryService.getAllList().subscribe((res) => {
      this.categories = res.data;
      console.log('categories:', this.categories);

      this.subCategories = this.subCatgeorySevice.subCategories;
      console.log('subCategories:', this.subCategories);
      this.subCategories.forEach(category => {
        this.subCategories_ = category;
        console.log('subCategories:', this.subCategories_);
      });


      this.subCategories_.forEach((product: any) => {
        const category = this.subCategories_.filter(
          (x) => x.id == product.category_id
        );
        category.forEach((cat) => {
          product.category_name = cat.name;
        });
      });
      this.filteredsubCategories = this.subCategories_
      console.log('subCategories:', this.subCategories_);
    });


  }

  createSubCategory() {
    this.subCatgeorySevice.create(this.subCategoryForm.value).subscribe(
      (res) => {
        console.log('res', res);

        if (res.status == 'created') {
          this.subCatgeorySevice.success(res.message);
          this.createModal = false
          this.mainSection = true
          this.subCategoryForm.reset();
          this.subCategories_.forEach((product: any) => {
            const category = this.subCategories_.filter(
              (x) => x.id == product.category_id
            );
            category.forEach((cat) => {
              product.category_name = cat.name;
            });
          });
          this.filteredsubCategories = this.subCategories_
          console.log('products:', this.subCategories_);
          console.log(res.message);
        } else {
          console.log(res.message);
          // Handle the error as needed
        }
      }
    );
  }

  createCategory() {
    this.subCatgeorySevice.createCategory(this.categoryForm.value).subscribe(
      (res) => {
        console.log('res', res);

        if (res.status == 'created') {
          alert(res.message);
          console.log(res.message);
        } else {
          console.log(res.message);
          // Handle the error as needed
        }
      },
      (error) => {
        console.error(error.error.message);
        alert(error.error.message);
        // Handle the error as needed
      }
    );
    this.categoryForm.reset();
    this.createCategoryModal = false;
  }

  updateSubCategory() {
    console.log(this.subCategoryForm.value, this.selectedId);
    this.subCatgeorySevice
      .update(this.subCategoryForm.value, this.selectedId)
      .subscribe(
        (res) => {
          console.log('res', res);

          if (res.status == 'success') {
            this.subCatgeorySevice.success(res.message);
            this.editProduct = false;
            this.mainSection = true;
            this.subCategoryForm.reset()
            var index = this.subCategories_.findIndex(
              (x) => x.id === this.selectedId
            );
            this.subCategories_.splice(index, 1);

            this.subCategories_ = [...this.subCategories_, res.data];
            this.filteredsubCategories = this.subCategories_
          } else {
            console.error(Error);
          }
        },
        (error) => {
          console.error(error.message);
          alert(error.error.message);
        }
      );
  }

  hideDialog() {
    this.success = false;
    this.error = false;
    this.deleteModal = false;
    this.editProduct = false;
    this.viewProduct = false;
    this.createModal = false;
    this.mainSection = true;
  }

  showModal() {
    this.createModal = true;
    this.mainSection = false
  }

  showCategoryModal() {
    this.createCategoryModal = true;
  }

  edit(item: any) {
    this.editProduct = true;
    this.mainSection = false
    this.selectedSubCategory = item;
    this.selectedId = item.id;
    console.log(this.selectedSubCategory);
    this.subCategoryForm = new FormGroup({
      name: new FormControl(this.selectedSubCategory.name, [
        Validators.required,
      ]),
      description: new FormControl(this.selectedSubCategory.description, [
        Validators.required,
      ]),
      category_id: new FormControl(this.selectedSubCategory.category_id, [
        Validators.required,
      ]),
    });
    console.log(this.subCategoryForm.value);
  }

  view(item: any) {
    this.selectedSubCategory = item;
    this.viewProduct = true;
    this.mainSection = false
  }

  clear() {
    this.subCategoryForm.reset();
    this.createModal = false
    this.mainSection = true
  }

  delete(item: any) {
    this.deleteName = item.name;
    this.selectedId = item.id;
    this.deleteModal = true;
  }

  confirmDelete() {
    this.subCatgeorySevice.delete(this.selectedId).subscribe(
      (res) => {
        this.subCatgeorySevice.success(res.message);
        var index = this.subCategories_.findIndex((x) => x.id === this.selectedId);
        this.subCategories_.splice(index, 1);

        this.subCategories_ = [...this.subCategories_, res.data];
        this.filteredsubCategories = this.subCategories_
      }
    );

    this.deleteModal = false;
  }

  searchProducts(item: any) {
    console.log(this.subCategories)
    this.filteredsubCategories = this.subCategories_.filter(
      prod => prod?.name.toLowerCase().includes(item.toLowerCase())
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredsubCategories)
    //this.filteredProducts = this.products.filter(x => x.)
  }
}
