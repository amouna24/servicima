export interface IFieldsObject {
  label: string;
  placeholder: string;
  type: string;
  selectFieldList ?: any;
}

export interface IDynamicForm {
  titleRef: string; // SECTION REF [titleKey of each MENU Item]
  fields: IFieldsObject[];
}
