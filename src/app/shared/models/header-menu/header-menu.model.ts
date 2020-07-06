import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';

export interface IHeaderMenu {
  state: string; // link to the route
  name: string; // name to display !note: use the key name for the translate
  type: string; // type of menu , it ll be 'link' or 'sub'
  icon: string; // material icon name. link to the material icons 'https://material.io/resources/icons/?style=baseline'
  feature: string; // feature code eg 'SOURCING_ACCESS'
  children?: IChildItem[];
}
