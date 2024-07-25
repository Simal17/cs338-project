import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { DataService } from "src/app/data.service"; // Import the data service
import { PageHeaderModule } from "@delon/abc/page-header";
import { STColumn } from "@delon/abc/st";
import { SHARED_IMPORTS } from "@shared";
import { G2BarClickItem, G2BarData, G2BarModule } from "@delon/chart/bar";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [...SHARED_IMPORTS, G2BarModule],
})
export class DashboardComponent {
  constructor(private dataService: DataService,private cdr: ChangeDetectorRef) {}
  columns: STColumn<any>[] = [];
  manufactureData: G2BarData[] = [];
  totalProducts: number = 0;
  ngOnInit(): void {
    this.dataService.getDashData().subscribe(
      (data) => {
        this.manufactureData = data.map((item) => ({
          x: item.x,
          y: item.y,
          color: '#f50'
        })); 
        this.cdr.markForCheck();
      },
      (error) => {
        console.error("There was an error retrieving data:", error);
      }
    );
  }
}
