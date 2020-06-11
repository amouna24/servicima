import { ISubChild } from './sub-child.model';

export interface IChildItem {
    state: string;
    name: string;
    feature: string;
    icon: string;
    type?: string;
    child?: ISubChild[];
}
