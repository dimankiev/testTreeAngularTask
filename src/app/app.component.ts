import { Component, OnInit } from '@angular/core';
import { NestedTreeComponent } from './components/nested-tree/nested-tree.component';
import { CustomNestedTreeControl } from './components/nested-tree/nested-tree-control';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NestedTreeNode } from './components/nested-tree/nested-tree-node';
import { CategoriesService } from './services/categories.service';
import { NestedTreeList } from './components/nested-tree/nested-tree-list';
import { ICategory } from './interfaces/category';
import { CategoryNode } from './components/models/category-node';

@Component({
  standalone: true,
  imports: [
    NestedTreeComponent,
    ReactiveFormsModule
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  trackById = true;
  treeControl = new CustomNestedTreeControl<number, ICategory>();
  treeFormControl = new FormControl([]);
  tree?: NestedTreeList<number, NestedTreeNode<number, ICategory>, ICategory>;

  private sourceStatic = false;

  constructor(private categoriesSvc: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  changeSource(): void {
    this.sourceStatic = !this.sourceStatic;
    this.loadCategories(this.sourceStatic);
  }

  loadCategories(getStatic = false): void {
    (getStatic ? this.categoriesSvc.getStatic() : this.categoriesSvc.getAll())
      .subscribe(categories => {
        this.tree = new NestedTreeList(categories, CategoryNode);
      });
  }
}
