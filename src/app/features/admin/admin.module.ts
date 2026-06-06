import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CategoryManagementComponent } from './pages/category-management/category-management.component';
import { DepartmentManagementComponent } from './pages/department-management/department-management.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    CategoryManagementComponent,
    DepartmentManagementComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
