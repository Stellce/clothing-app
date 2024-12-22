import {Component, OnInit} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {OutletComponent} from "../../tabs/landing/outlet/outlet.component";
import {MatDivider} from "@angular/material/divider";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {EmployeeService} from "../employee.service";
import {DialogData} from "../../shared/dialog/dialog-data.model";
import {DialogComponent} from "../../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe} from "@angular/common";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FieldToTextPipe} from "../../shared/pipes/field-to-text";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ItemEditorComponent} from "./item-editor/item-editor.component";
import {finalize, tap} from "rxjs";
import {ItemsTableComponent} from "./items-table/items-table.component";
import {DialogService} from "../../shared/dialog/dialog.service";
import {ItemsService} from "../../item/items.service";

@Component({
  selector: 'app-employee-panel',
  standalone: true,
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
    MatSelect,
    MatOption,
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    CdkTextareaAutosize,
    FieldToTextPipe,
    MatError,
    MatMiniFabButton,
    MatProgressSpinner,
    ItemEditorComponent,
    MatAccordion,
    ItemsTableComponent
  ],
  templateUrl: './employee-panel.component.html',
  styleUrl: './employee-panel.component.scss'
})
export class EmployeePanelComponent implements OnInit {
  addIds: FormControl;
  deleteIds: FormControl;
  editItemId: FormControl;
  isEditItemIdConfirmed: boolean;
  deleteItemId: FormControl;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.setForms();
    this.setFormsListeners();
  }

  onAddItemsToLandingPage() {
    const ids = this.addIds.value;
    const loadingDialog = this.dialogService.createLoadingDialog();
    this.employeeService.addToLandingPage(ids)
      .pipe(finalize(() => {
        loadingDialog.close();
        this.itemsService.requestLandingPage().subscribe();
      }))
      .subscribe({
        next: () => {
          const data: DialogData = {
            title: 'Items added',
            description: 'Items were successfully added to landing page',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data});
        },
        error: err => {
          const data: DialogData = {
            title: 'Error',
            description: `Could not add items. ${err['status'] ? `Error ${err['status']} occurred` : ''}`,
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data});
        }
      });
  }
  onRemoveItemsFromLandingPage() {
    const ids = this.deleteIds.value;
    this.employeeService.deleteFromLandingPage(ids).subscribe({
      next: () => {
        const dialogData: DialogData = {
          title: 'Items added',
          description: 'Items were successfully deleted to landing page',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      },
      error: err => {
        const dialogData: DialogData = {
          title: 'Error',
          description: `Could not delete items. ${err['status'] ? `Error ${err['status']} occurred` : ''}`,
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      }
    });
  }
  onConfirmEditItemId() {
    this.isEditItemIdConfirmed = true;
  }
  onDeleteItem() {
    this.employeeService.deleteItem(this.deleteItemId.value).subscribe({
      next: res => {
        console.log('Item deleted', res);
        const data: DialogData = {
          title: 'Done',
          description: 'Item successfully deleted'
        }
        this.dialog.open(DialogComponent, {data});
      },
      error: err => {
        const data: DialogData = {
          title: 'Unable to delete item',
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    });
  }

  private setForms() {
    this.addIds = this.fb.control('', Validators.required);
    this.deleteIds = this.fb.control('', Validators.required);
    this.editItemId = this.fb.control('', Validators.required);
    this.deleteItemId = this.fb.control('', Validators.required);
  }
  private setFormsListeners() {
    this.editItemId.valueChanges.pipe(tap(() => this.isEditItemIdConfirmed = false))
  }
}
