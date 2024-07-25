import { Routes } from "@angular/router";
import { startPageGuard } from "@core";
import { authSimpleCanActivate, authSimpleCanActivateChild } from "@delon/auth";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { LayoutBasicComponent } from "../layout";
import { InventoryComponent } from "./inventory/inventory.component";
import { OrderviewComponent } from "./orderview/orderview.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutBasicComponent,
    data: {},
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "inventory", component: InventoryComponent },
      { path: 'orderview', component: OrderviewComponent },
    ],
  },
  // passport
  {
    path: "",
    loadChildren: () => import("./passport/routes").then((m) => m.routes),
  },
  {
    path: "exception",
    loadChildren: () => import("./exception/routes").then((m) => m.routes),
  },
  { path: "**", redirectTo: "exception/404" },
];
