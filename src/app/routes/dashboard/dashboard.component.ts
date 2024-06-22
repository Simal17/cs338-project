import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataService } from 'src/app/data.service'; // Import the data service
import { PageHeaderModule } from '@delon/abc/page-header';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [...SHARED_IMPORTS]
})
export class DashboardComponent {
  constructor(private dataService: DataService) {}
  columns: STColumn<any>[] = [];

  data: any[] = [];
  ngOnInit(): void {
  }
}
