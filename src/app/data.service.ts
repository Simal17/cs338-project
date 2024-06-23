import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ALLOW_ANONYMOUS } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'http://localhost:3000/data';  // The URL to the backend endpoint
  constructor(private http: HttpClient) { }
  getData(): Observable<any[]> {

    return this.http.get<any[]>(this.dataUrl,        {
      context: new HttpContext().set(ALLOW_ANONYMOUS, true)
    });    // Fetch data from the backend

  }
}
