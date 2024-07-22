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
}
