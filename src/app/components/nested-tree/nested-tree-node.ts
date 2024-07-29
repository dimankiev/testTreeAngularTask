export interface NestedTreeNode<K, T> {
  id: K;
  data: T;
  children: NestedTreeNode<K, T>[];
  parent?: NestedTreeNode<K, T>;
  disabled?: boolean;
}