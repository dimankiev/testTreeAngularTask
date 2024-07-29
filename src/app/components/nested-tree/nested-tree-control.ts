import { NestedTreeControl } from "@angular/cdk/tree";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { NestedTreeNode } from "./nested-tree-node";

export class CustomNestedTreeControl<K, T> extends NestedTreeControl<NestedTreeNode<K, T>, K>{
  private _dataNodesMap!: Map<K, NestedTreeNode<K, T>>;
  private _dataNodes!: NestedTreeNode<K, T>[];
  private _emitEvent: boolean = true;

  public get dataNodesMap(){
    if(this._dataNodes !== this.dataNodes){
      this._dataNodes = this.dataNodes;
      const nodes = this.dataNodes.reduce((accumulator: NestedTreeNode<K, T>[], dataNode) => [...accumulator, ...this.getDescendants(dataNode), dataNode], []);
      this._dataNodesMap = new Map(nodes.map(n => [n.id, n]));
    }
    return this._dataNodesMap;
  }

  expandCollapse$: Observable<{ nodeId: K, isExpanded: boolean }> = this.expansionModel.changed
    .pipe(filter(() => this._emitEvent), map(change => ({nodeId: change.added[0] || change.removed[0], isExpanded: !!change.added.length })));

  constructor(){
    super(((node) => node.children), {trackBy: (node) => node.id});
  }

  override expand(dataNode: NestedTreeNode<K, T>, emitEvent: boolean = true): void {
    this._emitEvent = emitEvent;
    super.expand(dataNode);
    this._emitEvent = true;
  }

  override collapse(dataNode: NestedTreeNode<K, T>, emitEvent: boolean = true): void {
    this._emitEvent = emitEvent;
    super.collapse(dataNode);
    this._emitEvent = true;
  }

  override expandAll(emitEvent: boolean = true): void {
    this._emitEvent = emitEvent;
    super.expandAll();
    this._emitEvent = true;
  }

  override collapseAll(emitEvent: boolean = true): void {
    this._emitEvent = emitEvent;
    super.collapseAll();
    this._emitEvent = true;
  }

  expandMany(ids: K[], emitEvent: boolean = true): void {
    this._emitEvent = emitEvent;
    this.expansionModel.clear();
    ids?.forEach(id => this.expansionModel.select(id));
    this._emitEvent = true;
  }
}
