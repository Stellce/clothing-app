import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  InputSignal, OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Category} from "../../../categories/category.model";
import {finalize, map, startWith, switchMap} from "rxjs";
import {CategoriesService} from "../../../categories/categories.service";
import {EmployeeService} from "../../employee.service";
import {ItemsService} from "../../../item/items.service";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {CreateItem, ItemDetails} from "../../../item/item.model";
import {UniqueItem} from "../../../categories/list-items/item-card/item-card.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatInput} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FieldToTextPipe} from "../../../shared/pipes/field-to-text";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {toSignal} from "@angular/core/rxjs-interop";
import {Subcategory} from "../../../categories/subcategory.model";
import {Image} from "../../../item/image.model";
import {ItemEditorForm, ItemEditorFormControls, ToFormControls} from "./item-editor-form.model";
import {DialogData} from "../../../shared/dialog/dialog-data.model";
import {DialogComponent} from "../../../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-item-editor',
    imports: [
        MatProgressSpinner,
        ReactiveFormsModule,
        MatFormField,
        MatSelect,
        MatOption,
        MatAutocomplete,
        MatInput,
        MatAutocompleteTrigger,
        CdkTextareaAutosize,
        FieldToTextPipe,
        MatButton,
        MatMiniFabButton,
        MatError,
        MatLabel
    ],
    templateUrl: './item-editor.component.html',
    styleUrl: './item-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemEditorComponent implements OnInit {
  itemId: InputSignal<string> = input<string>();

  images: WritableSignal<Image[]> = signal<Image[]>([]);
  selectedImage: WritableSignal<Image> = signal<Image>(null);

  mode: Signal<'create' | 'update'> = computed(() => this.itemId() ? 'update' : 'create');
  title: Signal<string> = computed(() => this.mode() === 'create' ? 'Add new item' : 'Edit item');

  form: FormGroup<ItemEditorFormControls> = this.createForm();

  categories: Signal<Category[]> = toSignal(this.categoriesService.categoriesList$, { initialValue: [] });
  categoriesNames: Signal<string[]> = computed(() => this.categories()?.map(c => c.name));
  categoryNameValue: Signal<string> = toSignal(this.categoryNameCtrl.valueChanges);
  filteredCategoriesNames: Signal<string[]> = computed(() => 
    this._filter(this.categoryNameValue() || '', this.categoriesNames()));

  subcategories: Signal<Subcategory[]> = toSignal(this.categoriesService.subcategoriesList$, { initialValue: [] });
  subcategoriesNames: Signal<string[]> = computed(() => this.subcategories()?.map(c => c.name));
  subcategoryNameValue: Signal<string> = toSignal(this.subcategoryNameCtrl.valueChanges);
  filteredSubcategoriesNames: Signal<string[]> = computed(() => 
    this._filter(this.subcategoryNameValue() || '', this.subcategoriesNames()));

  colors: string[] = ['BLACK', 'WHITE', 'RED', 'YELLOW', 'GREEN', 'BLUE', 'VIOLET', 'GREY', 'MULTI'];
  filteredColors: Signal<string[]> = signal<string[]>(null);

  brands: {id: string, name: string}[];
  brandsNames: string[];
  filteredBrandsNames: Signal<string[]> = signal<string[]>(null);

  materials: string[] = ['DENIM', 'LEATHER', 'WOOL', 'COTTON', 'ARTIFICIAL_LEATHER', 'SYNTHETICS'];
  filteredMaterials: Signal<string[]> = signal<string[]>(null);

  seasons: string[] = ['WINTER', 'SPRING', 'AUTUMN', 'SUMMER', 'MULTISEASON'];
  filteredSeasons: Signal<string[]> = signal<string[]>(null);

  clothSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
  _shoesSizes: string[] = [];
  sizes: WritableSignal<string[]> = signal<string[]>([]);
  sizesByCtrlIndex = computed(() => {
    const sizes = this.sizes();
    const uniqueItems = this.uniqueItemsValue();

    return uniqueItems.map((item, currentIndex) => {
      const currentSize = item.size;

      const selectedOtherControls = new Set(
        uniqueItems
          .filter((_, index) => index !== currentIndex)
          .map(item => item.size)
          .filter(Boolean)
      );

      return sizes.filter(size =>
        size === currentSize || !selectedOtherControls.has(size)
      );
    });
  });

  isFormPatched: boolean = false;
  
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  
  injector = inject(Injector);

  private currentCategoryForSizes: string | null = null;

  private uniqueItemsValue = toSignal(
    this.uniqueItems.valueChanges.pipe(
      startWith(this.uniqueItems.getRawValue())
    ),
    {
      initialValue: this.uniqueItems.getRawValue(),
      injector: this.injector
    }
  )

  get shoesSizes() {
    if (this._shoesSizes.length !== 17) {
      for (let i=30;i<=46;i++) {
        this._shoesSizes.push(String(i));
      }
    }
    return this._shoesSizes;
  }
  get uniqueItems(): FormArray<FormGroup<ToFormControls<UniqueItem>>> {
    return this.form.get('uniqueItems') as FormArray<FormGroup<ToFormControls<UniqueItem>>>;
  }
  get categoryNameCtrl() {
    return this.form.get('categoryName');
  }
  get subcategoryNameCtrl() {
    return this.form.get('subcategoryName');
  }

  constructor(
    private categoriesService: CategoriesService,
    private employeeService: EmployeeService,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.setFormListeners();
    
    effect(() => (this.mode() === 'update' && !this.isFormPatched) ?  this.patchForm() : '');
    effect(() => this.updateSubcategoriesValidatorsEffect());
    effect(() => this.updateUniqueItemsAndSubcategoryOnCategoryChangeEffect());
  }

  ngOnInit() {
    if (this.mode() === 'update') {
      this.loadImages();
    }
  }

  protected onDeleteImage() {
    const filterSelectedImage = () => {
      this.images.update(images => images.filter(image => image.id !== this.selectedImage().id));
      this.selectedImage.set(this.images()[0]);
    }

    if(this.selectedImage().isLocal) {
      filterSelectedImage();
    } else {
      this.employeeService.deleteItemImages(this.itemId(), this.selectedImage().id).subscribe(() => {
        filterSelectedImage();
      });
    }
  }

  protected selectImage(image: Image) {
    this.selectedImage.set(image);
  }

  protected onImagePicked(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files);
    this.employeeService.uploadItemImages(this.itemId(), files).subscribe();
    this.loadImages();
  }

  protected onAddSizeAndQuantity() {
    this.addUniqueItem();
  }

  protected onRemoveUniqueItem(index: number) {
    this.uniqueItems.removeAt(index);
  }

  protected onSubmit() {
    if (!this.form.valid) return;
    this.isLoading.set(true);
    const item: CreateItem = {
      gender: this.form.value.gender.toUpperCase(),
      categoryId: this.categories().find(c => c.name.toUpperCase() === this.form.value.categoryName.toUpperCase()).id,
      subcategoryId: this.subcategories().find(c => c.name.toUpperCase() === this.form.value.subcategoryName.toUpperCase())?.id || '',
      name: this.form.value.name.toUpperCase(),
      description: this.form.value.description.toUpperCase(),
      price: this.form.value.price,
      discount: this.form.value.discount || 0,
      color: this.form.value.color.toUpperCase(),
      brandId: this.brands.find(b => b.name.toUpperCase() === this.form.value.brandName.toUpperCase()).id,
      material: this.form.value.material.toUpperCase(),
      season: this.form.value.season.toUpperCase(),
      itemCode: this.form.value.itemCode,
      uniqueItems: this.form.value.uniqueItems.map(uniqueItem => ({size: uniqueItem.size.toUpperCase(), quantity: uniqueItem.quantity}))
    }
    if (this.mode() === 'create') {
      this.employeeService.createItem(item)
        .pipe(
          finalize(() => this.isLoading.set(false))
        ).subscribe({
          next: () => {
            this.form.reset();
            this.images.set([]);
          },
          error: (err) => {
            let description = ``;
            if (err['status']) description += `Error ${err['status']} occurred`;
            if (err['message']) description += err['message'];
            const data: DialogData = {
              title: 'Error loading image',
              description
            }
            this.dialog.open(DialogComponent, {data});
          }
        });
    } else {
      this.employeeService.updateItem(this.itemId(), item)
        .pipe(
          finalize(() => this.isLoading.set(false))
        ).subscribe()
    }
  }

  private createForm() {
    return this.fb.group({
      gender: ['', Validators.required],
      categoryName: ['', Validators.required],
      subcategoryName: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.pattern(/^[0-9.]*$/)]],
      discount: [0, [Validators.pattern(/^[0-9.]+$/)]],
      color: ['', Validators.required],
      brandName: ['', Validators.required],
      material: ['', Validators.required],
      season: ['', Validators.required],
      itemCode: ['', Validators.required],
      uniqueItems: this.fb.array([this.fb.group({
        size: ['', Validators.required],
        quantity: [0, Validators.required]
      })])
    });
  }

  private setFormListeners() {
    this.filteredColors = toSignal(this.form.get("color").valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.colors))
    ), {injector: this.injector});
    this.itemsService.requestBrands().subscribe(brands => {
      this.brands = brands;
      this.brandsNames = brands.map(b => b.name);
      this.filteredBrandsNames = toSignal(this.form.get("brandName").valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.brandsNames)),
      ), {injector: this.injector});
    });
    this.filteredMaterials = toSignal(this.form.get("material").valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.materials))
    ), {injector: this.injector});
    this.filteredSeasons = toSignal(this.form.get("season").valueChanges.pipe(
      startWith(''),
      map((value => this._filter(value || '', this.seasons)))
    ), {injector: this.injector});
  }

  private updateSubcategoriesValidatorsEffect() {
      if (this.subcategories()?.length === 0 && this.subcategoryNameCtrl.hasValidator(Validators.required)) {
        this.subcategoryNameCtrl.removeValidators(Validators.required);
        this.subcategoryNameCtrl.updateValueAndValidity();
      }
      if (this.subcategories()?.length > 0 && !this.subcategoryNameCtrl.hasValidator(Validators.required)) {
        this.subcategoryNameCtrl.addValidators(Validators.required);
        this.subcategoryNameCtrl.updateValueAndValidity();
      }
  }

  private updateUniqueItemsAndSubcategoryOnCategoryChangeEffect() {
    const category = this.categories()?.find(c => c.name === this.categoryNameValue());

    if (!category) return;

    const categoryName = category.name.toUpperCase();

    const shouldUpdateUniqueItems =
      this.currentCategoryForSizes != null &&
      this.currentCategoryForSizes !== categoryName;

    this.setSizesByCategory(categoryName, shouldUpdateUniqueItems);
    this.categoriesService.requestSubcategories(category.id);
  }

  private setSizesByCategory(categoryName: string, resetUniqueItems: boolean) {
    categoryName = categoryName.toUpperCase();

    const sizes =
      categoryName === 'SHOES' || categoryName === 'SOCKS'
        ? this.shoesSizes
        : this.clothSizes;

    this.sizes.set(sizes);

    if (resetUniqueItems) {
      this.uniqueItems.controls.forEach(ctrl => {
        ctrl.reset({ size: '', quantity: 0 });
      });

      this.subcategoryNameCtrl.reset('');
    }

    this.currentCategoryForSizes = categoryName;
  }
  
  private patchForm() {
    this.itemsService.requestItemById(this.itemId()).subscribe(item => {
      for (let i = this.uniqueItems.length; i < item.uniqueItems.length; i++) {
        this.addUniqueItem();
      }
      const itemWithoutImages: Omit<ItemDetails, 'images'> = item;
      const patchValue: Omit<ItemEditorForm, 'images' | 'subcategoryName' | 'material' | 'season'> & {uniqueItems: UniqueItem[]} =
        {...itemWithoutImages, brandName: itemWithoutImages.brand, categoryName: itemWithoutImages.category.name, uniqueItems: itemWithoutImages.uniqueItems};
      this.form.patchValue(patchValue);
      this.isFormPatched = true;
    });
  }

  private _filter(value: string, array: string[]) {
    const filterValue = value.toLowerCase();
    return array?.filter(v => v.toLowerCase().includes(filterValue));
  }

  private loadImages() {
    this.images.set([]);
    this.isLoading.set(true);
    this.itemsService.requestItemImages(this.itemId()).subscribe(images => {
      this.images.set(images);
      this.selectedImage.set(images[0]);
      this.isLoading.set(false);
    });
  }
  
  private addUniqueItem() {
    const uniqueItem = this.fb.group({
      size: ['', Validators.required],
      quantity: [0, Validators.required]
    });
    this.uniqueItems.push(uniqueItem);
  }
}
