import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductCategory } from '../../../models/product-category';
import { Products } from '../../../models/products';
import { SubCategory } from '../../../models/sub-category';
import { ProductsService, SearchService, SubCategoriesService } from '../../tools/services';
import { CategoriesService } from '../../tools/services/categories.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  standalone: false
})
export class ProductsComponent implements OnInit {
  products: Products[] = [];

  filteredProducts: Products[] = []

  sellerId = 6;

  categories: ProductCategory[] = [];

  subCategories: Observable<Array<SubCategory>>;

  subCategories_: SubCategory[] = [];

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

  selectedFile2: File | null = null;

  selectedFile3: File | null = null;

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

  serviceType: any

  role: any

  showProducts = false

  productsTab = false

  selectedCategoryOption: any

  selectedSubCategoryOption: any

  constructor(
    private http: HttpClient,
    private router: Router,
    private searchService: SearchService,
    private productService: ProductsService,
    private subCatgeorySevice: SubCategoriesService,
    private categoryService: CategoriesService,
  ) {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      sub_category_id: new FormControl('', [Validators.required]),
      service_type: new FormControl('', [Validators.required]),
      product_type: new FormControl('', [Validators.required]),
      project_type: new FormControl('', [Validators.required]),
      project_scope: new FormControl('', [Validators.required]),
      preparation_time: new FormControl(0, [Validators.required]),
      minimum_order: new FormControl(0, [Validators.required]),
      delivery_options: new FormControl('', [Validators.required]),
      dietary_information: new FormControl('', [Validators.required]),
      inventory_status: new FormControl('', [Validators.required]),
      shipping_options: new FormControl('', [Validators.required]),
      return_policy: new FormControl('', [Validators.required]),
      warranty_information: new FormControl('', [Validators.required]),
      service_duration: new FormControl(0, [Validators.required]),
      location_type: new FormControl('', [Validators.required]),
      service_area: new FormControl('', [Validators.required]),
      qualification: new FormControl('', [Validators.required]),
      expertise_level: new FormControl('', [Validators.required]),
      session_format: new FormControl('', [Validators.required]),
      language_support: new FormControl('', [Validators.required]),
      experience_level: new FormControl('', [Validators.required]),
      turnaround_time: new FormControl('', [Validators.required]),
      file_formats: new FormControl('', [Validators.required]),
      usage_rights: new FormControl('', [Validators.required]),
      vehicle_type: new FormControl('', [Validators.required]),
      service_level: new FormControl('', [Validators.required]),
      parts_included: new FormControl('', [Validators.required]),
      loaner_vehicle: new FormControl('', [Validators.required]),
      license_number: new FormControl('', [Validators.required]),
      insurance_coverage: new FormControl('', [Validators.required]),
      warranty_period: new FormControl('', [Validators.required]),
      capacity: new FormControl(0, [Validators.required]),
      age_restriction: new FormControl('', [Validators.required]),
      equipment_provided: new FormControl('', [Validators.required]),
      catering_options: new FormControl('', [Validators.required]),
      parking_availability: new FormControl('', [Validators.required]),
      cons_project_type: new FormControl('', [Validators.required]),
      service_scope: new FormControl('', [Validators.required]),
      payment_term: new FormControl('', [Validators.required]),
      coverage_type: new FormControl('', [Validators.required]),
      policy_term: new FormControl('', [Validators.required]),
      premium_frequency: new FormControl('', [Validators.required]),
      coverage_limit: new FormControl(0, [Validators.required]),
      account_type: new FormControl('', [Validators.required]),
      minimum_balance: new FormControl(0, [Validators.required]),
      interest_rate: new FormControl(0, [Validators.required]),
      fees: new FormControl(0, [Validators.required]),
      transaction_limit: new FormControl(0, [Validators.required]),
      property_types: new FormControl('', [Validators.required]),
      revisions_included: new FormControl('', [Validators.required]),
      deductible_amount: new FormControl(0, [Validators.required]),
      geographic_area: new FormControl('', [Validators.required]),
      permit_handling: new FormControl('', [Validators.required]),
      certifications: new FormControl('', [Validators.required]),
      management_fee: new FormControl(0, [Validators.required]),
      response_time: new FormControl('', [Validators.required]),
      appointment: new FormControl('', [Validators.required]),
      course_format: new FormControl('', [Validators.required]),
      class_size: new FormControl('', [Validators.required]),
      materials_included: new FormControl('', [Validators.required]),
      prerequisites: new FormControl('', [Validators.required]),
      image_url: new FormControl(''),
    });
  }

  ngOnInit() {
    this.productsTab = true
    this.user = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    this.role = sessionStorage.getItem('loggedUserRole') || '{}';
    console.log(this.user);

    this.selectedCategoryOption = 1


    if (!this.user) {
      this.router.navigate(['/login']);
    }

    this.categoryService.getAllList().subscribe((res) => {
      this.categories = res.data;
      console.log('categories:', this.categories);
      this.productForm.value.category = this.categories[0].name
    });

    this.subCategories_ = JSON.parse(localStorage.getItem('subCategories'));
    this.filteredSubCategories = this.subCategories_.filter(x => x.category_id == Number(this.selectedCategoryOption))

    this.selectedSubCategoryOption = 1

    this.productService.getSellerProducts(this.user).subscribe((res) => {
      res.data.forEach((product: any) => {
        product.image_url =
          'http://127.0.0.1:8000/storage/' + product.image_url;
        product.image_url2 =
          'http://127.0.0.1:8000/storage/' + product.image_url2;
        product.image_url3 =
          'http://127.0.0.1:8000/storage/' + product.image_url3;
        const category = this.subCategories_.filter(
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


    // this.searchService.currentSearchTerm.subscribe((term) => {
    //   if (term) {
    //     this.searchEquipment(term); // Call with the updated search term
    //   } else {
    //     this.getAllEquipment();
    //   }
    // });
  }

  onFileSelected(event: any) {
    console.log('1')
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

  onFileSelected2(event: any) {
    console.log('2')
    const target = event.target as HTMLInputElement;
    this.selectedFile2 = target.files!.item(0);

    if (this.selectedFile2) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.displayImage2(e.target!.result as string);
      };
      reader.readAsDataURL(this.selectedFile2);
    }
  }

  onFileSelected3(event: any) {
    const target = event.target as HTMLInputElement;
    this.selectedFile3 = target.files!.item(0);

    if (this.selectedFile3) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.displayImage3(e.target!.result as string);
      };
      reader.readAsDataURL(this.selectedFile3);
    }
  }

  displayImage(imageData: string): void {
    // Update the image preview in the template
    this.imagePreview = imageData;
  }

  displayImage2(imageData: string): void {
    // Update the image preview in the template
    this.imagePreview = imageData;
  }

  displayImage3(imageData: string): void {
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

  getImagePreview2(): string {
    if (!this.selectedFile2) {
      return 'assets/img/upload.svg';
    }
    return URL.createObjectURL(this.selectedFile2);
  }

  getImagePreview3(): string {
    if (!this.selectedFile3) {
      return 'assets/img/upload.svg';
    }
    return URL.createObjectURL(this.selectedFile3);
  }

  addProduct() {
    console.log(this.productForm.value);
    this.newProduct = this.productForm.value;
    this.newProduct.user_id = this.user;
    var formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('service_type', this.productForm.value.service_type);
    formData.append('product_type', this.productForm.value.product_type);
    formData.append('project_type', this.productForm.value.project_type);
    formData.append('project_type', this.productForm.value.project_type);
    formData.append('project_scope', this.productForm.value.project_scope);
    formData.append('preparation_time', this.productForm.value.preparation_time);
    formData.append('minimum_order', this.productForm.value.minimum_order);
    formData.append('delivery_options', this.productForm.value.delivery_options);
    formData.append('dietary_information', this.productForm.value.dietary_information);
    formData.append('inventory_status', this.productForm.value.inventory_status);
    formData.append('shipping_options', this.productForm.value.shipping_options);
    formData.append('return_policy', this.productForm.value.return_policy);
    formData.append('warranty_information', this.productForm.value.warranty_information);
    formData.append('service_duration', this.productForm.value.service_duration);
    formData.append('location_type', this.productForm.value.location_type);
    formData.append('service_area', this.productForm.value.service_area);
    formData.append('qualifications', this.productForm.value.qualifications);
    formData.append('expertise_level', this.productForm.value.expertise_level);
    formData.append('session_format', this.productForm.value.session_format);
    formData.append('language_support', this.productForm.value.language_support);
    formData.append('experience_level', this.productForm.value.experience_level);
    formData.append('turnaround_time', this.productForm.value.turnaround_time);
    formData.append('file_formats', this.productForm.value.file_formats);
    formData.append('usage_rights', this.productForm.value.usage_rights);
    formData.append('vehicle_types', this.productForm.value.vehicle_types);
    formData.append('service_level', this.productForm.value.service_level);
    formData.append('warranty_offered', this.productForm.value.warranty_offered);
    formData.append('parts_included', this.productForm.value.parts_included);
    formData.append('loaner_vehicle', this.productForm.value.loaner_vehicle);
    formData.append('license_number', this.productForm.value.license_number);
    formData.append('insurance_coverage', this.productForm.value.insurance_coverage);
    formData.append('warranty_period', this.productForm.value.warranty_period);
    formData.append('capacity', this.productForm.value.capacity);
    formData.append('age_restrictions', this.productForm.value.age_restrictions);
    formData.append('equipment_provided', this.productForm.value.equipment_provided);
    formData.append('catering_options', this.productForm.value.catering_options);
    formData.append('parking_availability', this.productForm.value.parking_availability);
    formData.append('cons_project_type', this.productForm.value.cons_project_type);
    formData.append('service_scope', this.productForm.value.service_scope);
    formData.append('payment_term', this.productForm.value.payment_term);
    formData.append('coverage_type', this.productForm.value.coverage_type);
    formData.append('policy_term', this.productForm.value.policy_term);
    formData.append('premium_frequency', this.productForm.value.premium_frequency);
    formData.append('coverage_limit', this.productForm.value.coverage_limit);
    formData.append('account_type', this.productForm.value.account_type);
    formData.append('minimum_balance', this.productForm.value.minimum_balance);
    formData.append('interest_rate', this.productForm.value.interest_rate);
    formData.append('fees', this.productForm.value.fees);
    formData.append('transaction_limit', this.productForm.value.transaction_limit);
    formData.append('property_types', this.productForm.value.property_types);
    formData.append('revisions_included', this.productForm.value.revisions_included);
    formData.append('deductible_amount', this.productForm.value.deductible_amount);
    formData.append('geographic_area', this.productForm.value.geographic_area);
    formData.append('permit_handling', this.productForm.value.permit_handling);
    formData.append('certifications', this.productForm.value.certifications);
    formData.append('management_fee', this.productForm.value.management_fee);
    formData.append('response_time', this.productForm.value.response_time);
    formData.append('appointment', this.productForm.value.appointment);
    formData.append('course_format', this.productForm.value.course_format);
    formData.append('skill_level', this.productForm.value.skill_level);
    formData.append('class_size', this.productForm.value.class_size);
    formData.append('materials_included', this.productForm.value.materials_included);
    formData.append('prerequisites', this.productForm.value.prerequisites);
    formData.append('sub_category_id', this.selectedSubCategoryOption);
    formData.append('image_url', this.selectedFile, this.selectedFile.name);
    formData.append('image_url2', this.selectedFile2, this.selectedFile2.name);
    formData.append('image_url3', this.selectedFile3, this.selectedFile3.name);
    formData.append('user_id', this.user);
    // if (this.productForm.value.sub_category_id == 5 || this.productForm.value.sub_category_id == 17 || this.productForm.value.sub_category_id == 18 || this.productForm.value.sub_category_id == 22 || this.productForm.value.sub_category_id == 21 || this.productForm.value.sub_category_id == 1) {
    //   formData.append('bookable', 'true');
    // } else {
    //   formData.append('bookable', 'false');
    // }

    this.productService.create(formData).subscribe(
      (res) => {
        console.log('res', res);

        if (res.status == 'created') {
          this.productService.success('Product added successfully');
          this.productsTab = true;
          this.createModal = false;
          this.productForm.reset();
          this.selectedFile = null;
          this.selectedFile2 = null
          this.selectedFile3 = null

          this.ngOnInit();
          console.log(res.message);
        } else {
          console.log(res.message);
          // Handle the error as needed
        }
      },

    );

    this.productForm.reset();
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

  splitDescription(description: string, wordsPerLine: number): string[] {
    if (!description) return [];

    const words = description.split(' '); // Split into words
    const lines = [];
    console.log(words)

    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    console.log(lines)

    return lines;
  }

  clear() {
    this.productForm.reset();
    this.selectedFile = null
    this.productsTab = true
    this.createModal = false
    this.editProduct = false
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
    this.filteredSubCategories = this.subCategories_
    this.selectedId = item.id;
    this.selectedCategoryOption = this.selectedProduct.subcategory.category_id
    this.selectedSubCategoryOption = this.selectedProduct.sub_category_id

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
      service_type: new FormControl(this.selectedProduct.service_type, [Validators.required]),
      product_type: new FormControl(this.selectedProduct.product_type, [Validators.required]),
      project_type: new FormControl(this.selectedProduct.project_type, [Validators.required]),
      project_scope: new FormControl(this.selectedProduct.project_scope, [Validators.required]),
      preparation_time: new FormControl(this.selectedProduct.preparation_time || 0, [Validators.required]),
      minimum_order: new FormControl(this.selectedProduct.minimum_order || 0, [Validators.required]),
      delivery_options: new FormControl(this.selectedProduct.delivery_options || '', [Validators.required]),
      dietary_information: new FormControl(this.selectedProduct.dietary_information || '', [Validators.required]),
      inventory_status: new FormControl(this.selectedProduct.inventory_status || '', [Validators.required]),
      shipping_options: new FormControl(this.selectedProduct.shipping_options || '', [Validators.required]),
      return_policy: new FormControl(this.selectedProduct.return_policy || '', [Validators.required]),
      warranty_information: new FormControl(this.selectedProduct.warranty_information || '', [Validators.required]),
      service_duration: new FormControl(this.selectedProduct.service_duration || 0, [Validators.required]),
      location_type: new FormControl(this.selectedProduct.location_type || '', [Validators.required]),
      service_area: new FormControl(this.selectedProduct.service_area || '', [Validators.required]),
      qualification: new FormControl(this.selectedProduct.qualification || '', [Validators.required]),
      expertise_level: new FormControl(this.selectedProduct.expertise_level || '', [Validators.required]),
      session_format: new FormControl(this.selectedProduct.session_format || '', [Validators.required]),
      language_support: new FormControl(this.selectedProduct.language_support || '', [Validators.required]),
      experience_level: new FormControl(this.selectedProduct.experience_level || '', [Validators.required]),
      turnaround_time: new FormControl(this.selectedProduct.turnaround_time || '', [Validators.required]),
      file_formats: new FormControl(this.selectedProduct.file_formats || '', [Validators.required]),
      usage_rights: new FormControl(this.selectedProduct.usage_rights || '', [Validators.required]),
      vehicle_types: new FormControl(this.selectedProduct.vehicle_type || '', [Validators.required]),
      service_level: new FormControl(this.selectedProduct.service_level || '', [Validators.required]),
      parts_included: new FormControl(this.selectedProduct.parts_included || '', [Validators.required]),
      loaner_vehicle: new FormControl(this.selectedProduct.loaner_vehicle || '', [Validators.required]),
      license_number: new FormControl(this.selectedProduct.license_number || '', [Validators.required]),
      insurance_coverage: new FormControl(this.selectedProduct.insurance_coverage || '', [Validators.required]),
      warranty_period: new FormControl(this.selectedProduct.warranty_period || '', [Validators.required]),
      capacity: new FormControl(this.selectedProduct.capacity || 0, [Validators.required]),
      age_restriction: new FormControl(this.selectedProduct.age_restriction || '', [Validators.required]),
      equipment_provided: new FormControl(this.selectedProduct.equipment_provided || '', [Validators.required]),
      catering_options: new FormControl(this.selectedProduct.catering_options || '', [Validators.required]),
      parking_availability: new FormControl(this.selectedProduct.parking_availability || '', [Validators.required]),
      cons_project_type: new FormControl(this.selectedProduct.cons_project_type || '', [Validators.required]),
      service_scope: new FormControl(this.selectedProduct.service_scope || '', [Validators.required]),
      payment_term: new FormControl(this.selectedProduct.payment_term || '', [Validators.required]),
      coverage_type: new FormControl(this.selectedProduct.coverage_type || '', [Validators.required]),
      policy_term: new FormControl(this.selectedProduct.policy_term || '', [Validators.required]),
      premium_frequency: new FormControl(this.selectedProduct.premium_frequency || '', [Validators.required]),
      coverage_limit: new FormControl(this.selectedProduct.coverage_limit || 0, [Validators.required]),
      account_type: new FormControl(this.selectedProduct.account_type || '', [Validators.required]),
      minimum_balance: new FormControl(this.selectedProduct.minimum_balance || 0, [Validators.required]),
      interest_rate: new FormControl(this.selectedProduct.interest_rate || 0, [Validators.required]),
      fees: new FormControl(this.selectedProduct.fees || 0, [Validators.required]),
      transaction_limit: new FormControl(this.selectedProduct.transaction_limit || 0, [Validators.required]),
      property_types: new FormControl(this.selectedProduct.property_types || '', [Validators.required]),
      revisions_included: new FormControl(this.selectedProduct.revisions_included || '', [Validators.required]),
      deductible_amount: new FormControl(this.selectedProduct.deductible_amount || 0, [Validators.required]),
      geographic_area: new FormControl(this.selectedProduct.geographic_area || '', [Validators.required]),
      permit_handling: new FormControl(this.selectedProduct.permit_handling || '', [Validators.required]),
      certifications: new FormControl(this.selectedProduct.certifications || '', [Validators.required]),
      management_fee: new FormControl(this.selectedProduct.management_fee || 0, [Validators.required]),
      response_time: new FormControl(this.selectedProduct.response_time || '', [Validators.required]),
      appointment: new FormControl(this.selectedProduct.appointment || '', [Validators.required]),
      course_format: new FormControl(this.selectedProduct.course_format || '', [Validators.required]),
      class_size: new FormControl(this.selectedProduct.class_size || '', [Validators.required]),
      materials_included: new FormControl(this.selectedProduct.materials_included || '', [Validators.required]),
      prerequisites: new FormControl(this.selectedProduct.prerequisites || '', [Validators.required]),
    });
    console.log('here', this.productForm.value);
  }

  view(item: any) {
    this.selectedProduct = item;
    this.selectedCategoryOption = this.selectedProduct.subcategory.category_id
    this.selectedSubCategoryOption = this.selectedProduct.sub_category_id
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
    this.selectedCategoryOption = (item.target as HTMLSelectElement).value;
    console.log(this.selectedCategoryOption)
    this.selectedSubCategoryOption = null

    this.filteredSubCategories = this.subCategories_.filter(x => x.category_id == Number(this.selectedCategoryOption))
    this.selectedSubCategoryOption = this.filteredSubCategories[0].id

    if (this.filteredSubCategories.length > 0) {
      this.showSubCategories = true
    } else {
      this.showSubCategories = false
    }
  }

  onsubSelection(item: any) {
    console.log('what')
    this.selectedSubCategoryOption = (item.target as HTMLSelectElement).value;
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
