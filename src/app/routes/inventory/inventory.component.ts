import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {
  FORMITEMS,
  listOfPType,
  ProductDetail,
  ProductInfo,
} from "./interface";
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrl: "./inventory.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [...SHARED_IMPORTS,NzRadioModule],
})
export class InventoryComponent {
  @ViewChild("st", { static: false }) st?: STComponent;
  @ViewChild("buttons", { static: true }) buttons!: TemplateRef<{
    $implicit: any;
    index: number;
    column: STColumn;
  }>;
  detailModal = false;
  detailItem: any[] = [];
  newProductModal = false;
  filterModal = false;
  filterPtype = "";
  editModal = false;
  productInfoItems = FORMITEMS.PRODUCTINFO;
  filterItems = FORMITEMS.FILTERINFO;
  searchContent = "";
  newProductType = "";
  newProductDetailItems: ProductDetail[] = [];
  listOfPType = listOfPType;
  editProduct: ProductInfo = {};
  constructor(
    private dataService: DataService,
    private fb: NonNullableFormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  columns: STColumn<any>[] = [];
  data: any[] = [];
  newProductForm: FormRecord<FormControl<any>> = this.fb.record({});
  filterForm: FormRecord<FormControl<any>> = this.fb.record({});
  editPriceForm: FormRecord<FormControl<any>> = this.fb.record({});
  private readonly http = inject(_HttpClient);
  private apiUrl = "http://localhost:3000/newproduct";
  private apiUrl3 = "http://localhost:3000/search";
  private apiUrl4 = "http://localhost:3000/del";
  private apiUrl5 = "http://localhost:3000/price";
  private apiUrl6 = "http://localhost:3000/viewdetail";

  loadData(ptype?: number, model_no?: number, manufacture?: string, plow?: number, phigh?: number): void {
    let params = new HttpParams();
    if (ptype !== undefined && manufacture !== undefined && model_no !== undefined &&
        phigh !== undefined && plow !== undefined) {
      params = params.set("ptype", ptype);
      params = params.set("num", model_no);
      params = params.set("manufacture", manufacture);
      params = params.set("plow", plow);
      params = params.set("phigh", phigh);
    } else if (ptype !== undefined && manufacture !== undefined && plow !== undefined && phigh !== undefined) {
      params = params.set("ptype", ptype);
      params = params.set("num", "0");
      params = params.set("manufacture", manufacture);
      params = params.set("plow", plow);
      params = params.set("phigh", phigh);
    } else if (ptype !== undefined && manufacture !== undefined) {
      params = params.set("ptype", ptype);
      params = params.set("num", "0");
      params = params.set("manufacture", manufacture);
      params = params.set("plow", "-1");
      params = params.set("phigh", "-1");
    } else if (ptype !== undefined && plow !== undefined && phigh !== undefined) {
      params = params.set("ptype", ptype);
      params = params.set("num", "0");
      params = params.set("manufacture", "");
      params = params.set("plow", plow);
      params = params.set("phigh", phigh);
    } else if (manufacture !== undefined && plow !== undefined && phigh !== undefined) {
      params = params.set("ptype", "0");
      params = params.set("num", "0");
      params = params.set("manufacture", manufacture);
      params = params.set("plow", plow);
      params = params.set("phigh", phigh);
    } else if (ptype !== undefined) {
      params = params.set("ptype", ptype);
      params = params.set("num", "0");
      params = params.set("manufacture", "");
      params = params.set("plow", "-1");
      params = params.set("phigh", "-1");
    } else if (model_no !== undefined) {
      params = params.set("ptype", "0");
      params = params.set("num", model_no);
      params = params.set("manufacture", "");
      params = params.set("plow", "-1");
      params = params.set("phigh", "-1");
    } else if (manufacture !== undefined) {
      params = params.set("ptype", "0");
      params = params.set("num", "0");
      params = params.set("manufacture", manufacture);
      params = params.set("plow", "-1");
      params = params.set("phigh", "-1");
    } else if (plow !== undefined && phigh !== undefined) {
      params = params.set("ptype", "0");
      params = params.set("num", "0");
      params = params.set("manufacture", "");
      params = params.set("plow", plow);
      params = params.set("phigh", phigh);
    } else {
      params = params.set("ptype", "0");
      params = params.set("num", "0");
      params = params.set("manufacture", "");
      params = params.set("plow", "-1");
      params = params.set("phigh", "-1");
    }
    console.log(params)
    this.dataService.getData(params).subscribe(
      (data) => {
        this.data = data;
        this.cdr.markForCheck();
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
        width: "180px",
        render: this.buttons,
      },
    ];
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
            this.loadData();
          } else {
            this.loadData(undefined, res.num, undefined, undefined, undefined);
          }
        });
  }

  resetSearch(): void {
    this.searchContent = "";
    this.loadData();
    this.performeSearch();
    this.filterForm.reset();
    this.filterPtype = "";
  }

  openFilter(): void {
    this.filterModal = true;

    this.filterItems.forEach((item) => {
      this.filterForm.addControl(item, this.fb.control(""));
    });
  }

  viewDetail(item: any): void {
    this.detailModal = true;
    console.log(item);
    //get the item detail
    let params = new HttpParams();
    params = params.set("ptype", item.ptype);
    params = params.set("num", item.model_no);

    this.dataService.getViewDetail(params).subscribe(
      (data) => {
        this.detailItem = data; // Assign the received data to the property
        console.log(data);
        console.log("Opened detail successfully!");
      },
      (error) => {
        console.error("There was an error retrieving data:", error);
      }
    );
  }

  openEditor(item: any): void {
    this.editModal = true;
    this.editProduct = item;
    this.editPriceForm.addControl(
      "retail_price",
      this.fb.control(item.retail_price, [Validators.required])
    );
  }

  deleteProduct(item: any): void {
    const deleteItem = {
      modelNo: item.model_no,
    };
    console.log(item.model_no);
    this.http
      .post(this.apiUrl4, deleteItem, null, {
        context: new HttpContext().set(ALLOW_ANONYMOUS, true),
      })
      .subscribe((res) => {
        console.log("Deleted Successfully!");
        this.loadData();
      });
  }

  addNewProduct(): void {
    this.newProductModal = true;

    this.productInfoItems.forEach((item) => {
      this.newProductForm.addControl(
        item,
        this.fb.control("", [Validators.required])
      );
    });
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
      this.filterPtype = "";
    } else if (modalType === "newProductModal") {
      this.newProductModal = false;
      this.newProductForm.reset();
    } else {
      this.editModal = false;
      this.editPriceForm.removeControl("retail_price");
    }
  }

  handleSave(modalType: string): void {
    if (modalType === "filterModal") {
      console.log(this.filterForm.value);
      const prangeFilter = this.filterForm.value["prange"];
      if (prangeFilter) {
        console.log(prangeFilter)
        if (prangeFilter === '1') {

        } else if (prangeFilter === '2') {
  
        } else if (prangeFilter === '3') {
  
        } else {
  
        }
      }
      this.loadData(this.filterForm.value["ptype"], undefined, this.filterForm.value["manufacture"], undefined, undefined);
      this.filterModal = false;
    } else if (modalType === "newProductModal") {
      if (this.newProductForm.valid) {
        const product = {
          ptype: this.newProductType,
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
    } else {
      if (this.editPriceForm.valid) {
        this.editProduct.retail_price = (this.editPriceForm.controls as any)[
          "retail_price"
        ].value;
        const product = this.editProduct;
        this.http
          .post(this.apiUrl5, product, null, {
            context: new HttpContext().set(ALLOW_ANONYMOUS, true),
          })
          .subscribe((res) => {
            console.log("Product edited successfully!");
            this.loadData();
          });
        this.editModal = false;
        this.editPriceForm.removeControl("retail_price");
      } else {
        Object.values(this.editPriceForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
  }
}
