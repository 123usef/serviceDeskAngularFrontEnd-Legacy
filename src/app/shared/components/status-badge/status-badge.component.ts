import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() value: number = 0;
  @Input() type: 'status' | 'priority' = 'status';

  get label(): string {
    if (this.type === 'status') {
      return this.statusLabels[this.value] || 'Unknown';
    }
    return this.priorityLabels[this.value] || 'Unknown';
  }

  get cssClass(): string {
    if (this.type === 'status') {
      return 'badge badge-status-' + (this.statusClasses[this.value] || 'default');
    }
    return 'badge badge-priority-' + (this.priorityClasses[this.value] || 'default');
  }

  private statusLabels: { [key: number]: string } = {
    0: 'Open',
    1: 'In Progress',
    2: 'Resolved',
    3: 'Closed',
    4: 'Rejected'
  };

  private priorityLabels: { [key: number]: string } = {
    0: 'Low',
    1: 'Medium',
    2: 'High',
    3: 'Critical'
  };

  private statusClasses: { [key: number]: string } = {
    0: 'open',
    1: 'in-progress',
    2: 'resolved',
    3: 'closed',
    4: 'rejected'
  };

  private priorityClasses: { [key: number]: string } = {
    0: 'low',
    1: 'medium',
    2: 'high',
    3: 'critical'
  };
}
