import { Component, Input, OnInit } from '@angular/core';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { Subject } from 'rxjs';
import { IDynamicForm } from '@shared/models/dynamic-component/form.model';

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

  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  selectedItem = new Subject<string>();
  valueOfSelectedItem = '';

  constructor() { }

  ngOnInit(): void {
    console.log(this.dynamicForm);
    console.log(this.menuItems);
  }

  setSelectedItem(titleKey) {
    this.selectedItem.next(titleKey);
    this.selectedItem.subscribe(
      (res) => {
        this.valueOfSelectedItem = res;
      }
    );
  }
}
