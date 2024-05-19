import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'http://localhost:3000/data';  // The URL to the backend endpoint
  constructor(private http: HttpClient) { }
  getData(): Observable<any[]> {

    return this.http.get<any[]>(this.dataUrl);    // Fetch data from the backend

  }
}
