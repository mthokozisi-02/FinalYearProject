import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from './alert.service';


const url = 'http://127.0.0.1:8000/api/v1';
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root'
})
export class PayoutsService extends AlertService {
  url = environment.url;
  constructor(private http: HttpClient) {
    super()
  }

  create() {
    return this.http.post<ResponseHandler>(`${url}/admin/sellers/make-payouts`, {}, {
      headers,
    });
  }



  getAllSellerBalance() {
    return this.http.get<ResponseHandler>(`${url}/admin/sellers-balances`);
  }
}
