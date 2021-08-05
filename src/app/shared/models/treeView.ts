export interface IMyTreeNode {
  title: string;
  children?: IMyTreeNode[];
  expanded?: boolean;
  object?: object;
}
