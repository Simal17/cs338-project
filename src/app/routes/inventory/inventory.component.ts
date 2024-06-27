import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DataService } from "src/app/data.service"; // Import the data service
import { STColumn } from "@delon/abc/st";
import { SHARED_IMPORTS } from "@shared";

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrl: "./inventory.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [...SHARED_IMPORTS],
})
export class InventoryComponent {
  newProductModal = false;

  constructor(private dataService: DataService) {}
  columns: STColumn<any>[] = [];
  data: any[] = [];

  ngOnInit(): void {
    this.dataService.getData().subscribe(
      (data) => {
        this.data = data; // Assign the received data to the property
      },
      (error) => {
        console.error("There was an error retrieving data:", error);
      }
    );
    // this.data = [{ model_no: '10001',name: 'Ryzen 7 7800X3D', manufacture: 'AMD', retail_price: 339,stock_qtty: 200 }];
    // this.productService.getThirdPartyStatus().subscribe(res => {
    //   this.dataFromApi = res;
    // });

    // this.inventoryListUrl = this.inventoryListUrl + this.settings.getData('presaleId');

    //dataFromApi is from observable and there is a delay. the columns need to be initialled correct;;y
    this.columns = [
      {
        title: "Model NO.",
        index: "model_no",
        className: "text-left",
        sort: true,
      },
      {
        title: "Name",
        index: "name",
        className: "text-left",
        width: "420px",
        sort: true,
      },
      {
        title: "Manufacture",
        index: "manufacture",
        className: "text-left",
        sort: true,
      },
      {
        title: "Price",
        index: "retail_price",
        className: "text-left",
        width: "120px",
        sort: true,
      },
      {
        title: "Qtty",
        index: "stock_qtty",
        type: "number",
        width: "80px",
        className: "text-center",
        sort: true,
      },
    ];
  }

  addNewProduct(): void {
    this.newProductModal = true;
  }

  handleCancel(): void {
    this.newProductModal = false;
  }

  handleSave(): void {
    this.newProductModal = false;
  }
}
