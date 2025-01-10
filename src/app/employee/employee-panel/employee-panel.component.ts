import {ChangeDetectionStrategy, Component, Signal, signal, WritableSignal} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {OutletComponent} from "../../tabs/landing/outlet/outlet.component";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {EmployeeService} from "../employee.service";
import {ItemEditorComponent} from "./item-editor/item-editor.component";
import {finalize, tap} from "rxjs";
import {DialogService} from "../../shared/dialog/dialog.service";
import {ItemsService} from "../../item/items.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-employee-panel',
    imports: [
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        OutletComponent,
        MatDivider,
        MatFormField,
        MatInput,
        MatLabel,
        MatButton,
        FormsModule,
        ReactiveFormsModule,
        ItemEditorComponent,
        MatAccordion
    ],
    templateUrl: './employee-panel.component.html',
    styleUrl: './employee-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeePanelComponent {
  addIds: FormControl;
  deleteIds: FormControl;
  editItemId: FormControl;
  editItemIdValue: Signal<string>;
  isEditItemIdConfirmed: WritableSignal<boolean> = signal(false);
  deleteItemId: FormControl;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private itemsService: ItemsService
  ) {
    this.setForms();
    this.editItemIdValue = toSignal(this.editItemId.valueChanges.pipe(tap(() => this.isEditItemIdConfirmed.set(false))));
  }

  onAddItemsToLandingPage() {
    const ids = this.addIds.value;
    const loadingDialog = this.dialogService.createLoadingDialog();
    this.employeeService.addToLandingPage(ids)
      .pipe(finalize(() => {
        loadingDialog?.close();
        this.itemsService.requestLandingPage().subscribe();
      })).subscribe();
  }
  onRemoveItemsFromLandingPage() {
    const ids = this.deleteIds.value;
    this.employeeService.deleteFromLandingPage(ids).subscribe();
  }
  onConfirmEditItemId() {
    this.isEditItemIdConfirmed.set(true);
  }
  onDeleteItem() {
    this.employeeService.deleteItem(this.deleteItemId.value).subscribe();
  }

  private setForms() {
    this.addIds = this.fb.control('', Validators.required);
    this.deleteIds = this.fb.control('', Validators.required);
    this.editItemId = this.fb.control('', Validators.required);
    this.deleteItemId = this.fb.control('', Validators.required);
  }
}
