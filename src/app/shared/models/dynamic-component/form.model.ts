import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';

export enum FieldsAlignment {
  tow_items_with_image_at_left = 'TWO_ITEMS_WITH_IMAGE_AT_LEFT',
  tow_items_with_image_at_right = 'TWO_ITEMS_WITH_IMAGE_AT_RIGHT',
  tow_items_with_textarea = 'TWO_ITEMS_WITH_TEXTAREA',
  tow_items = 'TWO_ITEMS',
  one_item_at_left = 'ONE_ITEM_LEFT',
  one_item_at_center = 'ONE_ITEM_CENTER',
  one_item_stretch = 'ONE_ITEM_STRETCH',
}

export enum InputType {
  EMAIL = 'email',
  NUMBER = 'number',
  TEXT = 'text',
  PASSWORD = 'password',
}

export enum FieldsType {
  IMAGE = 'image',
  INPUT = 'input',
  SELECT = 'select',
  SELECT_WITH_SEARCH = 'selectWithSearch',
}

export interface IFieldsObject {
  label?: string;
  placeholder?: string;
  type: FieldsType;
  inputType?: InputType;
  formControlName?: string;
  selectFieldList ?: BehaviorSubject<IViewParam[]>;
  searchControlName?: string;
  filteredList ?: ReplaySubject<IViewParam[]>;
  imageInputs?: {
    avatar: any;
    haveImage: any;
    modelObject: any;
  };
}

export interface IDynamicForm {
  titleRef: string; // SECTION REF [titleKey of each MENU Item]
  fieldsLayout: FieldsAlignment;
  fields: IFieldsObject[];
}
