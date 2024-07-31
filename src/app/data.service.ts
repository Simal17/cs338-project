import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ALLOW_ANONYMOUS } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'http://localhost:3000/data';  // The URL to the backend endpoint
  private dataUrl2 = 'http://localhost:3000/dashdata';
  private dataUrl3 = 'http://localhost:3000/viewdetail';
  private dataUrl4 = 'http://localhost:3000/order';
  private dataUrl5 = 'http://localhost:3000/lowstock';
  private dataUrl6 = 'http://localhost:3000/viewdetail2';
  private userRole = -1;
  constructor(private http: HttpClient) { }
  getData(params: HttpParams): Observable<any[]> {

    return this.http.get<any[]>(this.dataUrl,        {
      context: new HttpContext().set(ALLOW_ANONYMOUS, true),
      params: params
    });    // Fetch data from the backend

  }

  // dashboard data
  getDashData(): Observable<any[]> {

    return this.http.get<any[]>(this.dataUrl2,        {
      context: new HttpContext().set(ALLOW_ANONYMOUS, true)
    });    // Fetch data from the backend

  }

  getWarning(): Observable<any[]> {

    return this.http.get<any[]>(this.dataUrl5,        {
      context: new HttpContext().set(ALLOW_ANONYMOUS, true)
    });    // Fetch data from the backend

  }

   // view details data for each item in the inventory
   getViewDetail(params: HttpParams): Observable<any[]> {

    return this.http.get<any[]>(this.dataUrl3,        {
      context: new HttpContext().set(ALLOW_ANONYMOUS, true),
      params: params
    });    // Fetch data from the backend

  }

     // view details data for each item in the inventory
     getViewDetail2(params: HttpParams): Observable<any[]> {

      return this.http.get<any[]>(this.dataUrl6,        {
        context: new HttpContext().set(ALLOW_ANONYMOUS, true),
        params: params
      });    // Fetch data from the backend
  
    }

  // view order details data in the order view tab
  getOrderDetail(): Observable<any[]> {

    return this.http.get<any[]>(this.dataUrl4,        {
      context: new HttpContext().set(ALLOW_ANONYMOUS, true)
    
    });    // Fetch data from the backend
  }

  setRole(role: number): void {
    this.userRole = role;
  }

  getRole(): number {
    return this.userRole;
  }
}
