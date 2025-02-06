import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from './alert.service';

const url = 'https://orezon.co.zw/api/v1';
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends AlertService {
  constructor(private http: HttpClient) {
    super()
  }

  getSellerOrders() {
    return this.http.get<ResponseHandler>(`${url}/orders/seller`);
  }

  getBuyerOrders() {
    return this.http.get<ResponseHandler>(`${url}/orders`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/admin/orders`);
  }

  order(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/orders`, body, {
      headers,
    });
  }
}
