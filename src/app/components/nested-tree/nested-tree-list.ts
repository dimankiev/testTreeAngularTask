import { NestedTreeNode } from "./nested-tree-node";

interface HierarchicalItem<K> {
  id: K,
  parentId?: K
}

export class NestedTreeList<K, I extends NestedTreeNode<K, T>, T extends HierarchicalItem<K>> extends Array<I> {
  public itemsMap: Map<K, I> = new Map<K, I>()

  constructor(items: T[], private type: new () => I, filter?: (tree: I) => boolean) {
    super();
    const tree = this.buildNestedList(items);
    const filteredTree = this.applyFilter(tree, filter);

    this.push(...filteredTree);

    this.itemsMap = new Map(this.getFlatTree(this).map(i => [i.id, i]));
  }

  private buildNestedList(items: T[]): I[] {
    const rootNodes: I[] = [];

    items.forEach(i => {
      let item = this.itemsMap.get(i.id);

      if(!item){
        item = new this.type();
        item.id = i.id;
        item.children = [];
        this.itemsMap.set(i.id, item);
      }

      item.data = i;

      if(!i.parentId){
        rootNodes.push(item);
        return;
      }

      let parentItem = this.itemsMap.get(i.parentId);

      if(!parentItem){
        parentItem = new this.type();
        parentItem.id = i.parentId;
        parentItem.children = [];
        this.itemsMap.set(i.parentId, parentItem);
      }

      item.parent = parentItem;

      parentItem.children.push(item);
    });

    return rootNodes;
  }

  private getFlatTree(nodes: I[]): I[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return nodes.reduce((acc, n) => acc.concat([n, ...this.getFlatTree(n.children as I[])]), [])
  }

  private applyFilter(nodes: I[], predicate?: (node: I) => boolean): I[] {
    return !predicate ? nodes : nodes?.filter(predicate)
      .map(element => {
        element.children = this.applyFilter(element.children as I[], predicate)
        return element;
      });
  }
}
