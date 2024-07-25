import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { STColumn, STComponent } from "@delon/abc/st";
import { SFSchema } from "@delon/form";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { SHARED_IMPORTS } from "@shared";

@Component({
  selector: "app-order-orderview",
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: "./orderview.component.html",
})
export class OrderviewComponent implements OnInit {
  private readonly http = inject(_HttpClient);
  private readonly modal = inject(ModalHelper);
  columns: STColumn<any>[] = [];
  data: any[] = [];
  ngOnInit(): void {
    // this.dataService.getData(params).subscribe(
    //   (data) => {
    //     this.data = data;
    //     this.cdr.markForCheck();
    //     this.st?.reload();
    //   },
    //   (error) => {
    //     console.error("There was an error retrieving data:", error);
    //   }
    // );order_id,buyer_first,buyer_last,titems,email,address,date,status

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
        index: "items",
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
        index: "date",
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
