export interface IModalModel {
title: string;
  button: {
  buttonLeft?: {
     visible: boolean;
      name: string;
      nextValue: boolean;
      validator?: boolean;
      color?: string;
      background?: string;
  },
  buttonRight?: {
      visible: boolean,
      name: string,
      nextValue: boolean,
      color?: string,
      background?: string,
      validator?: boolean,
  },
};
  style: any;
}
