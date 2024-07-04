import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, inject } from "@angular/core";
import { DataService } from "src/app/data.service"; // Import the data service
import { STColumn } from "@delon/abc/st";
import { SHARED_IMPORTS } from "@shared";
import { _HttpClient } from '@delon/theme';
import { ALLOW_ANONYMOUS } from '@delon/auth';
import { HttpContext } from '@angular/common/http';
import {
  FormRecord,
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { FORMITEMS, ProductDetail } from "./interface";

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrl: "./inventory.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  imports: [...SHARED_IMPORTS],
})
export class InventoryComponent {
  @ViewChild('buttons', { static: true }) buttons!: TemplateRef<{ $implicit: any; index: number; column: STColumn }>;
  newProductModal = false;
  productInfoItems = FORMITEMS.PRODUCTINFO;
  newProductType = '';
  newProductDetailItems: ProductDetail[] = [];
  constructor(
    private dataService: DataService,
    private fb: NonNullableFormBuilder
    ) {}
  columns: STColumn<any>[] = [];
  data: any[] = [];
  newProductForm: FormRecord<FormControl<any>> = this.fb.record({});
  private readonly http = inject(_HttpClient);
  private apiUrl = 'http://localhost:3000/newproduct';

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
        width: "160px",
        sort: true,
      },
      {
        title: "Type",
        index: "prod_type",
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
        width: '120px',
        render: this.buttons
      }
    ];

    this.productInfoItems.forEach((item) => {
      this.newProductForm.addControl(
        item,
        this.fb.control("", [Validators.required])
      );
    });
  }

  openEditor(item: any): void {

  }

  deleteProduct(item: any): void {

  }

  addNewProduct(): void {
    this.newProductModal = true;
  }

  changePType(): void {
    const ptype = (this.newProductForm.controls as any)['ptype'].value;
    console.log(ptype);
    this.newProductType = ptype;
    if (ptype === 'cpu') {
      this.newProductDetailItems = FORMITEMS.CPUDETAIL;
    }
    this.newProductDetailItems.forEach(item => {
      this.newProductForm.addControl(
        item.attr,
        this.fb.control("", [Validators.required])
      );
    })
  }

  handleCancel(): void {
    this.newProductModal = false;
    this.newProductForm.reset();
  }

  handleSave(): void {
    if (this.newProductForm.valid) {
      const product = {
        type: this.newProductType,
        ...this.newProductForm.value}
      console.log(product);
      
      this.http.post(this.apiUrl, product, null,
        {
          context: new HttpContext().set(ALLOW_ANONYMOUS, true)
        }).subscribe(
        res => {
          console.log('Product saved successfully:', res.msg);
        });
      this.newProductModal = false;
    } else {
      Object.values(this.newProductForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
