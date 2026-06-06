import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel'
})
export class StatusLabelPipe implements PipeTransform {

  private labels: { [key: number]: string } = {
    0: 'Open',
    1: 'In Progress',
    2: 'Resolved',
    3: 'Closed',
    4: 'Rejected'
  };

  transform(value: number): string {
    return this.labels[value] || 'Unknown';
  }
}
