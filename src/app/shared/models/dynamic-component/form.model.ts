export enum FieldsAlignment {
  tow_items_with_image_at_left = 'TWO_ITEMS_WITH_IMAGE_AT_LEFT',
  tow_items_with_image_at_right = 'TWO_ITEMS_WITH_IMAGE_AT_RIGHT',
  tow_items_with_textarea = 'TWO_ITEMS_WITH_TEXTAREA',
  tow_items = 'TWO_ITEMS',
  one_item_at_left = 'ONE_ITEM_LEFT',
  one_item_at_center = 'ONE_ITEM_CENTER',
  one_item_stretch = 'ONE_ITEM_STRETCH',
}

export interface IFieldsObject {
  label?: string;
  placeholder?: string;
  type: string;
  selectFieldList ?: any;
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
