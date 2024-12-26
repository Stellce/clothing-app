import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  input, InputSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Category} from "../../../categories/category.model";
import {map, startWith} from "rxjs";
import {CategoriesService} from "../../../categories/categories.service";
import {EmployeeService} from "../../employee.service";
import {ItemsService} from "../../../item/items.service";
import {MatDialog} from "@angular/material/dialog";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {CreateItem} from "../../../item/item.model";
import {UniqueItem} from "../../../categories/list-items/item-card/item-card.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatInput} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FieldToTextPipe} from "../../../shared/pipes/field-to-text";
import {MatButton} from "@angular/material/button";
import {DialogComponent} from "../../../shared/dialog/dialog.component";
import {DialogData} from "../../../shared/dialog/dialog-data.model";
import {toSignal} from "@angular/core/rxjs-interop";
import {Subcategory} from "../../../categories/subcategory.model";

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
        MatError,
        MatLabel
    ],
    templateUrl: './item-editor.component.html',
    styleUrl: './item-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemEditorComponent implements OnInit {
  itemId: InputSignal<string> = input<string>();

  mode: Signal<'create' | 'update'> = computed(() => this.itemId() ? 'update' : 'create');
  title: Signal<string> = computed(() => this.mode() === 'create' ? 'Add new item' : 'Edit item');

  form: FormGroup;

  categories: Signal<Category[]> = signal<Category[]>(null);
  categoriesNames: Signal<string[]>;
  categoryNameValue: Signal<string>;
  filteredCategoriesNames: Signal<string[]> = signal<string[]>(null);

  subcategories: Signal<Subcategory[]> = signal<Subcategory[]>(null);
  subcategoriesNames: Signal<string[]> = signal<string[]>(null);
  subcategoryNameValue: Signal<string>;
  filteredSubcategoriesNames: Signal<string[]> = signal<string[]>(null);

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
  _shoesSizes: string[];
  sizes: string[];
  sizesByCtrlIndex: string[][] = [];

  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  injector = inject(Injector);

  get shoesSizes() {
    if (this._shoesSizes.length !== 17) {
      for (let i=30;i<=46;i++) {
        this._shoesSizes.push(String(i));
      }
    }
    return this._shoesSizes;
  }
  get uniqueItems() {
    return this.form.get('uniqueItems') as FormArray;
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
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.setForm();
    this.setFormListeners();

    this.categories = toSignal(this.categoriesService.categoriesList$);
    this.categoriesNames = computed(() => this.categories()?.map(c => c.name));
    this.categoryNameValue = toSignal(this.categoryNameCtrl.valueChanges);
    this.filteredCategoriesNames = computed(() => {
      const category = this.categories()?.find(c => c.name === this.categoryNameValue());
      if (category) {
        this.setSizesByCategory(category.name);
        this.categoriesService.requestSubcategories(category.id);
      }
      return this._filter(this.categoryNameValue() || '', this.categoriesNames())
    });

    this.subcategories = toSignal(this.categoriesService.subcategoriesList$);
    this.subcategoriesNames = computed(() => this.subcategories().map(c => c.name));
    this.subcategoryNameValue = toSignal(this.subcategoryNameCtrl.valueChanges);
    this.filteredSubcategoriesNames = computed(() => this._filter(this.subcategoryNameValue() || '', this.subcategoriesNames()));
    computed(() => {
      if (this.subcategories().length === 0 && this.subcategoryNameCtrl.hasValidator(Validators.required)) {
        this.subcategoryNameCtrl.removeValidators(Validators.required);
        this.subcategoryNameCtrl.updateValueAndValidity();
      }
      if (this.subcategories().length > 0 && !this.subcategoryNameCtrl.hasValidator(Validators.required)) {
        this.subcategoryNameCtrl.addValidators(Validators.required);
        this.subcategoryNameCtrl.updateValueAndValidity();
      }
    });
  }

  ngOnInit() {
    if (this.mode() === 'update') this.patchForm();
  }

  onAddSizeAndQuantity() {
    const filterSizesOutOfSelectedOnes = () => {
      return [...this.sizes].filter(size => this.uniqueItems.controls.every(ctrl => {
        return ctrl.value.size !== size;
      }))
    }

    this.addUniqueItem();
    this.sizesByCtrlIndex[this.uniqueItems.controls.length - 1] = filterSizesOutOfSelectedOnes();
  }
  onRemoveUniqueItem(index: number) {
    this.uniqueItems.removeAt(index);
  }

  onSizeSelected(e: MatSelectChange, invokedCtrlId: number) {
    const selectedSize = e.value;
    this.sizesByCtrlIndex = this.sizesByCtrlIndex.map((sizes, index) => {
      return index !== invokedCtrlId ? [...this.sizes].filter(s => s !== selectedSize) : sizes
    });
  }

  onSubmit() {
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
      uniqueItems: this.form.value.uniqueItems.map((uniqueItem: UniqueItem) => ({size: uniqueItem.size.toUpperCase(), quantity: uniqueItem.quantity}))
    }
    if (this.mode() === 'create') {
      this.employeeService.createItem(item).subscribe({
        next: res => {
          const data: DialogData = {
            title: 'Done',
            description: 'Item have been added'
          }
          this.dialog.open(DialogComponent, {data});
          this.isLoading.set(false);
          this.form.reset();
        },
        error: err => {
          const data: DialogData = {
            title: 'Cannot add item',
            description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
          }
          this.dialog.open(DialogComponent, {data});
          this.isLoading.set(false);
        }
      });
    } else {
      this.employeeService.updateItem(this.itemId(), item).subscribe({
        next: res => {
          const data: DialogData = {
            title: 'Item updated'
          }
          this.dialog.open(DialogComponent, {data});
          this.isLoading.set(false);
          this.form.reset();
        },
        error: err => {
          const data: DialogData = {
            title: 'Cannot update item',
            description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
          }
          this.dialog.open(DialogComponent, {data});
          this.isLoading.set(false);
        }
      })
    }
  }

  private setForm() {
    this.form = this.fb.group({
      gender: ['', Validators.required],
      categoryName: ['', Validators.required],
      subcategoryName: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      discount: ['', [Validators.pattern(/^[0-9]+$/)]],
      color: ['', Validators.required],
      brandName: ['', Validators.required],
      material: ['', Validators.required],
      season: ['', Validators.required],
      itemCode: ['', Validators.required],
      uniqueItems: this.fb.array([])
    });

    this.uniqueItems.push(this.fb.group({
      size: ['', Validators.required],
      quantity: ['', Validators.required]
    }));
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
  private setSizesByCategory(categoryName: string) {
    this.sizes = categoryName === 'SHOES' || categoryName === 'SOCKS' ? this.shoesSizes : this.clothSizes;
    this.uniqueItems.controls.forEach((ctrl, index) => {
      ctrl.reset();
      this.sizesByCtrlIndex[index] = [...this.sizes];
    });
  }
  private patchForm() {
    this.itemsService.requestItemById(this.itemId()).subscribe(item => {
      item.uniqueItems.forEach((v, i) => i < item.uniqueItems.length ? this.addUniqueItem() : '');
      this.form.patchValue({...item, brandName: item.brand});
    })
  }
  private _filter(value: string, array: string[]) {
    const filterValue = value.toLowerCase();
    return array?.filter(v => v.toLowerCase().includes(filterValue));
  }
  private addUniqueItem() {
    const uniqueItem = this.fb.group({
      size: ['', Validators.required],
      quantity: ['', Validators.required]
    });
    this.uniqueItems.push(uniqueItem);
  }
}
