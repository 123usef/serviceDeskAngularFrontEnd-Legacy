import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { LookupService } from '../../../../core/services/lookup.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ICategory } from '../../../../core/models/category.model';
import { IDepartment } from '../../../../core/models/department.model';
import { ITicketCreate, ITicketUpdate, TicketPriority } from '../../../../core/models/ticket.model';
import { IUser, UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit, OnDestroy {
  @Input() initialTitle = '';
  @Input() initialDescription = '';
  @Input() initialCategoryId: number | null = null;
  @Input() initialPriority: TicketPriority = TicketPriority.Medium;
  @Input() initialDepartmentId: number | null = null;
  @Input() isEditMode = false;

  @Output() formSubmit = new EventEmitter<ITicketCreate | ITicketUpdate>();
  @Output() formCancel = new EventEmitter<void>();

  title = '';
  description = '';
  categoryId: number | null = null;
  priority: TicketPriority = TicketPriority.Medium;
  departmentId: number | null = null;

  categories: ICategory[] = [];
  departments: IDepartment[] = [];
  currentUser: IUser | null = null;

  TicketPriority = TicketPriority;
  UserRole = UserRole;

  private categoriesSub?: Subscription;
  private departmentsSub?: Subscription;
  private userSub?: Subscription;

  constructor(
    private lookupService: LookupService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.title = this.initialTitle;
    this.description = this.initialDescription;
    this.categoryId = this.initialCategoryId;
    this.priority = this.initialPriority;
    this.departmentId = this.initialDepartmentId;

    this.categoriesSub = this.lookupService.getCategories().subscribe(
      categories => this.categories = categories
    );

    this.userSub = this.authService.currentUser$.subscribe(
      user => this.currentUser = user
    );

    this.departmentsSub = this.lookupService.getDepartments().subscribe(
      departments => this.departments = departments
    );
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === UserRole.Admin;
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.description.trim() || !this.categoryId) {
      this.notificationService.error('Please fill in all required fields');
      return;
    }

    if (this.isEditMode) {
      const update: ITicketUpdate = {
        title: this.title,
        description: this.description,
        categoryId: this.categoryId,
        priority: this.priority
      };
      this.formSubmit.emit(update);
    } else {
      const create: ITicketCreate = {
        title: this.title,
        description: this.description,
        categoryId: this.categoryId,
        priority: this.priority
      };
      if (this.departmentId) {
        create.departmentId = this.departmentId;
      }
      this.formSubmit.emit(create);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  ngOnDestroy(): void {
    this.categoriesSub?.unsubscribe();
    this.departmentsSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }
}
