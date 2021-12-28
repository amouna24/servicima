import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { IDynamicForm } from '@shared/models/dynamic-component/form.model';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SheetService } from '@core/services/sheet/sheet.service';
import { Location } from '@angular/common';

@Component({
  selector: 'wid-dynamic-component',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
})
export class DynamicComponent implements OnInit, OnDestroy {

  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  @Input() menuItems: IDynamicMenu[];
  @Input() dynamicForm = new BehaviorSubject<IDynamicForm[]>([]);
  @Input() formData: FormGroup;
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  @Input() title: string;
  @Input() allowedTableActions: { update: boolean, delete: boolean, show: boolean };
  /**************************************************************************
   * @description Form Group
   *************************************************************************/
  @Output() dynamicFormGroup = new EventEmitter<FormGroup>();
  @Output() selectedFile = new EventEmitter<FormData>();
  @Output() selectedDoc = new EventEmitter<any>();
  @Output() keyUpEventValue = new EventEmitter<string>();
  @Output() listOfObjects = new EventEmitter<{ form: FormGroup, action: string, formGroupName: string }>();
  @Output() rowActionData = new EventEmitter<{ actionType: string, data: any, formGroupName: string }>();
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  selectedItem = new Subject<string>();
/*
  selectedDocName: BehaviorSubject<{ name: string, formGroupName: string }> = new BehaviorSubject<{ name: string, formGroupName: string }>(null);
*/
  valueOfSelectedItem = '';
  attachmentList = [];
  randomSubParent: any;

  constructor(
    private sheetService: SheetService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.randomSubParent = document.getElementById('dynamic-component-content');
    this.valueOfSelectedItem = this.menuItems[0].titleKey;
  }

  setSelectedItem(titleKey) {
    this.selectedItem.next(titleKey);
    this.selectedItem.subscribe(
      (res) => {
        this.valueOfSelectedItem = res;
      }
    );
  }

  scroll(child) {
    this.menuItems.forEach(
      (item) => {
        if (item.child.length > 0 && child === item.titleKey) {
          child = item.child[0].titleKey;
        }
      }
    );
    this.setSelectedItem(child.replace('#', ''));
    const childID = document.getElementById(child);
    // Where is the parent on page
    const parentRect = this.randomSubParent.getBoundingClientRect();
    // What can you see?
    const parentViewableArea = {
      height: this.randomSubParent.clientHeight,
      width: this.randomSubParent.clientWidth
    };
    // Where is the child
    const childRect =  childID.getBoundingClientRect();
    // Is the child viewable?
    const isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);

    // if you can't see the child try to scroll parent
    if (!isViewable) {
      // scroll by offset relative to parent
      this.randomSubParent.scrollTop = (childRect.top + this.randomSubParent.scrollTop) - parentRect.top;
    }
  }

  childSelected(parent: string): boolean {
    let res = false;
    this.menuItems.forEach(
      (menu) => {
        if (menu.titleKey === parent) {
          menu.child.forEach(
            (child) => {
              if (child.titleKey === this.valueOfSelectedItem) {
                res = true;
              }
            }
          );
        }
      }
    );
    return res;
  }

  /**
   * Checking control validation
   * @param form: FormGroup
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to validators name
   */
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  submitAction() {
    this.dynamicFormGroup.emit(this.formData);
  }

  keyUpHandler(target) {
    this.keyUpEventValue.emit(target.value);
  }

  getFile(obj: FormData) {
    this.selectedFile.emit(obj);
  }

  /**************************************************************************
   * @description Open Dialog Panel
   *************************************************************************/
  openUploadSheet(formGroupName: string) {
    this.sheetService.displaySheet('uploadSheetComponent', null)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (!!res) {
            this.attachmentList.push({ data: res?.file, name: res.name, formGroupName});
            this.selectedDoc.emit(this.attachmentList);
          }
/*
          this.selectedDocName.next({ name: res.name, formGroupName});
*/
        }
      );
  }

  identify(index, item) {
    return item._id;
  }

  /**************************************************************************
   * @description  Prevent Saturday and Sunday from being selected.
   *************************************************************************/
 /* datePickerFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };*/

  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }

  /**************************************************************************
   * @description Open Dialog Panel
   *************************************************************************/
  feedDataTable(form: FormGroup, action, formGroupName: string) {
    this.listOfObjects.emit({ form, action, formGroupName });
  }

  actionRowData(action: string, rowData: any, formGroupName: string) {
    this.rowActionData.emit({ actionType: action, data: rowData, formGroupName});
  }

  getPlaceholder(formControlName: string) {

  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
