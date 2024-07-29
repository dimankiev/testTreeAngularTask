import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeNode } from './nested-tree-node';

export class NestedTreeSelectionModel<K, T> extends SelectionModel<NestedTreeNode<K, T>> {
    constructor(multiple: boolean = true){
        super(multiple);
    }

    override get selected(): NestedTreeNode<K, T>[] {
        return super.selected.filter(n => !n.children?.filter((ch) => !ch.disabled)?.length);
    }

    override select(...nodes: NestedTreeNode<K, T>[]): void {
        super.select(...nodes);
        this.updateNodes(nodes, true);
    }

    override deselect(...nodes: NestedTreeNode<K, T>[]): void {
        super.deselect(...nodes);
        this.updateNodes(nodes, false);
    }

    isIndeterminate(parent: NestedTreeNode<K, T>): boolean{
        const selectedCount = parent?.children?.filter((ch) => !ch.disabled)?.filter((ch) => this.isSelected(ch)).length;
        if(parent?.children?.filter((ch) => !ch.disabled)?.length == selectedCount) {
            return false;
        }
        return selectedCount > 0 || parent?.children?.filter((ch) => !ch.disabled)?.some((ch) => this.isIndeterminate(ch));
    }

    private updateNodes(nodes: NestedTreeNode<K, T>[], value: boolean): void {
        nodes.forEach((n) => {
            this.updateChildren(n.children?.filter((ch) => !ch.disabled), value);
            this.updateParent(n.parent);
        });
    }

    private updateParent(parent?: NestedTreeNode<K, T>): void {
        if (!parent?.children?.filter((ch) => !ch.disabled)?.length) {
            return;
        }
        parent?.children?.filter((ch) => !ch.disabled)?.every((ch) => this.isSelected(ch)) ? super.select(parent) : super.deselect(parent);
        this.updateParent(parent.parent);
    }

    private updateChildren(children: NestedTreeNode<K, T>[], value: boolean): void {
        children?.filter((ch) => !ch.disabled)?.forEach((ch) => (value ? this.select(ch) : this.deselect(ch)));
    }
}
