import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTreeModule, TreeControl } from '@angular/cdk/tree';
import { NestedTreeNode } from './nested-tree-node';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CustomNestedTreeControl } from './nested-tree-control';
import { Subject, takeUntil } from 'rxjs';
import { NestedTreeSelectionModel } from './nested-tree-selection-model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-nested-tree',
  standalone: true,
  imports: [CommonModule, CdkTreeModule, MatCheckbox, MatIcon, MatIconButton],
  templateUrl: './nested-tree.component.html',
  styleUrl: './nested-tree.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NestedTreeComponent),
      multi: true
    },
  ]
})
export class NestedTreeComponent<K, T> implements OnInit, OnDestroy, ControlValueAccessor {
  private onDestroy$: Subject<void> = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _change = (_: K[] | NestedTreeNode<K, T>[]) => {};

  private _initValue: K[] | NestedTreeNode<K, T>[] = [];
  private _tree!: NestedTreeNode<K, T>[];

  dataSource: MatTreeNestedDataSource<NestedTreeNode<K, T>> = new MatTreeNestedDataSource<NestedTreeNode<K, T>>();

  @Input() trackById: boolean = true;

  @Input() set tree(tree: NestedTreeNode<K, T>[]) {
    this._tree = tree ?? [];
    this.dataSource.data = this._tree ;
    this.treeControl.dataNodes = this._tree;
  }

  @Input() selectionModel: NestedTreeSelectionModel<K, T> = new NestedTreeSelectionModel();
  @Input() treeControl: TreeControl<NestedTreeNode<K, T>, K> = new CustomNestedTreeControl();

  @ContentChild(TemplateRef, { static: true }) itemTemplate!: TemplateRef<any>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.treeControl.expansionModel.changed
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  toggle(node: NestedTreeNode<K, T>): void {
    this.selectionModel.toggle(node);

    if (this.trackById) {
      const initValue = this._initValue as K[];
      this.selectionModel.sort((a, b) => initValue.indexOf(a.id) - initValue.indexOf(b.id));
      this._change(this.selectionModel.selected.map((n) => n.id));
    } else {
      const initValue = this._initValue as NestedTreeNode<K, T>[];
      this.selectionModel.sort((a, b) => initValue.indexOf(a) - initValue.indexOf(b));
      this._change(this.selectionModel.selected);
    }
  }

  writeValue(value: K[] | NestedTreeNode<K, T>[]): void {
    this._initValue = value ?? [];

    this.selectionModel.clear();
    this.applyValue(this._initValue, this._tree);

    const selected = this.selectionModel.selected;
    this._change(this.trackById ? selected.map((n) => n.id) : selected);

    this.cdr.markForCheck();
  }

  registerOnChange(fn: (_: K[] | NestedTreeNode<K, T>[]) => void): void {
    this._change = fn;
  }

  registerOnTouched(_: (_: K[] | NestedTreeNode<K, T>[]) => void): void {}

  private applyValue(value: K[] | NestedTreeNode<K, T>[], nodes: NestedTreeNode<K, T>[]) {
    if (!value?.length) {
      return;
    }

    nodes?.forEach((node) => {
      if (this.trackById ? (value as K[])?.includes(node.id) : (value as NestedTreeNode<K, T>[])?.includes(node)) {
        this.selectionModel.select(node);
      }

      this.applyValue(value, node.children);
    });
  }
}
