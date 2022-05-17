
export interface IDynamicMenuChild {
  title: string;
  titleKey: string;
  required?: boolean;
}

export interface IDynamicMenu {
  title: string;
  titleKey: string;
  child?: IDynamicMenuChild[];
  required?: boolean;
}
