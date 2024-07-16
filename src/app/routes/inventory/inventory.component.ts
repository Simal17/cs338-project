import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core";
import { DataService } from "src/app/data.service"; // Import the data service
import { STColumn, STComponent } from "@delon/abc/st";
import { SHARED_IMPORTS } from "@shared";
import { _HttpClient } from "@delon/theme";
import { ALLOW_ANONYMOUS } from "@delon/auth";
import { HttpContext, HttpParams } from "@angular/common/http";
import {
  FormRecord,
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { FORMITEMS, listOfPType, ProductDetail } from "./interface";

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrl: "./inventory.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [...SHARED_IMPORTS],
})
export class InventoryComponent {
  @ViewChild("st", { static: false }) st?: STComponent;
  @ViewChild("buttons", { static: true }) buttons!: TemplateRef<{
    $implicit: any;
    index: number;
    column: STColumn;
  }>;
  newProductModal = false;
  filterModal = false;
  productInfoItems = FORMITEMS.PRODUCTINFO;
  filterItems = FORMITEMS.FILTERINFO;
  searchContent = "";
  newProductType = "";
  newProductDetailItems: ProductDetail[] = [];
  listOfPType = listOfPType;
  constructor(
    private dataService: DataService,
    private fb: NonNullableFormBuilder
  ) {}
  columns: STColumn<any>[] = [];
  data: any[] = [];
  newProductForm: FormRecord<FormControl<any>> = this.fb.record({});
  filterForm: FormRecord<FormControl<any>> = this.fb.record({});
  private readonly http = inject(_HttpClient);
  private apiUrl = "http://localhost:3000/newproduct";
  private apiUrl2 = "http://localhost:3000/filter";
  private apiUrl3 = "http://localhost:3000/search";

  loadData(ptype?: number, model_no?: number): void {
    let params = new HttpParams();
    if (ptype !== undefined && model_no !== undefined) {
      params = params.set("ptype", ptype);
      params = params.set("num", model_no);
    } else if (ptype !== undefined) {
      params = params.set("ptype", ptype);
      params = params.set("num", "0");
    } else if (model_no !== undefined) {
      params = params.set("ptype", "0");
      params = params.set("num", model_no);
    } else {
      params = params.set("ptype", "0");
      params = params.set("num", "0");
    }

    this.dataService.getData(params).subscribe(
      (data) => {
        this.data = data; // Assign the received data to the property
        this.st?.reload();
      },
      (error) => {
        console.error("There was an error retrieving data:", error);
      }
    );
  }

  ngOnInit(): void {
    this.loadData();
    this.columns = [
      {
        title: "Model NO.",
        index: "model_no",
        className: "text-left",
        width: "160px",
        sort: true,
      },
      {
        title: "Type",
        index: "ptype",
        className: "text-left",
        width: "120px",
        sort: true,
      },
      {
        title: "Name",
        index: "name",
        className: "text-left",
        sort: true,
      },
      {
        title: "Manufacture",
        index: "manufacture",
        className: "text-left",
        width: "160px",
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
        width: "120px",
        className: "text-center",
        sort: true,
      },
      {
        width: "120px",
        render: this.buttons,
      },
    ];

    this.filterItems.forEach((item) => {
      this.filterForm.addControl(item, this.fb.control(""));
    });

    this.productInfoItems.forEach((item) => {
      this.newProductForm.addControl(
        item,
        this.fb.control("", [Validators.required])
      );
    });
  }

  performeSearch(): void {
    console.log(this.searchContent);
    if (this.searchContent)
      this.http
        .post(this.apiUrl3, { num: this.searchContent }, null, {
          context: new HttpContext().set(ALLOW_ANONYMOUS, true),
        })
        .subscribe((res) => {
          console.log("Searched Successfully:", res.num);
          if (res.num == "") {
            this.loadData(undefined, undefined);
          } else {
            this.loadData(undefined, res.num);
          }
        });
  }

  resetSearch(): void {
    this.searchContent = "";
    this.loadData();
    this.performeSearch();
    this.filterForm.reset();
  }

  openFilter(): void {
    this.filterModal = true;
  }

  openEditor(item: any): void {}

  deleteProduct(item: any): void {}

  addNewProduct(): void {
    this.newProductModal = true;
  }

  changePType(): void {
    const ptype = (this.newProductForm.controls as any)["ptype"].value;
    this.newProductType = ptype;
    if (ptype === "1") {
      this.newProductDetailItems = FORMITEMS.CASEDETAIL;
    } else if (ptype === "2") {
      this.newProductDetailItems = FORMITEMS.CPUCOOLERDETAIL;
    } else if (ptype === "3") {
      this.newProductDetailItems = FORMITEMS.CPUDETAIL;
    } else if (ptype === "4") {
      this.newProductDetailItems = FORMITEMS.GPUDETAIL;
    } else if (ptype === "5") {
      this.newProductDetailItems = FORMITEMS.MEMORYDETAIL;
    } else if (ptype === "7") {
      this.newProductDetailItems = FORMITEMS.MOBODETAIL;
    } else if (ptype === "8") {
      this.newProductDetailItems = FORMITEMS.PSUDETAIL;
    } else if (ptype === "9") {
      this.newProductDetailItems = FORMITEMS.STORAGEDETAIL;
    }

    this.newProductDetailItems.forEach((item) => {
      if (item.required) {
        this.newProductForm.addControl(
          item.attr,
          this.fb.control("", [Validators.required])
        );
      } else {
        this.newProductForm.addControl(item.attr, this.fb.control(""));
      }
    });
  }

  handleCancel(modalType: string): void {
    if (modalType === "filterModal") {
      this.filterModal = false;
      this.filterForm.reset();
    } else {
      this.newProductModal = false;
      this.newProductForm.reset();
    }
  }

  handleSave(modalType: string): void {
    if (modalType === "filterModal") {
      this.http
        .post(this.apiUrl2, this.filterForm.value, null, {
          context: new HttpContext().set(ALLOW_ANONYMOUS, true),
        })
        .subscribe((res) => {
          console.log("Filtered Successfully:", res.msg);
          this.loadData(res.ptype, undefined);
        });
      this.filterModal = false;
    } else {
      if (this.newProductForm.valid) {
        const product = {
          type: this.newProductType,
          ...this.newProductForm.value,
        };
        console.log(product);

        this.http
          .post(this.apiUrl, product, null, {
            context: new HttpContext().set(ALLOW_ANONYMOUS, true),
          })
          .subscribe((res) => {
            console.log("Product saved successfully:", res.msg);
          });
        this.newProductModal = false;
        this.newProductForm.reset();
        
      } else {
        Object.values(this.newProductForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
  }
}
