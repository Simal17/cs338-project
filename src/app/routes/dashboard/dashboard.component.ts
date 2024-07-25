import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { DataService } from "src/app/data.service"; // Import the data service
import { PageHeaderModule } from "@delon/abc/page-header";
import { STColumn } from "@delon/abc/st";
import { SHARED_IMPORTS } from "@shared";
import { G2BarClickItem, G2BarData, G2BarModule } from "@delon/chart/bar";
import { SettingsService } from "@delon/theme";
import {ScrollingModule} from '@angular/cdk/scrolling';
interface warningData {
  model_no: string;
  name: string;
  quantity: number;
}
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl:  "./dashboard.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [...SHARED_IMPORTS, G2BarModule,ScrollingModule],
})
export class DashboardComponent {
  constructor(private dataService: DataService,private cdr: ChangeDetectorRef) {}
  private readonly settingsService = inject(SettingsService);
  manufactureData: G2BarData[] = [];
  warningData: warningData[] = [];
  userrole = "";
  ngOnInit(): void {
    this.userrole = this.dataService.getRole() === 0 ? "manager" : "worker";
    if (this.userrole === "manager") {
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
    } else {
      this.dataService.getWarning().subscribe(
        (data) => {
          this.warningData = data;
          this.cdr.markForCheck();
        },
        (error) => {
          console.error("There was an error retrieving data:", error);
        }
      );
    }
  }
}
