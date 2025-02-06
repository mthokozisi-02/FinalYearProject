import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from '.';

const url = 'https://orezon.co.zw/api/v1';
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends AlertService {

  constructor(private http: HttpClient) {
    super()
  }

  getSellerPayments() {
    return this.http.get<ResponseHandler>(`${url}/seller/payments`);
  }

  getBuyerPayments() {
    return this.http.get<ResponseHandler>(`${url}/buyer/payments`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/admin/payments`);
  }
}
