import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  columns: STColumn<any>[] = [];

  data: any[] = [];
  ngOnInit(): void {
    this.data = [{ name: 'i3-13100', type: 'cpu', saleQty: 200 }];
    // this.productService.getThirdPartyStatus().subscribe(res => {
    //   this.dataFromApi = res;
    // });

    // this.inventoryListUrl = this.inventoryListUrl + this.settings.getData('presaleId');

    //dataFromApi is from observable and there is a delay. the columns need to be initialled correct;;y

    this.columns = [
      { title: 'Name', index: 'name', className: 'text-left', width: '420px', sort: true },
      { title: 'Type', index: 'type', className: 'text-left', width: '120px', sort: true },
      { title: 'Qtty', index: 'saleQty', type: 'number', width: '80px', className: 'text-center', sort: true }
    ];
  }
}
