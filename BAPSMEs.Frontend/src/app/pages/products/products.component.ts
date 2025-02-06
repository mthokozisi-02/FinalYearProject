import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCategory } from '../../../models/product-category';
import { Products } from '../../../models/products';
import { SubCategory } from '../../../models/sub-category';
import { ProductsService, SearchService, SubCategoriesService } from '../../tools/services';
import { CategoriesService } from '../../tools/services/categories.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: Products[] = [];

  filteredProducts: Products[] = []

  sellerId = 6;

  categories: ProductCategory[] = [];

  subCategories: SubCategory[] = [];

  filteredSubCategories: SubCategory[] = [];

  newProduct: Products = {} as Products;

  selectedProduct: Products = {} as Products;

  selectedCategory: ProductCategory = {} as ProductCategory;

  public productForm: FormGroup;

  success = false;

  successMsg: any;

  errorMsg: any;

  error = false;

  editProduct = false;

  selectedFile: File | null = null;

  addProduct_ = false;

  title: any;

  msg: any;

  equipment: any;

  deleteModal = false;

  createModal = false;

  deletename: any;

  viewProduct = false;

  slides: any;

  user: any;

  selectedId = 0;

  showSubCategories = false

  role: any

  showProducts = false

  productsTab = false

  constructor(
    private http: HttpClient,
    private router: Router,
    private searchService: SearchService,
    private productService: ProductsService,
    private subCategoryService: SubCategoriesService,
    private categoryService: CategoriesService,
  ) {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      sub_category_id: new FormControl('', [Validators.required]),
      image_url: new FormControl(''),
    });
  }

  ngOnInit() {
    this.productsTab = true
    this.user = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';
    console.log(this.user);

    if (!this.user) {
      this.router.navigate(['/login']);
    }

    this.categoryService.getAllList().subscribe((res) => {
      this.categories = res.data;
      console.log('categories:', this.categories);
    });

    this.subCategoryService.getAllList().subscribe((res) => {
      this.subCategories = res.data;
      console.log('sub categories:', this.subCategories);

      this.productService.getSellerProducts(this.user).subscribe((res) => {
        res.data.forEach((product: any) => {
          product.image_url =
            'https://orezon.co.zw/storage/app/public/' + product.image_url;
          const category = this.subCategories.filter(
            (x) => x.id == product.sub_category_id
          );
          category.forEach((cat) => {
            product.sub_category_name = cat.name;
          });
        });
        this.products = res.data;
        this.filteredProducts = this.products
        console.log('products:', this.products);
      });
    });


    // this.searchService.currentSearchTerm.subscribe((term) => {
    //   if (term) {
    //     this.searchEquipment(term); // Call with the updated search term
    //   } else {
    //     this.getAllEquipment();
    //   }
    // });
  }

  onFileSelected(event: any) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files!.item(0);

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.displayImage(e.target!.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  displayImage(imageData: string): void {
    // Update the image preview in the template
    this.imagePreview = imageData;
  }

  imagePreview: string = '';

  getImagePreview(): string {
    if (!this.selectedFile) {
      return 'assets/img/upload.svg';
    }
    return URL.createObjectURL(this.selectedFile);
  }

  addProduct() {
    console.log(this.productForm.value);
    this.newProduct = this.productForm.value;
    this.newProduct.user_id = this.user;
    var formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('quantity', this.productForm.value.quantity);
    formData.append('sub_category_id', this.productForm.value.sub_category_id);
    formData.append('image_url', this.selectedFile, this.selectedFile.name);
    formData.append('user_id', this.user);

    this.productService.create(formData).subscribe(
      (res) => {
        console.log('res', res);

        if (res.status == 'created') {
          this.productService.success('Product added successfully');
          this.productsTab = true;
          this.createModal = false;
          this.productForm.reset();
          this.selectedFile = null;
          this.subCategoryService.getAllList().subscribe((res) => {
            this.subCategories = res.data;
            console.log('sub categories:', this.subCategories);

            this.productService.getSellerProducts(this.user).subscribe((res) => {
              res.data.forEach((product: any) => {
                product.image_url =
                  'https://orezon.co.zw/storage/app/public/' + product.image_url;
                const category = this.subCategories.filter(
                  (x) => x.id == product.sub_category_id
                );
                category.forEach((cat) => {
                  product.sub_category_name = cat.name;
                });
              });
              this.products = res.data;
              this.filteredProducts = this.products
              console.log('products:', this.products);
            });
          });
          console.log(res.message);
        } else {
          console.log(res.message);
          // Handle the error as needed
        }
      },

    );
  }

  updateProduct() {
    console.log(this.productForm.value, this.selectedId, this.productForm.value.sub_category_id);
    const newformData = new FormData();
    newformData.append('name', this.productForm.value.name);
    newformData.append('description', this.productForm.value.description);
    newformData.append('price', this.productForm.value.price);
    newformData.append('quantity', this.productForm.value.quantity);
    newformData.append('sub_category_id', this.productForm.value.sub_category_id);
    // if (this.selectedFile) {
    //   newformData.append('image_url', this.selectedFile, this.selectedFile.name);
    // }

    this.productService
      .update(this.productForm.value, this.selectedId)
      .subscribe(
        (res) => {
          console.log('res', res);

          if (res.status == 'success') {
            this.editProduct = false;
            this.productsTab = true;
            this.productForm.reset();
            this.productService.success('Product updated successfully');
            var index = this.products.findIndex(
              (x) => x.id === this.selectedId
            );
            this.products.splice(index, 1);

            this.products = [...this.products, res.data];
            this.filteredProducts = this.products;
            this.ngOnInit();
          } else {
            console.error(Error);
          }
        }
      );
  }

  clear() {
    this.productForm.reset();
    this.selectedFile = null
    this.productsTab = true
    this.createModal = false
  }

  hideDialog() {
    this.success = false;
    this.error = false;
    this.deleteModal = false;
    this.editProduct = false;
    this.viewProduct = false;
    this.createModal = false;
  }


  edit(item: any) {
    this.editProduct = true;
    this.productsTab = false;
    this.selectedProduct = item;
    this.filteredSubCategories = this.subCategories
    this.selectedId = item.id;

    console.log(this.selectedProduct);
    this.productForm = new FormGroup({
      name: new FormControl(this.selectedProduct.name, [Validators.required]),
      description: new FormControl(this.selectedProduct.description, [
        Validators.required,
      ]),
      price: new FormControl(this.selectedProduct.price, [Validators.required]),
      quantity: new FormControl(this.selectedProduct.quantity, [
        Validators.required,
      ]),
      sub_category_id: new FormControl(this.selectedProduct.sub_category_id, [
        Validators.required,
      ]),
      category_id: new FormControl(this.selectedProduct.subcategory.category_id, [
        Validators.required,
      ]),
    });
    console.log('here', this.productForm.value);
  }

  view(item: any) {
    this.selectedProduct = item;
    this.viewProduct = true;
  }

  delete(item: any) {
    this.deletename = item.name;
    this.selectedId = item.id;
    this.deleteModal = true;
  }

  showModal() {
    this.selectedFile = null
    this.createModal = true;
    this.productsTab = false
  }

  confirmDelete() {
    this.productService.delete(this.selectedId).subscribe(
      (res) => {
        console.log('res', res);

        this.productService.success('Product deleted successfully');
        var index = this.products.findIndex((x) => x.id === this.selectedId);
        this.products.splice(index, 1);

        this.products = [...this.products, res.data];
        this.filteredProducts = this.products
      }
    );

    this.deleteModal = false;
  }

  onSelection(item: any) {
    const selectedCategory = (item.target as HTMLSelectElement).value;

    this.filteredSubCategories = this.subCategories.filter(x => x.category_id == Number(selectedCategory))

    if (this.filteredSubCategories.length > 0) {
      this.showSubCategories = true
    } else {
      this.showSubCategories = false
    }
  }

  searchProducts(item: any) {
    console.log(this.products)
    this.filteredProducts = this.products.filter(
      prod => prod?.name.toLowerCase().includes(item.toLowerCase())
    );
    // if (this.filteredProducts = []) {
    //   this.showProducts = false
    // }
    console.log(this.filteredProducts)
    //this.filteredProducts = this.products.filter(x => x.)
  }


  slideConfig = {
    slidesToShow: 4, // Adjust based on how many slides you want visible
    slidesToScroll: 1,
    dots: true,
    infinite: true,
  };
}
