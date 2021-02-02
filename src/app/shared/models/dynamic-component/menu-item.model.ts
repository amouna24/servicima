
export interface IDynamicMenuChild {
  title: string;
  titleKey: string;
}

export interface IDynamicMenu {
  title: string;
  titleKey: string;
  child?: IDynamicMenuChild[];
}
