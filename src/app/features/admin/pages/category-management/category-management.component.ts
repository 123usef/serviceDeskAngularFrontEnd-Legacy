import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { LookupService } from '../../../../core/services/lookup.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ICategory } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit, OnDestroy {
  categories: ICategory[] = [];
  showForm = false;
  editingCategory: ICategory | null = null;

  formName = '';
  formNameAr = '';
  formDescription = '';

  private categoriesSub?: Subscription;
  private saveSub?: Subscription;

  constructor(
    private adminService: AdminService,
    private lookupService: LookupService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loadingService.show();
    this.categoriesSub?.unsubscribe();
    this.categoriesSub = this.lookupService.getCategories(true)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(categories => this.categories = categories);
  }

  openCreateForm(): void {
    this.editingCategory = null;
    this.formName = '';
    this.formNameAr = '';
    this.formDescription = '';
    this.showForm = true;
  }

  openEditForm(category: ICategory): void {
    this.editingCategory = category;
    this.formName = category.name;
    this.formNameAr = category.nameAr;
    this.formDescription = category.description || '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingCategory = null;
  }

  onSave(): void {
    if (!this.formName.trim() || !this.formNameAr.trim()) {
      this.notificationService.error('Name and Arabic name are required');
      return;
    }

    const payload = {
      name: this.formName,
      nameAr: this.formNameAr,
      description: this.formDescription || undefined
    };

    this.saveSub?.unsubscribe();
    if (this.editingCategory) {
      this.saveSub = this.adminService.updateCategory(this.editingCategory.id, payload)
        .subscribe(() => {
          this.showForm = false;
          this.loadCategories();
        });
    } else {
      this.saveSub = this.adminService.createCategory(payload)
        .subscribe(() => {
          this.showForm = false;
          this.loadCategories();
        });
    }
  }

  ngOnDestroy(): void {
    this.categoriesSub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }
}
