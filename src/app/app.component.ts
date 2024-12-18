import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  signal,
} from '@angular/core';
import { CategoryModel } from '../core/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { liveQuery } from 'dexie';
import { db } from '../core/services/indexed.db'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public isDropdownOpen: boolean = false;
  public selectedCategoriesCount = signal<number>(0);
  public selectedStagesCount = signal<number>(0);
  public categoryArray = signal<CategoryModel[]>([]);

  constructor(
    private readonly elementRef: ElementRef,
  ) {}

  public ngOnInit(): void {
    liveQuery(() => db.categories.toArray()).subscribe((categories) => {
      this.categoryArray.set(categories);
      this.updateSelectedCount();
      this.updateStageCount();
    });
  }

  public toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  public toggleCategory(category: CategoryModel): void {
    category.isExpanded = !category.isExpanded;
    this.onStageCheckboxChange();
  }

  @HostListener('document:click', ['$event'])
  public onOutsideClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  public onHeaderCheckboxClick(event: Event, button: HTMLInputElement): void {
    event.stopPropagation();
    if (this.atLeastOneSelected()) {
      button.checked = false;
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  public onCheckboxClick(event: Event): void {
    event.stopPropagation();
  }

  public updateSelectedCount(): void {
    this.selectedCategoriesCount.set(
      this.categoryArray().filter((category) => category.isSelected).length
    );
  }

  public updateStageCount(): void {
    let counter = 0;
    this.categoryArray().forEach((category) => {
      category.stages.forEach((stage) => {
        if (stage.isSelected) {
          counter++;
        }
      });
    });

    this.selectedStagesCount.set(counter);
  }

  public atLeastOneSelected(): boolean {
    return this.categoryArray().some((category) => category.stages.some((stage) => stage.isSelected));
  }

  public areAllSelected(): boolean {
    return this.categoryArray().every((category) => category.isSelected);
  }

  public isIndeterminate(): boolean {
    return (
      this.categoryArray().some(
        (category) =>
          category.isSelected ||
          category.stages.some((stage) => stage.isSelected)
      ) && !this.areAllSelected()
    );
  }

  public selectAll(): void {
    this.categoryArray().forEach((category) => {
      category.isSelected = true;
      category.stages?.forEach((stage) => (stage.isSelected = true));
    });
    this.onStageCheckboxChange();
  }

  public deselectAll(): void {
    this.categoryArray().forEach((category) => {
      category.isSelected = false;
      category.stages?.forEach((stage) => (stage.isSelected = false));
    });
    this.onStageCheckboxChange();
  }

  public areAllStagesSelected(category: CategoryModel): boolean {
    return category.stages?.every((stage) => stage.isSelected) ?? false;
  }

  public isStageIndeterminate(category: CategoryModel): boolean {
    return (
      category.stages.some((stage) => stage.isSelected) &&
      !this.areAllStagesSelected(category)
    );
  }

  public toggleAllStages(category: CategoryModel): void {
    if (this.areAllStagesSelected(category)) {
      category.stages?.forEach((stage) => (stage.isSelected = false));
    } else {
      category.stages?.forEach((stage) => (stage.isSelected = true));
    }
    this.onStageCheckboxChange();
  }

  public onStageCheckboxChange(): void {
    this.updateSelectedCount();
    this.updateStageCount();
    db.categories.clear();
    db.categories.bulkAdd(this.categoryArray());
  }
}