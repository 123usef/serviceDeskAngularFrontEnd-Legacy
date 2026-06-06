import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DataTableComponent } from './components/data-table/data-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { StatusLabelPipe } from './pipes/status-label.pipe';
import { PriorityLabelPipe } from './pipes/priority-label.pipe';

@NgModule({
  declarations: [
    DataTableComponent,
    ConfirmDialogComponent,
    StatusBadgeComponent,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    SearchInputComponent,
    EmptyStateComponent,
    TruncatePipe,
    StatusLabelPipe,
    PriorityLabelPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DataTableComponent,
    ConfirmDialogComponent,
    StatusBadgeComponent,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    SearchInputComponent,
    EmptyStateComponent,
    TruncatePipe,
    StatusLabelPipe,
    PriorityLabelPipe
  ]
})
export class SharedModule { }
