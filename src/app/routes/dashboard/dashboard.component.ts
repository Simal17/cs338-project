import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataService } from 'src/app/data.service'; // Import the data service
import { PageHeaderModule } from '@delon/abc/page-header';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { G2PieClickItem, G2PieComponent, G2PieData, G2PieModule } from '@delon/chart/pie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [...SHARED_IMPORTS, G2PieModule]
})
export class DashboardComponent {
  constructor(private dataService: DataService) {}
  columns: STColumn<any>[] = [];
  manufactureData: G2PieData[] = [];
  data: any[] = [];
  totalProducts: number = 0;
  ngOnInit(): void {
    this.dataService.getDashData().subscribe(
      (data2) => {
        this.data = data2.map(item => ({
          x: item.x,
          y: item.y
        }));// Assign the received data to the property
      
      this.totalProducts = 0;
      for (let i of this.data) {
        this.totalProducts += i.y;
      }

      this.manufactureData = this.data.map(item => ({
        x: item.x,
        y: Math.round((item.y / this.totalProducts)*100)
      }));
      console.log(this.manufactureData);
      },
      (error) => {
        console.error("There was an error retrieving data:", error);
      }
    );

    // this.manufactureData = [
    //   {
    //     x: 'First Manufacture',
    //     y: 80
    //   },
    //   {
    //     x: 'Second',
    //     y: 10
    //   },
    //   {
    //     x: 'Third',
    //     y: 5
    //   },
    //   {
    //     x: 'Rest',
    //     y: 5
    //   }
    // ];
  }

}
