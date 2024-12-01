import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Category} from "../../../categories/category.model";
import {map, Observable, startWith, tap} from "rxjs";
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
import {AsyncPipe} from "@angular/common";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FieldToTextPipe} from "../../../pipes/field-to-text";
import {MatButton} from "@angular/material/button";
import {DialogComponent} from "../../../dialogs/dialog/dialog.component";
import {DialogData} from "../../../dialogs/dialog/dialog-data.model";

@Component({
  selector: 'app-item-editor',
  standalone: true,
  imports: [
    MatProgressSpinner,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatAutocomplete,
    MatInput,
    MatAutocompleteTrigger,
    AsyncPipe,
    CdkTextareaAutosize,
    FieldToTextPipe,
    MatButton,
    MatError,
    MatLabel
  ],
  templateUrl: './item-editor.component.html',
  styleUrl: './item-editor.component.scss'
})
export class ItemEditorComponent implements OnInit {
  @Input() itemId: string;

  mode: 'create' | 'update' = 'create';

  form: FormGroup;

  categories: Category[];
  categoriesNames: string[];
  filteredCategoriesNames: Observable<string[]>;

  subcategories: {id: string, name: string}[];
  subcategoriesNames: string[];
  filteredSubcategoriesNames: Observable<string[]>;

  colors: string[] = ['BLACK', 'WHITE', 'RED', 'YELLOW', 'GREEN', 'BLUE', 'VIOLET', 'GREY', 'MULTI'];
  filteredColors: Observable<string[]>;

  brands: {id: string, name: string}[];
  brandsNames: string[];
  filteredBrandsNames: Observable<string[]>;

  materials: string[] = ['DENIM', 'LEATHER', 'WOOL', 'COTTON', 'ARTIFICIAL_LEATHER', 'SYNTHETICS'];
  filteredMaterials: Observable<string[]>;

  seasons: string[] = ['WINTER', 'SPRING', 'AUTUMN', 'SUMMER', 'MULTISEASON'];
  filteredSeasons: Observable<string[]>;

  clothSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
  _shoesSizes: string[];
  sizes: string[];
  sizesByCtrlIndex: string[][] = [];

  isLoading: WritableSignal<boolean> = signal<boolean>(false);

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
  get categoryName() {
    return this.form.get('categoryName');
  }
  get subcategoryName() {
    return this.form.get('subcategoryName');
  }

  constructor(
    private categoriesService: CategoriesService,
    private employeeService: EmployeeService,
    private itemsService: ItemsService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.mode = this.itemId ? 'update' : 'create';

    this.setForm();
    if (this.mode === 'update') this.patchForm();
    this.setFormListeners();
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
    console.log(`form is ${this.form.valid ? 'valid' : 'invalid'}`, this.form);
    if (!this.form.valid) return;
    this.isLoading.set(true);
    const item: CreateItem = {
      gender: this.form.value.gender.toUpperCase(),
      categoryId: this.categories.find(c => c.name.toUpperCase() === this.form.value.categoryName.toUpperCase()).id,
      subcategoryId: this.subcategories.find(c => c.name.toUpperCase() === this.form.value.subcategoryName.toUpperCase())?.id || '',
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
    console.log('item: ', item);
    if (this.mode === 'create') {
      this.employeeService.createItem(item).subscribe({
        next: res => {
          console.log('item added, res: ', res);
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
            description: err
          }
          this.dialog.open(DialogComponent, {data});
          this.isLoading.set(false);
        }
      });
    } else {
      this.employeeService.updateItem(this.itemId, item).subscribe({
        next: res => {
          console.log('item updated, res: ', res);
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
            description: err
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
    this.categoriesService.categoriesList$.subscribe(categories => {
      if (!categories) return;
      this.categories = categories;
      this.categoriesNames = categories.map(c => c.name);
      this.filteredCategoriesNames = this.categoryName.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.categoriesNames)),
        tap(() => {
          const categoryName = this.categoryName.value;
          const category = categories?.find(c => c.name === categoryName);
          if (!category) return;
          this.setSizesByCategory(categoryName);
          this.categoriesService.requestSubcategories(category.id).subscribe(subcategories => {
            this.subcategories = subcategories;
            this.subcategoriesNames = subcategories.map(sc => sc.name);
            this.filteredSubcategoriesNames = this.form.get("subcategoryName").valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value || '', this.subcategoriesNames)),
            );
            if (subcategories.length === 0 && this.subcategoryName.hasValidator(Validators.required)) {
              this.subcategoryName.removeValidators(Validators.required);
              this.subcategoryName.updateValueAndValidity();
            }
            if (subcategories.length > 0 && !this.subcategoryName.hasValidator(Validators.required)) {
              this.subcategoryName.addValidators(Validators.required);
              this.subcategoryName.updateValueAndValidity();
            }
            console.log('updated validity', this.subcategoryName);
          })
        })
      );
    });
    this.filteredColors = this.form.get("color").valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.colors))
    );
    this.itemsService.requestBrands().subscribe(brands => {
      this.brands = brands;
      this.brandsNames = brands.map(b => b.name);
      this.filteredBrandsNames = this.form.get("brandName").valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.brandsNames)),
      )
    });
    this.filteredMaterials = this.form.get("material").valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.materials))
    );
    this.filteredSeasons = this.form.get("season").valueChanges.pipe(
      startWith(''),
      map((value => this._filter(value || '', this.seasons)))
    );
  }
  private setSizesByCategory(categoryName: string) {
    this.sizes = categoryName === 'SHOES' || categoryName === 'SOCKS' ? this.shoesSizes : this.clothSizes;
    this.uniqueItems.controls.forEach((ctrl, index) => {
      ctrl.reset();
      this.sizesByCtrlIndex[index] = [...this.sizes];
    });
    console.log('sizes set: ', this.sizesByCtrlIndex);
  }
  private patchForm() {
    this.itemsService.requestItemById(this.itemId).subscribe(item => {
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
