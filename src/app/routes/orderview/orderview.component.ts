import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { STColumn, STComponent } from "@delon/abc/st";
import { SFSchema } from "@delon/form";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { DataService } from "src/app/data.service"; // Import the data service
import { SHARED_IMPORTS } from "@shared";

@Component({
  selector: "app-order-orderview",
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: "./orderview.component.html",
})
export class OrderviewComponent implements OnInit {
  constructor(private dataService: DataService) {}
  private readonly http = inject(_HttpClient);
  private readonly modal = inject(ModalHelper);
  columns: STColumn<any>[] = [];
  data: any[] = [];
  ngOnInit(): void {
    this.dataService.getOrderDetail().subscribe(
      (data) => {
        this.data = data;
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
        index: "titems",
        className: "text-left",
        width: "160px",
        sort: true,
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
        index: "status",
        className: "text-left",
        sort: true,
      },
    ];
  }
}
