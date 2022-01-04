import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { userType } from '@shared/models/userProfileType.model';

export enum FieldsAlignment {
  tow_items_with_image_at_left = 'TWO_ITEMS_WITH_IMAGE_AT_LEFT',
  tow_items_with_image_at_right = 'TWO_ITEMS_WITH_IMAGE_AT_RIGHT',
  tow_items_with_textarea = 'TWO_ITEMS_WITH_TEXTAREA',
  tow_items = 'TWO_ITEMS',
  one_item_at_left = 'ONE_ITEM_LEFT',
  one_item_at_right = 'ONE_ITEM_RIGHT',
  one_item_at_center = 'ONE_ITEM_CENTER',
  one_item_stretch = 'ONE_ITEM_STRETCH',
}

export enum InputType {
  EMAIL = 'email',
  NUMBER = 'number',
  TEXT = 'text',
  PASSWORD = 'password',
  DATE = 'date',
  ACTIONS = 'Actions',
  ROW_ITEM = 'rowItem'
}

export enum FieldsType {
  IMAGE = 'image',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  SELECT_WITH_SEARCH = 'selectWithSearch',
  SLIDE_TOGGLE = 'slideToggle',
  UPLOAD_FILE = 'uploadFile',
  DATE_PICKER = 'datePicker',
  DATA_TABLE = 'dataTable',
  ADD_MORE_OR_UPDATE = 'addMore',
  THEME_RADIO_GROUP = 'themeRadioGroup',
}

export interface IColumnsDef {
  name: string;
  prop: string;
  type: InputType;
}
export interface IFieldsObject {
  label?: string;
  placeholder?: string;
  type: FieldsType;
  inputType?: InputType;
  formControlName?: string;
  selectFieldList ?: BehaviorSubject<IViewParam[]>;
  searchControlName?: string;
  min?: number;
  max?: number;
  required?: boolean;
  filteredList ?: ReplaySubject<IViewParam[]>;
  canUpdate ?: BehaviorSubject<boolean>;
  canAdd ?: BehaviorSubject<boolean>;
  minDate ?: BehaviorSubject<any>;
  imageInputs?: {
    avatar: BehaviorSubject<any>;
    haveImage: BehaviorSubject<any>;
    modelObject: any;
    singleUpload: boolean;
    userType: userType;
    imageLoading?: BehaviorSubject<boolean>;
  };
  dataTable ?: {
    displayedColumns: string[],
    columns: IColumnsDef[],
    dataSource: BehaviorSubject<any[]>;
  };
}

export interface IDynamicForm {
  titleRef: string; // SECTION REF [titleKey of each MENU Item]
  fieldsLayout: FieldsAlignment;
  fields: IFieldsObject[];
}
