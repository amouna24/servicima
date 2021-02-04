import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { Subject } from 'rxjs';
import { IDynamicForm } from '@shared/models/dynamic-component/form.model';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'wid-dynamic-component',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
})
export class DynamicComponent implements OnInit {

  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  @Input() menuItems: IDynamicMenu[];
  @Input() dynamicForm: IDynamicForm[];
  @Input() formData: FormGroup;
  /**************************************************************************
   * @description Form Group
   *************************************************************************/
  @Output() dynamicFormGroup = new EventEmitter<FormGroup>();

  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  selectedItem = new Subject<string>();
  valueOfSelectedItem = '';

  randomSubParent: any;

  constructor(
  ) { }

  ngOnInit(): void {
    this.randomSubParent = document.getElementsByClassName('dynamic-component-content')[0];
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

  submitAction() {
    this.dynamicFormGroup.emit(this.formData);
  }
}
