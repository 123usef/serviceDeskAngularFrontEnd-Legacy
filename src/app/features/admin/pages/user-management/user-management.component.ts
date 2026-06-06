import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { IUser, UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  currentPage = 1;
  pageSize = 10;

  UserRole = UserRole;
  roleOptions = [
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Technician, label: 'Technician' },
    { value: UserRole.DepartmentHead, label: 'Department Head' },
    { value: UserRole.Employee, label: 'Employee' }
  ];

  private usersSub?: Subscription;
  private roleSub?: Subscription;

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingService.show();
    this.usersSub?.unsubscribe();
    this.usersSub = this.adminService.getUsers(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(users => this.users = users);
  }

  onRoleChange(user: IUser, newRole: number): void {
    this.roleSub?.unsubscribe();
    this.roleSub = this.adminService.changeUserRole(user.id, newRole)
      .subscribe(() => this.loadUsers());
  }

  getRoleLabel(role: UserRole): string {
    const found = this.roleOptions.find(r => r.value === role);
    return found ? found.label : 'Unknown';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
    this.roleSub?.unsubscribe();
  }
}
