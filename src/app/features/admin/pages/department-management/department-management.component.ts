import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { LookupService } from '../../../../core/services/lookup.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { IDepartment } from '../../../../core/models/department.model';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.scss']
})
export class DepartmentManagementComponent implements OnInit, OnDestroy {
  departments: IDepartment[] = [];
  showForm = false;
  editingDepartment: IDepartment | null = null;

  formName = '';
  formNameAr = '';
  formDescription = '';

  private departmentsSub?: Subscription;
  private saveSub?: Subscription;

  constructor(
    private adminService: AdminService,
    private lookupService: LookupService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loadingService.show();
    this.departmentsSub?.unsubscribe();
    this.departmentsSub = this.lookupService.getDepartments(true)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(departments => this.departments = departments);
  }

  openCreateForm(): void {
    this.editingDepartment = null;
    this.formName = '';
    this.formNameAr = '';
    this.formDescription = '';
    this.showForm = true;
  }

  openEditForm(department: IDepartment): void {
    this.editingDepartment = department;
    this.formName = department.name;
    this.formNameAr = department.nameAr;
    this.formDescription = department.description || '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingDepartment = null;
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
    if (this.editingDepartment) {
      this.saveSub = this.adminService.updateDepartment(this.editingDepartment.id, payload)
        .subscribe(() => {
          this.showForm = false;
          this.loadDepartments();
        });
    } else {
      this.saveSub = this.adminService.createDepartment(payload)
        .subscribe(() => {
          this.showForm = false;
          this.loadDepartments();
        });
    }
  }

  ngOnDestroy(): void {
    this.departmentsSub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }
}
