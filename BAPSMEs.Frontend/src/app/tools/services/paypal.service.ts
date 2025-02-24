import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from './alert.service';

const url = 'http://127.0.0.1:8000/api/v1';

@Injectable({
  providedIn: 'root'
})
export class PaypalService extends AlertService {


  headers: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json, charset=utf-8'
  );


  constructor(private http: HttpClient) {

    super()
  }

  postOrder(itemDto: any) {
    var body = JSON.stringify(itemDto);
    return this.http.post<ResponseHandler>(`${url}/orders`, itemDto, {
      ...this.headers,
    });
  }


  subscribeOrder(itemDto: any) {
    return this.http.post<ResponseHandler>(`${url}/subscriptions/subscribe`, itemDto, {
      ...this.headers,
    });
  }



}
