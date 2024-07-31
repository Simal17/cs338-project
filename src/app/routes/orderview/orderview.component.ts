import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core";
import { STColumn, STComponent } from "@delon/abc/st";
import { SFSchema } from "@delon/form";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { DataService } from "src/app/data.service"; // Import the data service
import { SHARED_IMPORTS } from "@shared";
import { HttpParams } from "@angular/common/http";

@Component({
  selector: "app-order-orderview",
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: "./orderview.component.html",
})
export class OrderviewComponent implements OnInit {
  @ViewChild("itemsTemp", { static: true }) itemsTemp!: TemplateRef<{
    $implicit: any;
    index: number;
    column: STColumn;
  }>;
  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}
  private readonly http = inject(_HttpClient);
  private readonly modal = inject(ModalHelper);
  columns: STColumn<any>[] = [];
  data: any[] = [];
  detailModal = false;
  detailTitle = "";
  ngOnInit(): void {
    this.dataService.getOrderDetail().subscribe(
      (data) => {
        this.data = data;
        console.log(this.data);
      },
      (error) => {
        console.error("There was an error retrieving data:", error);
      }
    );

    this.columns = [
      {
        title: "Order ID",
        index: "order_id",
        className: "text-left",
        width: "160px",
        sort: true,
      },
      {
        title: "First Name",
        index: "buyer_first",
        className: "text-left",
        width: "120px",
        sort: true,
      },
      {
        title: "Last Name",
        index: "buyer_last",
        className: "text-left",
        sort: true,
      },
      {
        title: "Items",
        render: this.itemsTemp,
        width: "160px",
      },
      {
        title: "Email Address",
        index: "email",
        className: "text-left",
        width: "120px",
        sort: true,
      },
      {
        title: "Address",
        index: "address",
        className: "text-left",
        sort: true,
      },
      {
        title: "Order Date",
        index: "order_date",
        className: "text-left",
        sort: true,
      },
      {
        title: "Status",
        index: "status_type",
        className: "text-left",
        sort: true,
      },
    ];
  }

  viewDetail(item: any): void {
    this.detailModal = true;
    let params = new HttpParams();
    params = params.set("ptype", item.ptype);
    params = params.set("num", item.model_no);
    this.dataService.getViewDetail2(params).subscribe(
      (data) => {
        this.loadDetailData(data);
        this.cdr.markForCheck();
        console.log(data)
        console.log("Opened detail successfully!");
      },
      (error) => {
        console.error("There was an error retrieving data:", error);
      }
    );
  }

  loadDetailData(data: any): void {
    this.detailTitle = `Product Detail for product# ${data[0].model_no}`;
    const detailData = data[0];

    const container = document.getElementById("object-details");
    container!.innerHTML = "";
    let isFirst = true;
    for (const [key, value] of Object.entries(detailData)) {
      if (isFirst || !value) {
        isFirst = false;
        continue; // Skip the first property
      }
      const propertyDiv = document.createElement("div");
      propertyDiv.className = "property";
      propertyDiv.innerHTML = `<span>${key.replace(/_/g, " ")}:</span> ${value}`;
      container!.appendChild(propertyDiv);
    }
  }
}
