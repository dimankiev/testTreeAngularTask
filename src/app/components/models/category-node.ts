import { NestedTreeNode } from '../nested-tree/nested-tree-node';
import { ICategory } from '../../interfaces/category';

export class CategoryNode implements NestedTreeNode<number, ICategory> {
  id!: number;
  data!: ICategory;

  parent?: NestedTreeNode<number, ICategory>;
  children!: Array<NestedTreeNode<number, ICategory>>;

  disabled?: boolean;
}