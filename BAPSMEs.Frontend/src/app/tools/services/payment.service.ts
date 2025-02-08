import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '.';
import { ResponseHandler } from '../../../models/response-handler';

const url = 'http://127.0.0.1:8000/api/v1';
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
